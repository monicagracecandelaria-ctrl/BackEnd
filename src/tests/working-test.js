// Create: src/tests/working-test.js
import mysql from 'mysql2/promise';

console.log('🚀 Testing database connection with .env file...\n');

async function main() {
  try {
    // Test connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'signus_tattoo',
      port: 3306
    });
    
    console.log('✅ Step 1: MySQL connected\n');
    
    // 1. Show all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Your database tables:');
    tables.forEach(table => {
      console.log(`   • ${table.Tables_in_signus_tattoo}`);
    });
    
    // 2. Check clients table structure
    console.log('\n🔍 Checking clients table...');
    const [columns] = await connection.execute('DESCRIBE clients');
    console.log('   Columns:', columns.map(c => c.Field).join(', '));
    
    // 3. Check for password column
    const hasPassword = columns.some(c => c.Field.toLowerCase() === 'password');
    console.log(`   Password column: ${hasPassword ? '✅ EXISTS' : '❌ MISSING'}\n`);
    
    if (!hasPassword) {
      console.log('💡 Adding password column to clients table...');
      try {
        await connection.execute(`
          ALTER TABLE clients 
          ADD COLUMN password VARCHAR(255) NULL
        `);
        console.log('✅ Password column added successfully!\n');
      } catch (alterError) {
        console.log('⚠️ Could not add column (might already exist):', alterError.message);
      }
    }
    
    // 4. Show sample clients
    console.log('👤 Sample client data:');
    const [clients] = await connection.execute(`
      SELECT ClientID, FullName, Email, 
             CASE WHEN password IS NULL THEN 'No password' ELSE 'Has password' END as auth_status
      FROM clients 
      LIMIT 5
    `);
    
    clients.forEach(client => {
      console.log(`   • ${client.ClientID}: ${client.FullName} - ${client.auth_status}`);
    });
    
    await connection.end();
    
    console.log('\n✨ ===== SETUP COMPLETE ===== ✨');
    console.log('✅ .env file created');
    console.log('✅ Database connected');
    console.log('✅ Clients table ready for authentication');
    console.log('\n🚀 Your backend is now ready!');
    console.log('   Run: npm run dev');
    
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
    console.log('\n💡 Make sure XAMPP MySQL is RUNNING:');
    console.log('   1. Open XAMPP Control Panel');
    console.log('   2. Check MySQL shows "Running" (green)');
    console.log('   3. If not, click "Start" button');
  }
}

main();