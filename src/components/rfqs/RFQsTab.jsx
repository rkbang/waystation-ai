import React from 'react';
import { Button } from '@/components/ui/button';
import RFQForm from './RFQForm';
import '../../styles/tables.css';

const RFQsTab = ({ 
  rfqs, 
  loading, 
  showAddRFQ,
  editingRFQ,
  onAddClick,
  onEditClick,
  onAddSubmit,
  onEditSubmit,
  onCancel 
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">RFQs</h3>
      <Button onClick={onAddClick}>Create RFQ</Button>
    </div>

    {showAddRFQ && (
      <div className="mb-4">
        <RFQForm 
          onSubmit={onAddSubmit}
          onCancel={onCancel}
        />
      </div>
    )}

    {loading ? (
      <div className="text-center py-4">Loading RFQs...</div>
    ) : rfqs.length === 0 ? (
      <div className="text-center py-4 text-gray-500">No RFQs found</div>
    ) : (
      <table className="data-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Due Date</th>
            <th>Amount (lbs)</th>
            <th>Location</th>
            <th>Certifications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rfqs.map((rfq) => (
            <tr key={rfq.id}>
              {editingRFQ?.id === rfq.id ? (
                <td colSpan="6">
                  <RFQForm
                    initialData={rfq}
                    onSubmit={onEditSubmit}
                    onCancel={onCancel}
                  />
                </td>
              ) : (
                <>
                  <td>{rfq.item}</td>
                  <td>{rfq.due_date}</td>
                  <td>{rfq.amount_lbs?.toLocaleString()}</td>
                  <td>{rfq.ship_to_location}</td>
                  <td>
                    {rfq.required_certifications?.map((cert, i) => (
                      <span key={i} className="tag">
                        {cert}
                      </span>
                    ))}
                  </td>
                  <td>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditClick(rfq)}
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

export default RFQsTab;
