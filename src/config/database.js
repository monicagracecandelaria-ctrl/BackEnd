// src/config/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'signus_tattoo',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to prepare clients table for authentication
export const prepareClientsTable = async () => {
  try {
    // Check if password column exists
    const [columns] = await pool.execute('DESCRIBE clients');
    const hasPassword = columns.some(col => col.Field.toLowerCase() === 'password');
    
    if (!hasPassword) {
      console.log('Adding password column to clients table...');
      await pool.execute(`
        ALTER TABLE clients 
        ADD COLUMN password VARCHAR(255) NULL,
        MODIFY COLUMN Email VARCHAR(100) NOT NULL UNIQUE
      `);
      console.log('Added password column and made Email NOT NULL');
    } else {
      console.log('Clients table already has password column');
    }
    
    return true;
  } catch (error) {
    console.error('Error preparing clients table:', error.message);
    return false;
  }
};

// Test connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected to database:', process.env.DB_NAME);
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    return false;
  }
};

export default pool;