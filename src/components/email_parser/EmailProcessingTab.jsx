import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { parseEmailWithGPT } from '../../services/openaiService';
import { parseEmailWithGemini } from '../../services/geminiService';
import { saveQuoteFromEmail } from './quoteService';

const EmailProcessingTab = ({ rfqs }) => {
  const [emailContent, setEmailContent] = useState('');
  const [selectedRfq, setSelectedRfq] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Simple regex-based parsing
  const parseEmail = (content) => {
    try {
      console.log('Parsing email with regex:', content);
      
      // Basic regex patterns
      const extractedData = {
        company_name: content.match(/NutraSource Supply/)?.[0] || '',
        contact_name: content.match(/[Rr]egards,\s*(.*?)(?:\s*Sales\s+Manager|$)/m)?.[1] || '',
        contact_email: content.match(/[Ee]mail:\s*([^\s]+@[^\s]+)/)?.[1] || '',
        contact_phone: content.match(/[Pp]hone:\s*([^,\n]+)/)?.[1] || '',
        price: content.match(/Price per Pound:\s*\$?([\d.]+)/)?.[1] || '',
        certifications: (content.match(/Certifications:([^]*?)(?=\n\n|\n[A-Z]|$)/i)?.[1] || '')
          .split(',')
          .map(cert => cert.trim())
          .filter(Boolean)
      };

      console.log('Extracted data:', extractedData);

      return {
        supplier: {
          company_name: extractedData.company_name,
          contact_name: extractedData.contact_name,
          contact_email: extractedData.contact_email,
          contact_phone: extractedData.contact_phone,
          hq_address: '',
          payment_terms: ''
        },
        quote: {
          price_per_pound: parseFloat(extractedData.price) || 0,
          certifications: extractedData.certifications
        }
      };
    } catch (error) {
      console.error('Error in parseEmail:', error);
      throw error;
    }
  };

  const handleProcessEmail = async () => {
    if (!selectedRfq || !emailContent) {
      setError('Please select an RFQ and provide email content');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let parsedData;
      let method;

      // Try OpenAI first
      try {
        console.log('Attempting OpenAI parsing...');
        parsedData = await parseEmailWithGPT(emailContent);
        method = 'OpenAI';
        console.log('OpenAI parsing successful:', parsedData);
      } catch (openaiError) {
        console.warn('OpenAI parsing failed, falling back to Gemini:', openaiError);
        try {
          console.log('Attempting Gemini parsing...');
          parsedData = await parseEmailWithGemini(emailContent);
          method = 'Gemini';
        } catch (geminiError) {
          console.warn('Gemini parsing failed, falling back to regex:', geminiError);
          parsedData = parseEmail(emailContent);
          method = 'Regex';
        }
      }

      console.log('Final parsed data:', parsedData);

      // Save both parsed data and email content
      const savedData = await saveQuoteFromEmail(parsedData, selectedRfq, emailContent);

      setResult({
        message: 'Email processed and saved successfully',
        method: method,
        data: savedData
      });

      // Clear form after successful save
      setEmailContent('');
      setSelectedRfq('');
    } catch (error) {
      console.error('Error processing email:', error);
      setError(error.message || 'Failed to process email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Process Quote Email</h3>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-50 text-green-700 rounded">
          <p>{result.message}</p>
          <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded bg-blue-100 text-blue-800">
            Parsed using: {result.method}
          </span>
          <div className="mt-4">
            <h4 className="font-medium">Parsed Information:</h4>
            <div className="mt-2 p-4 bg-white rounded shadow">
              <h5 className="font-medium">Supplier Information:</h5>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(result.data.supplier, null, 2)}
              </pre>
              <h5 className="font-medium mt-4">Quote Information:</h5>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(result.data.quote, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select RFQ *</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedRfq}
            onChange={(e) => setSelectedRfq(e.target.value)}
            required
          >
            <option value="">Select an RFQ</option>
            {rfqs.map(rfq => (
              <option key={rfq.id} value={rfq.id}>
                {rfq.item} - Due {rfq.due_date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Paste Email Content *</label>
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="w-full min-h-[200px] p-2 border rounded"
            placeholder="Paste supplier email content here..."
            required
          />
        </div>

        <Button 
          onClick={handleProcessEmail}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Process Email'}
        </Button>
      </div>
    </div>
  );
};

export default EmailProcessingTab;