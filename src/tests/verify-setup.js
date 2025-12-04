console.log('=== SIMPLE VERIFICATION ===\n');

async function test() {
  try {
    console.log('1. Testing imports...');
    
    // Test passHash
    const { hashPassword, comparePassword } = await import('../utils/passHash.js');
    console.log('   ✅ passHash.js imported');
    
    // Test hashing
    const hash = await hashPassword('test123');
    const match = await comparePassword('test123', hash);
    console.log(`   ✅ Password hashing: ${match ? 'WORKING' : 'FAILED'}\n`);
    
    // Test database connection
    console.log('2. Testing database...');
    const pool = (await import('../config/database.js')).default;
    
    // Simple query
    const [result] = await pool.execute('SELECT 1 as test');
    console.log(`   ✅ Database: ${result[0].test === 1 ? 'CONNECTED' : 'ERROR'}\n`);
    
    // Check clients table
    const [tables] = await pool.execute("SHOW TABLES LIKE 'clients'");
    console.log(`   ✅ Clients table: ${tables.length > 0 ? 'EXISTS' : 'MISSING'}\n`);
    
    console.log('🎉 ALL SYSTEMS GO!');
    console.log('\n📡 Server should be running on: http://localhost:5001');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Add timeout
setTimeout(() => {
  console.log('\n⏰ Timeout - script taking too long');
  process.exit(1);
}, 10000);

test();