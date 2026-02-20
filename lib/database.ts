import { query, transaction, initializeDatabase } from './db-postgres';

// Re-export database functions for compatibility
export { query, transaction, initializeDatabase };

// Admin authentication queries
export const adminQueries = {
  authenticate: async (username: string, password: string) => {
    const result = await query(
      'SELECT id, username, role FROM admin_users WHERE username = $1 AND password = $2',
      [username, password]
    );
    return result.rows[0] || null;
  },
  
  getAll: async () => {
    const result = await query('SELECT id, username, role, created_at FROM admin_users');
    return result.rows;
  },
  
  create: async (username: string, password: string, role: string = 'admin') => {
    const result = await query(
      'INSERT INTO admin_users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, role]
    );
    return result.rows[0];
  },
  
  update: async (id: number, updates: { username?: string; password?: string; role?: string }) => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (updates.username) {
      fields.push(`username = $${paramCount++}`);
      values.push(updates.username);
    }
    if (updates.password) {
      fields.push(`password = $${paramCount++}`);
      values.push(updates.password);
    }
    if (updates.role) {
      fields.push(`role = $${paramCount++}`);
      values.push(updates.role);
    }
    
    values.push(id);
    const result = await query(
      `UPDATE admin_users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, username, role`,
      values
    );
    return result.rows[0];
  },
  
  delete: async (id: number) => {
    await query('DELETE FROM admin_users WHERE id = $1', [id]);
    return true;
  }
};

