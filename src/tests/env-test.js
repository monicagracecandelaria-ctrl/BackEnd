// Create a new test file: src/tests/env-test.js
console.log('Testing .env and database...\n');

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('');

// Test MySQL connection
import('mysql2/promise').then(async (mysql) => {
  try {
    console.log('🔗 Connecting to MySQL...');
    
    const connection = await mysql.default.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    console.log('✅ MySQL connected successfully!\n');
    
    // Show tables
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNameKey = `Tables_in_${process.env.DB_NAME}`;
    
    console.log('📊 Tables in your database:');
    tables.forEach(table => {
      console.log(`   • ${table[tableNameKey]}`);
    });
    
    // Count records in clients table
    const [clientCount] = await connection.execute('SELECT COUNT(*) as count FROM clients');
    console.log(`\n👥 Total clients: ${clientCount[0].count}`);
    
    await connection.end();
    console.log('\n🎉 Everything is working correctly!');
    
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Is XAMPP MySQL running?');
    console.log('   2. Check .env file exists in correct location');
    console.log('   3. Database name in .env: signus_tattoo');
  }
}).catch(err => {
  console.error('❌ Failed to import mysql2:', err.message);
});