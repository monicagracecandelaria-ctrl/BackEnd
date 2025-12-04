// src/tests/check-database.js
import mysql from 'mysql2/promise';

async function checkDatabase() {
  console.log('Checking your existing MySQL setup...\n');
  
  const config = {
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP default is empty
    port: 3306
  };
  
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL\n');
    
    // List all databases
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('Your databases:');
    databases.forEach((db, i) => console.log(`   ${i + 1}. ${db.Database}`));
    
    // Ask which one to use
    console.log('\nWhich database do you want to use?');
    console.log('   (Type the exact name from the list above)');
    
    // For now, let's just pick the first non-system database
    const userDatabases = databases
      .map(db => db.Database)
      .filter(name => !['mysql', 'information_schema', 'performance_schema', 'sys'].includes(name));
    
    if (userDatabases.length > 0) {
      console.log(`\nSuggested: ${userDatabases[0]}`);
      
      // Show tables in that database
      await connection.changeUser({ database: userDatabases[0] });
      const [tables] = await connection.execute('SHOW TABLES');
      
      if (tables.length > 0) {
        console.log(`\nTables in "${userDatabases[0]}":`);
        const tableNameKey = `Tables_in_${userDatabases[0]}`;
        tables.forEach((table, i) => console.log(`   ${i + 1}. ${table[tableNameKey]}`));
      } else {
        console.log(`\nNo tables found in "${userDatabases[0]}"`);
      }
    }
    
    await connection.end();
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nCommon XAMPP issues:');
    console.log('   1. Is MySQL running in XAMPP?');
    console.log('   2. Try password: "" (empty) or "root"');
    console.log('   3. Check port - should be 3306');
  }
}

checkDatabase();