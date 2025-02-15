import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveQuoteFromEmail } from './quoteService.js';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('saveQuoteFromEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockData = {
    supplier: {
      company_name: 'Test Company',
      contact_name: 'John Doe',
      contact_email: 'test@example.com'
    },
    quote: {
      price_per_pound: 10.00,
      certifications: ['Test'],
      minimum_order_quantity: 1000,
      country_of_origin: 'USA'
    }
  };

  it('should save data successfully', async () => {
    // Mock for suppliers table
    const mockSuppliersResponse = {
      data: [{ id: 1 }],
      error: null
    };

    // Mock for quotes table
    const mockQuotesResponse = {
      data: [{
        id: 1,
        rfq_id: 1,
        supplier_id: 1,
        ...mockData.quote,
        supplier: mockData.supplier
      }],
      error: null
    };

    // Setup mock implementation
    supabase.from.mockImplementation((table) => {
      if (table === 'suppliers') {
        return {
          select: () => ({
            eq: () => Promise.resolve(mockSuppliersResponse)
          }),
          update: () => ({
            eq: () => Promise.resolve({ data: mockSuppliersResponse.data, error: null })
          })
        };
      }
      if (table === 'quotes') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ data: [] })
            })
          }),
          insert: () => ({
            select: () => Promise.resolve(mockQuotesResponse)
          })
        };
      }
      if (table === 'emails') {
        return {
          insert: () => Promise.resolve({ data: null, error: null })
        };
      }
    });

    const result = await saveQuoteFromEmail(mockData, 1, 'test email');
    
    expect(result).toBeDefined();
    expect(result.supplier).toBeDefined();
    expect(result.quote).toBeDefined();
    expect(result.quote.id).toBe(1);
  });

  it('should handle database error', async () => {
    supabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => Promise.reject(new Error('Database error'))
      })
    }));

    await expect(
      saveQuoteFromEmail(mockData, 1, 'test email')
    ).rejects.toThrow('Failed to save quote: Database error');
  });
});