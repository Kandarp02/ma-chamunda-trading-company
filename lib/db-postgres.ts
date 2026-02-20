import { Pool, PoolClient, QueryResult } from 'pg';

// Database connection configuration
// Uses DATABASE_URL environment variable for cloud PostgreSQL
// Falls back to local config for development
const getConnectionConfig = () => {
  if (process.env.DATABASE_URL) {
    return { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for Supabase/Vercel
    };
  }
  
  // Local development fallback
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'agricultural_trading',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
};

// Create connection pool
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      ...getConnectionConfig(),
      max: 10, // Maximum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
  }
  return pool;
}

// Execute query helper
export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Transaction helper
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Initialize database tables
export async function initializeDatabase(): Promise<void> {
  const client = await getPool().connect();
  try {
    // Create AdminUsers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin users if table is empty
    const adminCheck = await client.query('SELECT COUNT(*) as count FROM admin_users');
    if (parseInt(adminCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO admin_users (username, password, role) 
        VALUES ('chamundamata', 'mayur@123', 'admin'),
               ('matachamunda', 'ganesh@123', 'admin')
      `);
      console.log('Default admin users created');
    }

    // Create CropStock table
    await client.query(`
      CREATE TABLE IF NOT EXISTS crop_stock (
        id SERIAL PRIMARY KEY,
        crop_name VARCHAR(100) UNIQUE NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create PurchaseBills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS purchase_bills (
        id SERIAL PRIMARY KEY,
        farmer_name VARCHAR(100) NOT NULL,
        mobile_number VARCHAR(20),
        total_amount DECIMAL(10,2) NOT NULL,
        amount_paid DECIMAL(10,2) NOT NULL,
        amount_remaining DECIMAL(10,2) NOT NULL,
        repayment_date DATE,
        bill_date DATE NOT NULL,
        labour_charges DECIMAL(10,2) DEFAULT 0,
        weighing_charges DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create PurchaseBillItems table
    await client.query(`
      CREATE TABLE IF NOT EXISTS purchase_bill_items (
        id SERIAL PRIMARY KEY,
        bill_id INTEGER REFERENCES purchase_bills(id) ON DELETE CASCADE,
        crop_name VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        rate DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL
      )
    `);

    // Create SaleBills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sale_bills (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        mobile_number VARCHAR(20),
        total_amount DECIMAL(10,2) NOT NULL,
        amount_paid DECIMAL(10,2) NOT NULL,
        amount_remaining DECIMAL(10,2) NOT NULL,
        repayment_date DATE,
        bill_date DATE NOT NULL,
        labour_charges DECIMAL(10,2) DEFAULT 0,
        weighing_charges DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create SaleBillItems table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sale_bill_items (
        id SERIAL PRIMARY KEY,
        bill_id INTEGER REFERENCES sale_bills(id) ON DELETE CASCADE,
        crop_name VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        rate DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL
      )
    `);

    console.log('Database initialized successfully');
  } finally {
    client.release();
  }
}

// Close pool (for cleanup)
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Re-export types
export { Pool, PoolClient, QueryResult };
