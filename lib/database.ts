import Database from 'better-sqlite3';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'agricultural-trading.db');

// Create database connection
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    initializeDatabase(db);
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function reopenDatabase(): Database.Database {
  closeDatabase();
  return getDatabase();
}

function initializeDatabase(database: Database.Database) {
  // Use DELETE journal mode for better persistence
  database.pragma('journal_mode = DELETE');
  database.pragma('synchronous = FULL');
  database.pragma('cache_size = 1000');
  database.pragma('temp_store = MEMORY');
  
  // Create AdminUsers table
  database.exec(`
    CREATE TABLE IF NOT EXISTS AdminUsers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin users if no users exist
  const adminCount = database.prepare('SELECT COUNT(*) as count FROM AdminUsers').get() as { count: number };
  if (adminCount.count === 0) {
    // Default admin users
    database.prepare(`
      INSERT INTO AdminUsers (username, password, role)
      VALUES (?, ?, ?)
    `).run('chamundamata', 'mayur@123', 'admin');
    
    database.prepare(`
      INSERT INTO AdminUsers (username, password, role)
      VALUES (?, ?, ?)
    `).run('matachamunda', 'ganesh@123', 'admin');
    
    console.log('Default admin users created:');
    console.log('- chamundamata / mayur@123');
    console.log('- matachamunda / ganesh@123');
  }

  // Create CropStock table (replaces stocks table)
  database.exec(`
    CREATE TABLE IF NOT EXISTS CropStock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop_name TEXT UNIQUE NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create PurchaseBills table (Farmer Purchase)
  database.exec(`
    CREATE TABLE IF NOT EXISTS PurchaseBills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_name TEXT NOT NULL,
      mobile_number TEXT,
      total_amount REAL NOT NULL,
      amount_paid REAL NOT NULL,
      amount_remaining REAL NOT NULL,
      repayment_date TEXT,
      bill_date TEXT NOT NULL,
      labour_charges REAL DEFAULT 0,
      weighing_charges REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add mobile_number column if it doesn't exist (for existing databases)
  try {
    database.prepare(`SELECT mobile_number FROM PurchaseBills LIMIT 1`).get();
  } catch (e) {
    console.log('Adding mobile_number column to PurchaseBills table...');
    database.exec(`ALTER TABLE PurchaseBills ADD COLUMN mobile_number TEXT`);
    console.log('mobile_number column added to PurchaseBills');
  }

  // Create PurchaseBillItems table for multiple items
  database.exec(`
    CREATE TABLE IF NOT EXISTS PurchaseBillItems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      rate REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (bill_id) REFERENCES PurchaseBills(id) ON DELETE CASCADE
    )
  `);

  // Create SaleBills table (Shop Sale)
  database.exec(`
    CREATE TABLE IF NOT EXISTS SaleBills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_name TEXT NOT NULL,
      mobile_number TEXT,
      total_amount REAL NOT NULL,
      amount_paid REAL NOT NULL,
      amount_remaining REAL NOT NULL,
      repayment_date TEXT,
      bill_date TEXT NOT NULL,
      labour_charges REAL NOT NULL,
      weighing_charges REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add mobile_number column if it doesn't exist (for existing databases)
  try {
    database.prepare(`SELECT mobile_number FROM SaleBills LIMIT 1`).get();
  } catch (e) {
    console.log('Adding mobile_number column to SaleBills table...');
    database.exec(`ALTER TABLE SaleBills ADD COLUMN mobile_number TEXT`);
    console.log('mobile_number column added to SaleBills');
  }

  // Create SaleBillItems table for multiple items
  database.exec(`
    CREATE TABLE IF NOT EXISTS SaleBillItems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      rate REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (bill_id) REFERENCES SaleBills(id) ON DELETE CASCADE
    )
  `);

  // Create Transactions table for audit trail
  database.exec(`
    CREATE TABLE IF NOT EXISTS Transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_type TEXT NOT NULL CHECK (transaction_type IN ('PURCHASE', 'SALE')),
      bill_type TEXT NOT NULL,
      bill_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      rate REAL NOT NULL,
      total_amount REAL NOT NULL,
      amount_paid REAL NOT NULL,
      amount_remaining REAL NOT NULL,
      repayment_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert initial crop stock data
  const stockCount = database.prepare('SELECT COUNT(*) as count FROM CropStock').get() as { count: number };
  if (stockCount.count === 0) {
    const crops = ['Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Sugarcane'];
    const insertStock = database.prepare('INSERT INTO CropStock (crop_name, quantity) VALUES (?, ?)');
    
    crops.forEach(crop => {
      insertStock.run(crop, 0);
    });
  }

  console.log('Database initialized successfully with new schema');
}

// Stock queries
export const stockQueries = {
  // Get all stock
  getAll: () => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM CropStock ORDER BY crop_name').all();
  },

  // Get stock by ID
  getById: (id: number) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM CropStock WHERE id = ?').get(id);
  },

  // Get stock by crop name
  getByName: (cropName: string) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM CropStock WHERE crop_name = ?').get(cropName);
  },

  // Update stock by ID
  update: (id: number, stock: { crop_name: string; quantity: number }) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE CropStock 
      SET crop_name = ?, quantity = ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(stock.crop_name, stock.quantity, id);
  },

  // Update stock quantity
  updateQuantity: (cropName: string, quantityChange: number) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE CropStock 
      SET quantity = quantity + ?, last_updated = CURRENT_TIMESTAMP
      WHERE crop_name = ?
    `);
    return stmt.run(quantityChange, cropName);
  },

  // Upsert stock (insert or update)
  upsertStock: (cropName: string, quantity: number) => {
    const db = getDatabase();
    
    // Check if stock exists
    const existing = db.prepare('SELECT * FROM CropStock WHERE crop_name = ?').get(cropName);
    
    if (existing) {
      // Update existing stock
      const stmt = db.prepare(`
        UPDATE CropStock 
        SET quantity = quantity + ?, last_updated = CURRENT_TIMESTAMP
        WHERE crop_name = ?
      `);
      return stmt.run(quantity, cropName);
    } else {
      // Insert new stock
      const stmt = db.prepare(`
        INSERT INTO CropStock (crop_name, quantity)
        VALUES (?, ?)
      `);
      return stmt.run(cropName, quantity);
    }
  },

  // Delete stock by ID
  delete: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM CropStock WHERE id = ?');
    return stmt.run(id);
  },

  // Check if sufficient stock exists
  checkAvailability: (cropName: string, requiredQuantity: number) => {
    const db = getDatabase();
    const stock = db.prepare('SELECT quantity FROM CropStock WHERE crop_name = ?').get(cropName) as { quantity: number } | undefined;
    return stock ? stock.quantity >= requiredQuantity : false;
  }
};

