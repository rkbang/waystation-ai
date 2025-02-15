import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const RFQForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    id: initialData?.id,
    item: '',
    due_date: '',
    amount_lbs: '',
    ship_to_location: '',
    required_certifications: initialData?.required_certifications || [],
    ...initialData
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Item *</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.item}
          onChange={(e) => setFormData({...formData, item: e.target.value})}
          required
          placeholder="Enter item name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Due Date *</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.due_date}
          onChange={(e) => setFormData({...formData, due_date: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount (lbs) *</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={formData.amount_lbs}
          onChange={(e) => setFormData({...formData, amount_lbs: e.target.value})}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ship to Location</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.ship_to_location}
          onChange={(e) => setFormData({...formData, ship_to_location: e.target.value})}
          placeholder="Enter shipping location"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Required Certifications</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.required_certifications?.join(', ')}
          onChange={(e) => setFormData({
            ...formData, 
            required_certifications: e.target.value.split(',').map(cert => cert.trim())
          })}
          placeholder="Enter certifications (comma-separated, e.g., GMO-free, Organic)"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          {initialData ? 'Update' : 'Add'} RFQ
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <p className="text-sm text-gray-500">* Required field</p>
    </form>
  );
};

export default RFQForm;
