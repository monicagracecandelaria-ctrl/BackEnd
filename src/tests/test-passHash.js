// src/tests/test-passHash.js
import { hashPassword, comparePassword } from '../utils/passHash.js';

async function testPassHash() {
  console.log('Testing passHash.js...\n');
  
  const password = 'TestPassword123';
  
  try {
    // Test hash
    const hashed = await hashPassword(password);
    console.log('Hash generated:', hashed.substring(0, 30) + '...');
    
    // Test compare
    const isMatch = await comparePassword(password, hashed);
    console.log('Correct password matches:', isMatch);
    
    const wrongMatch = await comparePassword('wrong', hashed);
    console.log('Wrong password matches:', wrongMatch);
    
    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPassHash();