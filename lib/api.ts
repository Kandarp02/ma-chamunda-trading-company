const API_BASE = '/api';

// Stock API functions
export const stockAPI = {
  // Get all stocks
  getAll: async () => {
    const response = await fetch(`${API_BASE}/stocks`);
    if (!response.ok) {
      throw new Error('Failed to fetch stocks');
    }
    const result = await response.json();
    return result.data;
  },

  // Create new stock
  create: async (stock: {
    crop_name: string;
    quantity: number;
  }) => {
    const response = await fetch(`${API_BASE}/stocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stock),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create stock');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Update existing stock
  update: async (id: number, stock: {
    crop_name: string;
    quantity: number;
  }) => {
    const response = await fetch(`${API_BASE}/stocks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stock),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update stock');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Delete stock
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/stocks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete stock');
    }
    
    return response.json();
  }
};

// Purchase Bills API functions
export const purchaseBillAPI = {
  // Get all purchase bills
  getAll: async () => {
    const response = await fetch('/api/purchase-bills')
    if (!response.ok) throw new Error('Failed to fetch purchase bills')
    const result = await response.json()
    return result.data || []
  },
  
  create: async (bill: {
    farmer_name: string
    mobile_number?: string
    items: Array<{
      crop_name: string
      quantity: number
      rate: number
      total: number
    }>
    total_amount: number
    amount_paid: number
    repayment_date?: string | null
    bill_date: string
    labour_charges: number
    weighing_charges: number
  }) => {
    const response = await fetch('/api/purchase-bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bill)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create purchase bill')
    }
    return response.json()
  },

  delete: async (id: number) => {
    const response = await fetch(`/api/purchase-bills/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete purchase bill')
    }
    return response.json()
  }
};

// Sale Bills API functions
export const saleBillAPI = {
  // Get all sale bills
  getAll: async () => {
    const response = await fetch(`${API_BASE}/sale-bills`);
    if (!response.ok) {
      throw new Error('Failed to fetch sale bills');
    }
    const result = await response.json()
    return result.data || []
  },
  
  // Create new sale bill
  create: async (bill: {
    shop_name: string
    mobile_number?: string
    items: Array<{
      crop_name: string
      quantity: number
      rate: number
      total: number
    }>
    total_amount: number
    amount_paid: number
    repayment_date?: string | null
    bill_date: string
    labour_charges: number
    weighing_charges: number
  }) => {
    const response = await fetch(`${API_BASE}/sale-bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bill)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create sale bill')
    }
    return response.json()
  },

  // Delete sale bill
  delete: async (id: number) => {
    const response = await fetch(`/api/sale-bills/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete sale bill')
    }
    return response.json()
  }
};
