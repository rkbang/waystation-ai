import { supabase } from '../../lib/supabase';

export const fetchSuppliers = async () => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('company_name', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const addSupplier = async (supplierData) => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([{
      company_name: supplierData.company_name,
      contact_name: supplierData.contact_name,
      contact_email: supplierData.contact_email,
      contact_phone: supplierData.contact_phone,
      hq_address: supplierData.hq_address,
      payment_terms: supplierData.payment_terms
    }])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateSupplier = async (supplierData) => {
  const { data, error } = await supabase
    .from('suppliers')
    .update({
      company_name: supplierData.company_name,
      contact_name: supplierData.contact_name,
      contact_email: supplierData.contact_email,
      contact_phone: supplierData.contact_phone,
      hq_address: supplierData.hq_address,
      payment_terms: supplierData.payment_terms
    })
    .eq('id', supplierData.id)
    .select();

  if (error) throw error;
  return data[0];
};
