import { Pool } from 'pg';

let pool;

function getPool() {
  if (!pool) {
    const connectionString = 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_URL ||
      `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME}`;

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false }
        : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });
  }

  return pool;
}

export async function query(text, params = []) {
  const client = getPool();
  
  try {
    const start = Date.now();
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient() {
  const pool = getPool();
  
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Failed to get database client:', error);
    throw error;
  }
}

export async function transaction(callback) {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
}