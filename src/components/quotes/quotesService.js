import { supabase } from '../../lib/supabase';

export const getQuotesForRfq = async (rfqId) => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        supplier:suppliers(*)
      `)
      .eq('rfq_id', rfqId)
      .order('price_per_pound', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw new Error('Failed to fetch quotes');
  }
};