// Stock management queries
export const stockQueries = {
  getAll: async () => {
    const result = await query('SELECT * FROM crop_stock ORDER BY crop_name');
    return result.rows;
  },
  
  getById: async (id: number) => {
    const result = await query('SELECT * FROM crop_stock WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
  
  getByName: async (cropName: string) => {
    const result = await query('SELECT * FROM crop_stock WHERE crop_name = $1', [cropName]);
    return result.rows[0] || null;
  },
  
  create: async (cropName: string, quantity: number) => {
    const result = await query(
      'INSERT INTO crop_stock (crop_name, quantity) VALUES ($1, $2) RETURNING *',
      [cropName, quantity]
    );
    return result.rows[0];
  },
  
  update: async (id: number, quantity: number) => {
    const result = await query(
      'UPDATE crop_stock SET quantity = $1, last_updated = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    return result.rows[0];
  },
  
  updateQuantity: async (cropName: string, quantityChange: number) => {
    const result = await query(
      'UPDATE crop_stock SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE crop_name = $2 RETURNING *',
      [quantityChange, cropName]
    );
    return result.rows[0];
  },
  
  delete: async (id: number) => {
    await query('DELETE FROM crop_stock WHERE id = $1', [id]);
    return true;
  }
};

// Purchase bill queries
export const purchaseBillQueries = {
  getAll: async () => {
    const result = await query('SELECT * FROM purchase_bills ORDER BY created_at DESC');
    return result.rows;
  },
  
  getById: async (id: number) => {
    const billResult = await query('SELECT * FROM purchase_bills WHERE id = $1', [id]);
    if (!billResult.rows[0]) return null;
    
    const itemsResult = await query('SELECT * FROM purchase_bill_items WHERE bill_id = $1', [id]);
    return {
      ...billResult.rows[0],
      items: itemsResult.rows
    };
  },
  
  create: async (billData: any) => {
    return await transaction(async (client) => {
      // Insert bill
      const billResult = await client.query(
        `INSERT INTO purchase_bills 
         (farmer_name, mobile_number, total_amount, amount_paid, amount_remaining, 
          repayment_date, bill_date, labour_charges, weighing_charges) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
          billData.farmer_name,
          billData.mobile_number,
          billData.total_amount,
          billData.amount_paid,
          billData.amount_remaining,
          billData.repayment_date,
          billData.bill_date,
          billData.labour_charges || 0,
          billData.weighing_charges || 0
        ]
      );
      
      const bill = billResult.rows[0];
      
      // Insert items
      for (const item of billData.items) {
        await client.query(
          `INSERT INTO purchase_bill_items 
           (bill_id, crop_name, quantity, rate, total) 
           VALUES ($1, $2, $3, $4, $5)`,
          [bill.id, item.crop_name, item.quantity, item.rate, item.total]
        );
        
        // Update stock
        await client.query(
          `INSERT INTO crop_stock (crop_name, quantity) 
           VALUES ($1, $2) 
           ON CONFLICT (crop_name) 
           DO UPDATE SET quantity = crop_stock.quantity + $2, last_updated = CURRENT_TIMESTAMP`,
          [item.crop_name, item.quantity]
        );
      }
      
      return bill;
    });
  },
  
  update: async (id: number, billData: any) => {
    return await transaction(async (client) => {
      // Update bill
      const result = await client.query(
        `UPDATE purchase_bills 
         SET farmer_name = $1, mobile_number = $2, total_amount = $3, 
             amount_paid = $4, amount_remaining = $5, repayment_date = $6 
         WHERE id = $7 RETURNING *`,
        [
          billData.farmer_name,
          billData.mobile_number,
          billData.total_amount,
          billData.amount_paid,
          billData.amount_remaining,
          billData.repayment_date,
          id
        ]
      );
      return result.rows[0];
    });
  },
  
  delete: async (id: number) => {
    return await transaction(async (client) => {
      // Get items to restore stock
      const itemsResult = await client.query(
        'SELECT crop_name, quantity FROM purchase_bill_items WHERE bill_id = $1',
        [id]
      );
      
      // Restore stock
      for (const item of itemsResult.rows) {
        await client.query(
          'UPDATE crop_stock SET quantity = quantity - $1 WHERE crop_name = $2',
          [item.quantity, item.crop_name]
        );
      }
      
      // Delete bill (items will cascade)
      await client.query('DELETE FROM purchase_bills WHERE id = $1', [id]);
      return true;
    });
  }
};

// Sale bill queries
export const saleBillQueries = {
  getAll: async () => {
    const result = await query('SELECT * FROM sale_bills ORDER BY created_at DESC');
    return result.rows;
  },
  
  getById: async (id: number) => {
    const billResult = await query('SELECT * FROM sale_bills WHERE id = $1', [id]);
    if (!billResult.rows[0]) return null;
    
    const itemsResult = await query('SELECT * FROM sale_bill_items WHERE bill_id = $1', [id]);
    return {
      ...billResult.rows[0],
      items: itemsResult.rows
    };
  },
  
  create: async (billData: any) => {
    return await transaction(async (client) => {
      // Check stock availability
      for (const item of billData.items) {
        const stockResult = await client.query(
          'SELECT quantity FROM crop_stock WHERE crop_name = $1',
          [item.crop_name]
        );
        const availableStock = stockResult.rows[0]?.quantity || 0;
        if (availableStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.crop_name}. Available: ${availableStock}, Required: ${item.quantity}`);
        }
      }
      
      // Insert bill
      const billResult = await client.query(
        `INSERT INTO sale_bills 
         (customer_name, mobile_number, total_amount, amount_paid, amount_remaining, 
          repayment_date, bill_date, labour_charges, weighing_charges) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
          billData.customer_name,
          billData.mobile_number,
          billData.total_amount,
          billData.amount_paid,
          billData.amount_remaining,
          billData.repayment_date,
          billData.bill_date,
          billData.labour_charges || 0,
          billData.weighing_charges || 0
        ]
      );
      
      const bill = billResult.rows[0];
      
      // Insert items and update stock
      for (const item of billData.items) {
        await client.query(
          `INSERT INTO sale_bill_items 
           (bill_id, crop_name, quantity, rate, total) 
           VALUES ($1, $2, $3, $4, $5)`,
          [bill.id, item.crop_name, item.quantity, item.rate, item.total]
        );
        
        await client.query(
          'UPDATE crop_stock SET quantity = quantity - $1 WHERE crop_name = $2',
          [item.quantity, item.crop_name]
        );
      }
      
      return bill;
    });
  },
  
  update: async (id: number, billData: any) => {
    return await transaction(async (client) => {
      const result = await client.query(
        `UPDATE sale_bills 
         SET customer_name = $1, mobile_number = $2, total_amount = $3, 
             amount_paid = $4, amount_remaining = $5, repayment_date = $6 
         WHERE id = $7 RETURNING *`,
        [
          billData.customer_name,
          billData.mobile_number,
          billData.total_amount,
          billData.amount_paid,
          billData.amount_remaining,
          billData.repayment_date,
          id
        ]
      );
      return result.rows[0];
    });
  },
  
  delete: async (id: number) => {
    return await transaction(async (client) => {
      // Get items to restore stock
      const itemsResult = await client.query(
        'SELECT crop_name, quantity FROM sale_bill_items WHERE bill_id = $1',
        [id]
      );
      
      // Restore stock
      for (const item of itemsResult.rows) {
        await client.query(
          'UPDATE crop_stock SET quantity = quantity + $1 WHERE crop_name = $2',
          [item.quantity, item.crop_name]
        );
      }
      
      await client.query('DELETE FROM sale_bills WHERE id = $1', [id]);
      return true;
    });
  }
};

// Legacy compatibility - export getDatabase for old code
export const getDatabase = () => {
  console.warn('getDatabase() is deprecated, use query() or transaction() instead');
  return {
    prepare: () => {
      throw new Error('SQLite syntax not supported. Use query() or transaction() from lib/database.ts');
    },
    exec: () => {
      throw new Error('SQLite syntax not supported. Use query() or transaction() from lib/database.ts');
    },
    pragma: () => {
      throw new Error('SQLite syntax not supported. Use query() or transaction() from lib/database.ts');
    },
    close: () => Promise.resolve()
  };
};
