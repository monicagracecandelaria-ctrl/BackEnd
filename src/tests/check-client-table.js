// src/tests/check-clients-table.js
import mysql from 'mysql2/promise';

async function checkClientsTable() {
  console.log('🔍 Checking your clients table structure...\n');
  
  const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signus_tattoo',
    port: 3306
  };
  
  try {
    const connection = await mysql.createConnection(config);
    
    // Check clients table structure
    const [columns] = await connection.execute('DESCRIBE clients');
    
    console.log('Clients table columns:');
    console.log('─'.repeat(50));
    
    columns.forEach(col => {
      console.log(`• ${col.Field}`);
      console.log(`  Type: ${col.Type}`);
      console.log(`  Null: ${col.Null}`);
      console.log(`  Key: ${col.Key || '(none)'}`);
      console.log(`  Default: ${col.Default || '(none)'}`);
      console.log(`  Extra: ${col.Extra || '(none)'}`);
      console.log('');
    });
    
    // Show a few sample records
    const [sampleData] = await connection.execute('SELECT clientID, FullName, ContactNumber, Email FROM clients LIMIT 3');
    
    if (sampleData.length > 0) {
      console.log('Sample client data:');
      console.log('─'.repeat(50));
      sampleData.forEach((client, i) => {
        console.log(`Client ${i + 1}:`);
        Object.entries(client).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
        console.log('');
      });
    }
    
    await connection.end();
    console.log('Check complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkClientsTable();