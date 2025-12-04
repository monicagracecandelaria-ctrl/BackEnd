// src/tests/test-bcrypt.js
import bcrypt from 'bcryptjs';

async function testBcrypt() {
  console.log('🧪 Testing bcryptjs...\n');
  
  const password = 'MySecurePassword123';
  
  try {
    // Test 1: Hash password
    console.log('1. Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`   Original: ${password}`);
    console.log(`   Hashed: ${hashedPassword}`);
    console.log(`   Length: ${hashedPassword.length} characters\n`);
    
    // Test 2: Compare correct password
    console.log('2. Testing correct password comparison...');
    const isCorrectMatch = await bcrypt.compare(password, hashedPassword);
    console.log(`   Correct password matches: ${isCorrectMatch ? '✅ YES' : '❌ NO'}\n`);
    
    // Test 3: Compare wrong password
    console.log('3. Testing wrong password comparison...');
    const isWrongMatch = await bcrypt.compare('WrongPassword', hashedPassword);
    console.log(`   Wrong password matches: ${isWrongMatch ? '❌ YES (BAD!)' : '✅ NO (GOOD!)'}\n`);
    
    // Test 4: Direct hash with rounds
    console.log('4. Testing direct hash with salt rounds...');
    const directHash = await bcrypt.hash(password, 10);
    console.log(`   Direct hash: ${directHash.substring(0, 30)}...`);
    console.log(`   Different hash each time: ${hashedPassword !== directHash ? '✅ YES' : '❌ NO'}\n`);
    
    // Test 5: Compare with direct hash
    console.log('5. Verifying direct hash works...');
    const verifyDirectHash = await bcrypt.compare(password, directHash);
    console.log(`   Direct hash verification: ${verifyDirectHash ? '✅ SUCCESS' : '❌ FAILED'}\n`);
    
    console.log('🎉 All bcryptjs tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during tests:', error);
    console.error('Stack trace:', error.stack);
  }
}

testBcrypt();