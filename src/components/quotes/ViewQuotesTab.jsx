import React, { useState, useEffect } from 'react';
import { getQuotesForRfq } from './quotesService';
import '../../styles/tables.css';

const ViewQuotesTab = ({ rfqs }) => {
  const [selectedRfq, setSelectedRfq] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedRfq) {
      fetchQuotes(selectedRfq);
    }
  }, [selectedRfq]);

  const fetchQuotes = async (rfqId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuotesForRfq(rfqId);
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select RFQ</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedRfq}
          onChange={(e) => setSelectedRfq(e.target.value)}
        >
          <option value="">Select an RFQ</option>
          {rfqs.map(rfq => (
            <option key={rfq.id} value={rfq.id}>
              {rfq.item} - Due {formatDate(rfq.due_date)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading quotes...</div>
      ) : selectedRfq ? (
        quotes.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Price/lb</th>
                <th>MOQ</th>
                <th>Origin</th>
                <th>Submission Date</th>
                <th>Certifications</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id}>
                  <td>{quote.supplier.company_name}</td>
                  <td>
                    <div>{quote.supplier.contact_name}</div>
                    <div className="text-sm text-gray-500">{quote.supplier.contact_email}</div>
                    {quote.supplier.contact_phone && (
                      <div className="text-sm text-gray-500">{quote.supplier.contact_phone}</div>
                    )}
                  </td>
                  <td>{formatPrice(quote.price_per_pound)}</td>
                  <td>{quote.minimum_order_quantity?.toLocaleString()} lbs</td>
                  <td>{quote.country_of_origin}</td>
                  <td>{formatDate(quote.date_submitted)}</td>
                  <td>
                    {quote.certifications?.map((cert, i) => (
                      <span key={i} className="tag">
                        {cert}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No quotes found for this RFQ
          </div>
        )
      ) : (
        <div className="text-center py-4 text-gray-500">
          Select an RFQ to view quotes
        </div>
      )}
    </div>
  );
};

export default ViewQuotesTab;
