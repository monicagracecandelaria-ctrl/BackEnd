// src/tests/test-mysql-working.js
console.log('=== MYSQL TEST WITH ERROR HANDLING ===\n');

// Add global error handlers
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION:', reason);
  process.exit(1);
});

async function testMySQL() {
  console.log('1. Attempting to import mysql2...');
  
  try {
    const mysql = await import('mysql2/promise');
    console.log('   ✅ mysql2 imported\n');
    
    console.log('2. Creating connection to:');
    console.log('   Host: localhost');
    console.log('   User: root');
    console.log('   Password: (empty)');
    console.log('   Database: signus_tattoo');
    console.log('   Port: 3306\n');
    
    const connection = await mysql.default.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'signus_tattoo',
      port: 3306
    });
    
    console.log('3. ✅ CONNECTION SUCCESSFUL!\n');
    
    // Test query
    console.log('4. Running test query...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`   Found ${tables.length} table(s)\n`);
    
    console.log('5. Listing tables:');
    tables.forEach((table, i) => {
      console.log(`   ${i + 1}. ${table.Tables_in_signus_tattoo}`);
    });
    
    await connection.end();
    console.log('\n🎉 MYSQL IS WORKING PERFECTLY!');
    
  } catch (error) {
    console.error('\n❌ ERROR DETAILS:');
    console.error('Message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error number:', error.errno);
    
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('   1. Open XAMPP Control Panel');
    console.log('   2. Check if MySQL is "Running" (GREEN)');
    console.log('   3. If not running, click "Start"');
    console.log('   4. Wait for it to start (you will see a PID number)');
    console.log('   5. Try again');
    
    // Quick test - can we connect without database?
    console.log('\n💡 Quick diagnostic:');
    try {
      const mysql = await import('mysql2/promise');
      const testConn = await mysql.default.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306
      });
      console.log('   ✅ Can connect to MySQL server (without database)');
      await testConn.end();
    } catch (err) {
      console.log(`   ❌ Cannot connect to MySQL at all: ${err.message}`);
      console.log('   This means MySQL server is not running');
    }
  }
}

// Run with timeout
setTimeout(() => {
  console.error('\n⏰ TIMEOUT: MySQL connection is hanging');
  console.log('💡 This usually means:');
  console.log('   1. MySQL is not running');
  console.log('   2. Wrong port or host');
  console.log('   3. Firewall blocking connection');
  process.exit(1);
}, 5000);

testMySQL();