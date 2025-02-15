import { supabase } from '../../lib/supabase';

export const saveQuoteFromEmail = async (parsedData, rfqId, emailContent) => {
  try {
    // First, check if supplier exists
    let { data: existingSuppliers } = await supabase
      .from('suppliers')
      .select('id')
      .eq('company_name', parsedData.supplier.company_name);

    let supplierId;

    if (existingSuppliers?.length > 0) {
      // Update existing supplier
      supplierId = existingSuppliers[0].id;
      const { error: updateError } = await supabase
        .from('suppliers')
        .update(parsedData.supplier)
        .eq('id', supplierId);

      if (updateError) throw updateError;
    } else {
      // Create new supplier
      const { data: newSupplier, error: insertError } = await supabase
        .from('suppliers')
        .insert([parsedData.supplier])
        .select();

      if (insertError) throw insertError;
      supplierId = newSupplier[0].id;
    }

    // Check if quote exists for this RFQ and supplier
    const { data: existingQuotes } = await supabase
      .from('quotes')
      .select('id')
      .eq('rfq_id', rfqId)
      .eq('supplier_id', supplierId);

    const quoteData = {
      rfq_id: rfqId,
      supplier_id: supplierId,
      price_per_pound: parsedData.quote.price_per_pound,
      certifications: parsedData.quote.certifications,
      minimum_order_quantity: parsedData.quote.minimum_order_quantity,
      country_of_origin: parsedData.quote.country_of_origin,
      date_submitted: new Date().toISOString()
    };

    let newQuote;
    if (existingQuotes?.length > 0) {
      // Update existing quote
      const { data: updatedQuote, error: updateError } = await supabase
        .from('quotes')
        .update(quoteData)
        .eq('id', existingQuotes[0].id)
        .select('*, supplier:suppliers(*)');

      if (updateError) throw updateError;
      newQuote = updatedQuote[0];

      // Save the email content with existing quote id
      const emailData = {
        quote_id: existingQuotes[0].id,
        content: emailContent,
        extracted_data: parsedData
      };

      const { error: emailError } = await supabase
        .from('emails')
        .insert([emailData]);

      if (emailError) throw emailError;

    } else {
      // Create new quote
      const { data: insertedQuote, error: insertError } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select('*, supplier:suppliers(*)');

      if (insertError) throw insertError;
      newQuote = insertedQuote[0];

      // Save the email content with new quote id
      const emailData = {
        quote_id: newQuote.id,
        content: emailContent,
        extracted_data: parsedData
      };

      const { error: emailError } = await supabase
        .from('emails')
        .insert([emailData]);

      if (emailError) throw emailError;
    }

    return {
      supplier: parsedData.supplier,
      quote: newQuote
    };
  } catch (error) {
    console.error('Error saving quote:', error);
    throw new Error(`Failed to save quote: ${error.message}`);
  }
};