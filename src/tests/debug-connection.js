import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Testing database connection...');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'signus_tattoo',
    port: process.env.DB_PORT || 3306
  };
  
  console.log('Config:', config);
  
  try {
    const connection = await mysql.createConnection(config);
    console.log('Database connected!');
    
    //Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM clients');
    console.log(`Total clients: ${rows[0].count}`);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('Connection error:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

testConnection();