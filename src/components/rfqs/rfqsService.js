import { supabase } from '../../lib/supabase';

export const fetchRFQs = async () => {
  const { data, error } = await supabase
    .from('rfqs')
    .select('*')
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const addRFQ = async (rfqData) => {
  const { data, error } = await supabase
    .from('rfqs')
    .insert([{
      item: rfqData.item,
      due_date: rfqData.due_date,
      amount_lbs: rfqData.amount_lbs,
      ship_to_location: rfqData.ship_to_location,
      required_certifications: rfqData.required_certifications
    }])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateRFQ = async (rfqData) => {
  const { data, error } = await supabase
    .from('rfqs')
    .update({
      item: rfqData.item,
      due_date: rfqData.due_date,
      amount_lbs: rfqData.amount_lbs,
      ship_to_location: rfqData.ship_to_location,
      required_certifications: rfqData.required_certifications
    })
    .eq('id', rfqData.id)
    .select();

  if (error) throw error;
  return data[0];
};