// Purchase bill queries with multi-item support
export const purchaseBillQueries = {
  // Get all purchase bills with their items
  getAll: () => {
    const db = getDatabase();
    const bills = db.prepare('SELECT * FROM PurchaseBills ORDER BY created_at DESC').all();
    
    // Get items for each bill
    return bills.map((bill: any) => {
      const items = db.prepare('SELECT * FROM PurchaseBillItems WHERE bill_id = ?').all(bill.id);
      return { ...bill, items };
    });
  },

  // Get purchase bill by ID with items
  getById: (id: number) => {
    const db = getDatabase();
    const bill = db.prepare('SELECT * FROM PurchaseBills WHERE id = ?').get(id);
    if (!bill) return null;
    
    const items = db.prepare('SELECT * FROM PurchaseBillItems WHERE bill_id = ?').all(id);
    return { ...(bill as object), items };
  },

  // Create new purchase bill with multiple items
  create: (bill: {
    farmer_name: string;
    mobile_number: string;
    total_amount: number;
    amount_paid: number;
    amount_remaining: number;
    repayment_date?: string;
    bill_date: string;
    labour_charges: number;
    weighing_charges: number;
    items: Array<{
      crop_name: string;
      quantity: number;
      rate: number;
      total: number;
    }>;
  }) => {
    const db = getDatabase();
    
    const transaction = db.transaction(() => {
      // Create purchase bill
      const stmt = db.prepare(`
        INSERT INTO PurchaseBills (
          farmer_name, mobile_number, total_amount, 
          amount_paid, amount_remaining, repayment_date, bill_date, labour_charges, weighing_charges
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        bill.farmer_name,
        bill.mobile_number || '',
        bill.total_amount,
        bill.amount_paid,
        bill.amount_remaining,
        bill.repayment_date || null,
        bill.bill_date,
        bill.labour_charges,
        bill.weighing_charges
      );

      const billId = result.lastInsertRowid;

      // Insert bill items
      const itemStmt = db.prepare(`
        INSERT INTO PurchaseBillItems (bill_id, crop_name, quantity, rate, total)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const item of bill.items) {
        itemStmt.run(billId, item.crop_name, item.quantity, item.rate, item.total);
        
        // Update stock (increase)
        stockQueries.updateQuantity(item.crop_name, item.quantity);
      }

      // Create transaction record
      const totalQuantity = bill.items.reduce((sum, item) => sum + item.quantity, 0);
      const firstItem = bill.items[0];
      
      const transactionStmt = db.prepare(`
        INSERT INTO Transactions (
          transaction_type, bill_type, bill_id, crop_name, quantity, rate, total_amount, 
          amount_paid, amount_remaining, repayment_date, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      transactionStmt.run(
        'PURCHASE',
        'PURCHASE_BILL',
        billId,
        firstItem ? firstItem.crop_name : 'Multiple Items',
        totalQuantity,
        firstItem ? firstItem.rate : 0,
        bill.total_amount,
        bill.amount_paid,
        bill.amount_remaining,
        bill.repayment_date || null,
        new Date().toISOString()
      );

      return result;
    });

    return transaction();
  },

  // Delete purchase bill by ID
  delete: (id: number) => {
    const db = getDatabase();
    const transaction = db.transaction(() => {
      // Get the bill items first to update stock
      const items = db.prepare('SELECT * FROM PurchaseBillItems WHERE bill_id = ?').all(id) as Array<{ crop_name: string; quantity: number }>;
      
      // Reverse stock updates for all items
      for (const item of items) {
        const stockStmt = db.prepare('UPDATE CropStock SET quantity = quantity - ? WHERE crop_name = ?');
        stockStmt.run(item.quantity, item.crop_name);
      }
      
      // Delete related transactions
      db.prepare('DELETE FROM Transactions WHERE bill_id = ? AND transaction_type = ?').run(id, 'PURCHASE');
      
      // Delete bill items
      db.prepare('DELETE FROM PurchaseBillItems WHERE bill_id = ?').run(id);
      
      // Delete the purchase bill
      const stmt = db.prepare('DELETE FROM PurchaseBills WHERE id = ?');
      return stmt.run(id);
    });
    
    return transaction();
  }
};

// Sale bill queries with multi-item support
export const saleBillQueries = {
  // Get all sale bills with their items
  getAll: () => {
    const db = getDatabase();
    const bills = db.prepare('SELECT * FROM SaleBills ORDER BY created_at DESC').all();
    
    // Get items for each bill
    return bills.map((bill: any) => {
      const items = db.prepare('SELECT * FROM SaleBillItems WHERE bill_id = ?').all(bill.id);
      return { ...bill, items };
    });
  },

  // Get sale bill by ID with items
  getById: (id: number) => {
    const db = getDatabase();
    const bill = db.prepare('SELECT * FROM SaleBills WHERE id = ?').get(id);
    if (!bill) return null;
    
    const items = db.prepare('SELECT * FROM SaleBillItems WHERE bill_id = ?').all(id);
    return { ...(bill as object), items };
  },

  // Create new sale bill with multiple items
  create: (bill: {
    shop_name: string;
    mobile_number: string;
    total_amount: number;
    amount_paid: number;
    amount_remaining: number;
    repayment_date?: string;
    bill_date: string;
    labour_charges: number;
    weighing_charges: number;
    items: Array<{
      crop_name: string;
      quantity: number;
      rate: number;
      total: number;
    }>;
  }) => {
    const db = getDatabase();
    
    const transaction = db.transaction(() => {
      // Check stock availability for all items
      for (const item of bill.items) {
        const currentStock = stockQueries.getByName(item.crop_name);
        const availableQuantity = currentStock ? (currentStock as any).quantity : 0;
        if (availableQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.crop_name}. Available: ${availableQuantity}, Required: ${item.quantity}`);
        }
      }

      // Create sale bill
      const stmt = db.prepare(`
        INSERT INTO SaleBills (
          shop_name, mobile_number, total_amount, 
          amount_paid, amount_remaining, repayment_date, bill_date, labour_charges, weighing_charges
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        bill.shop_name,
        bill.mobile_number || '',
        bill.total_amount,
        bill.amount_paid,
        bill.amount_remaining,
        bill.repayment_date || null,
        bill.bill_date,
        bill.labour_charges,
        bill.weighing_charges
      );

      const billId = result.lastInsertRowid;

      // Insert bill items
      const itemStmt = db.prepare(`
        INSERT INTO SaleBillItems (bill_id, crop_name, quantity, rate, total)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const item of bill.items) {
        itemStmt.run(billId, item.crop_name, item.quantity, item.rate, item.total);
        
        // Update stock (decrease)
        stockQueries.updateQuantity(item.crop_name, -item.quantity);
      }

      // Create transaction record
      const totalQuantity = bill.items.reduce((sum, item) => sum + item.quantity, 0);
      const firstItem = bill.items[0];
      
      const transactionStmt = db.prepare(`
        INSERT INTO Transactions (
          transaction_type, bill_type, bill_id, crop_name, quantity, rate, total_amount, 
          amount_paid, amount_remaining, repayment_date, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      transactionStmt.run(
        'SALE',
        'SALE_BILL',
        billId,
        firstItem ? firstItem.crop_name : 'Multiple Items',
        totalQuantity,
        firstItem ? firstItem.rate : 0,
        bill.total_amount,
        bill.amount_paid,
        bill.amount_remaining,
        bill.repayment_date || null,
        new Date().toISOString()
      );

      return result;
    });

    return transaction();
  },

  // Delete sale bill by ID
  delete: (id: number) => {
    const db = getDatabase();
    const transaction = db.transaction(() => {
      // Get the bill items first to update stock
      const items = db.prepare('SELECT * FROM SaleBillItems WHERE bill_id = ?').all(id) as Array<{ crop_name: string; quantity: number }>;
      
      // Reverse stock updates for all items (add back)
      for (const item of items) {
        const stockStmt = db.prepare('UPDATE CropStock SET quantity = quantity + ? WHERE crop_name = ?');
        stockStmt.run(item.quantity, item.crop_name);
      }
      
      // Delete related transactions
      db.prepare('DELETE FROM Transactions WHERE bill_id = ? AND transaction_type = ?').run(id, 'SALE');
      
      // Delete bill items
      db.prepare('DELETE FROM SaleBillItems WHERE bill_id = ?').run(id);
      
      // Delete the sale bill
      const stmt = db.prepare('DELETE FROM SaleBills WHERE id = ?');
      return stmt.run(id);
    });
    
    return transaction();
  }
};

export default getDatabase;
