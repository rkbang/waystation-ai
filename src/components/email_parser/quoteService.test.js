import { describe, it, expect, vi } from 'vitest';
import { saveQuoteFromEmail } from './quoteService';
import { supabase } from '../../lib/supabase';

// Mock Supabase with method chaining
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [] })
        })
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [] })
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ 
          data: [{ id: 1 }],
          error: null 
        })
      })
    })
  }
}));


describe('saveQuoteFromEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockData = {
    supplier: {
      company_name: 'Test Supplier',
      contact_name: 'John Doe',
      contact_email: 'test@supplier.com',
      contact_phone: '123-456-7890',
      hq_address: 'Test Address'
    },
    quote: {
      price_per_pound: 10.5,
      certifications: ['GMO-Free'],
      minimum_order_quantity: 100,
      country_of_origin: 'USA'
    }
  };

  it('creates new supplier and quote', async () => {
    supabase.from('suppliers').select().eq('company_name', mockData.supplier.company_name).eq =
      vi.fn().mockResolvedValue({ data: [] });

    supabase.from('quotes').select().eq('rfq_id', 1).eq('supplier_id', 1).eq =
      vi.fn().mockResolvedValue({ data: [] });

    const result = await saveQuoteFromEmail(mockData, 1);
    expect(result).toBeDefined();
  });

  it('updates existing supplier and creates new quote', async () => {
    // Mock the entire flow of supplier and quote operations
    supabase.from = vi.fn().mockImplementation((table) => {
      if (table === 'suppliers') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [{ id: 1, ...mockData.supplier }]
            })
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue({
                data: [{ id: 1, ...mockData.supplier }],
                error: null
              })
            })
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({
              data: [{ id: 1, ...mockData.supplier }],
              error: null
            })
          })
        };
      }
  
      if (table === 'quotes') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: []
              })
            })
          }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue({
                data: [{ 
                  id: 1, 
                  ...mockData.quote, 
                  rfq_id: 1, 
                  supplier_id: 1,
                  supplier: { id: 1, ...mockData.supplier }
                }],
                error: null
              })
            })
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({
              data: [{ 
                id: 1, 
                ...mockData.quote, 
                rfq_id: 1, 
                supplier_id: 1,
                supplier: { id: 1, ...mockData.supplier }
              }],
              error: null
            })
          })
        };
      }
    });
  
    const result = await saveQuoteFromEmail(mockData, 1);
  
    // Assertions to verify the result
    expect(result).toBeDefined();
    expect(result.supplier).toEqual(mockData.supplier);
    expect(result.quote).toBeDefined();
    expect(result.quote.id).toBe(1);
  });
  

  it('handles database error', async () => {
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockRejectedValue(new Error('Database error'))
      })
    }));

    await expect(saveQuoteFromEmail(mockData, 1)).rejects.toThrow('Database error');
  });
});
