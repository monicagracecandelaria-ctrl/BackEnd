import mysql from 'mysql2/promise';

async function checkSignusTattoo() {
  console.log('Checking signus_tattoo database...\n');
  
  const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signus_tattoo',  // Your database!
    port: 3306
  };
  
  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to signus_tattoo database\n');
    
    // Show all tables
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNameKey = 'Tables_in_signus_tattoo';
    
    if (tables.length === 0) {
      console.log('No tables found in signus_tattoo');
      console.log('This is an empty database - we can create our tables here!');
    } else {
      console.log('Tables in signus_tattoo:');
      tables.forEach((table, i) => {
        console.log(`   ${i + 1}. ${table[tableNameKey]}`);
      });
      
      // Check if users table exists
      const usersTable = tables.find(t => 
        t[tableNameKey].toLowerCase() === 'users' || 
        t[tableNameKey].toLowerCase() === 'user'
      );
      
      if (usersTable) {
        console.log('\nFound users table!');
        const [columns] = await connection.execute(`DESCRIBE ${usersTable[tableNameKey]}`);
        console.log('\nUsers table structure:');
        columns.forEach(col => {
          console.log(`   • ${col.Field} (${col.Type})`);
        });
      }
    }
    
    await connection.end();
    console.log('\nCheck complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSignusTattoo();