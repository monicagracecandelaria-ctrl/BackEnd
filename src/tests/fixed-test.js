// src/tests/fixed-test.js
async function main() {
  console.log('🚀 Starting database test...\n');
  
  try {
    // Load environment variables
    const dotenv = await import('dotenv');
    dotenv.config();
    
    console.log('📋 Environment variables:');
    console.log('   DB_HOST:', process.env.DB_HOST || '(not set)');
    console.log('   DB_NAME:', process.env.DB_NAME || '(not set)');
    console.log('   DB_USER:', process.env.DB_USER || '(not set)');
    console.log('');
    
    // Check if .env was loaded
    if (!process.env.DB_HOST) {
      console.log('⚠️  Warning: .env file might not be loading properly');
      console.log('   Using default values...');
    }
    
    // Import mysql
    const mysql = await import('mysql2/promise');
    console.log('✅ mysql2 imported\n');
    
    // Create connection
    console.log('🔌 Connecting to MySQL...');
    const connection = await mysql.default.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'signus_tattoo',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Connected to MySQL!\n');
    
    // Show tables
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNameKey = `Tables_in_${process.env.DB_NAME || 'signus_tattoo'}`;
    
    console.log('📊 Tables in database:');
    if (tables.length === 0) {
      console.log('   (No tables found)');
    } else {
      tables.forEach((table, i) => {
        console.log(`   ${i + 1}. ${table[tableNameKey]}`);
      });
    }
    
    // Show client count
    const [clientCount] = await connection.execute('SELECT COUNT(*) as count FROM clients');
    console.log(`\n👥 Total clients: ${clientCount[0].count}`);
    
    // Show sample clients
    const [clients] = await connection.execute('SELECT ClientID, FullName, Email FROM clients LIMIT 3');
    console.log('\n👤 Sample clients:');
    clients.forEach(client => {
      console.log(`   • ${client.ClientID}: ${client.FullName} (${client.Email})`);
    });
    
    await connection.end();
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack trace:', error.stack);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Is XAMPP MySQL running? (Check XAMPP Control Panel)');
    console.log('   2. Is the database "signus_tattoo" created?');
    console.log('   3. Default XAMPP credentials:');
    console.log('      - User: root');
    console.log('      - Password: (empty string)');
    console.log('      - Port: 3306');
    console.log('   4. Check if .env file exists in current directory');
    process.exit(1);
  }
}

// Run with proper error handling
main().catch(error => {
  console.error('Unhandled error in main():', error);
  process.exit(1);
});