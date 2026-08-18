import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

export const pool = new Pool({
  connectionString: connectionString || 'postgres://postgres:postgres@localhost:5432/file_sharing_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const DBConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        path VARCHAR(500) NOT NULL,
        name VARCHAR(255) NOT NULL,
        download_content INT DEFAULT 0
      );
    `;
    await client.query(createTableQuery);
    console.log('Files table initialized');
    client.release();
  } catch (error) {
    console.error('Error while connecting with database:', error.message);
  }
};

export default DBConnection;