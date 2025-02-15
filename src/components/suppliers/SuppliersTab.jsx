import React from 'react';
import { Button } from '@/components/ui/button';
import SupplierForm from './SupplierForm';
import '../../styles/tables.css';

const SuppliersTab = ({ 
  suppliers, 
  loading, 
  showAddSupplier, 
  editingSupplier,
  onAddClick,
  onEditClick,
  onAddSubmit,
  onEditSubmit,
  onCancel 
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Suppliers</h3>
      <Button onClick={onAddClick}>Add Supplier</Button>
    </div>

    {showAddSupplier && (
      <div className="mb-4">
        <SupplierForm 
          onSubmit={onAddSubmit}
          onCancel={onCancel}
        />
      </div>
    )}

    {loading ? (
      <div className="text-center py-4">Loading suppliers...</div>
    ) : suppliers.length === 0 ? (
      <div className="text-center py-4 text-gray-500">No suppliers found</div>
    ) : (
      <table className="data-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Contact Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              {editingSupplier?.id === supplier.id ? (
                <td colSpan="5">
                  <SupplierForm
                    initialData={supplier}
                    onSubmit={onEditSubmit}
                    onCancel={onCancel}
                  />
                </td>
              ) : (
                <>
                  <td>{supplier.company_name}</td>
                  <td>{supplier.contact_name}</td>
                  <td>{supplier.contact_email}</td>
                  <td>{supplier.contact_phone}</td>
                  <td>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditClick(supplier)}
                    >
                      Edit
                    </Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default SuppliersTab;
