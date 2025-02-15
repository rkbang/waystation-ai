import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const SupplierForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    id: initialData?.id,
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    hq_address: '',
    payment_terms: '',
    ...initialData
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name *</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.company_name}
          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
          required
          placeholder="Enter company name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.contact_name}
          onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
          placeholder="Enter contact person's name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={formData.contact_email}
          onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
          placeholder="Enter contact email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact Phone</label>
        <input
          type="tel"
          className="w-full p-2 border rounded"
          value={formData.contact_phone}
          onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
          placeholder="Enter contact phone number"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">HQ Address</label>
        <textarea
          className="w-full p-2 border rounded h-24"
          value={formData.hq_address}
          onChange={(e) => setFormData({...formData, hq_address: e.target.value})}
          placeholder="Enter company headquarters address"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Payment Terms</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.payment_terms}
          onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
          placeholder="e.g., Net 30, Net 60"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          {initialData ? 'Update' : 'Add'} Supplier
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <p className="text-sm text-gray-500">* Required field</p>
    </form>
  );
};

export default SupplierForm;
