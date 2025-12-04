import { findClientByEmail, updateClientPassword } from '../models/clients.js';
import { hashPassword } from '../utils/passHash.js';

async function setupExistingClients() {
  console.log('🔧 Setting up passwords for existing clients...\n');
  
  //List of your existing clients from the output
  const existingClients = [
    { email: 'angelica.b@example.com', password: 'password123' },
    { email: 'mikaela.r@example.com', password: 'password123' },
    { email: 'trisha.c@example.com', password: 'password123' }
  ];
  
  for (const client of existingClients) {
    try {
      const dbClient = await findClientByEmail(client.email);
      if (dbClient && !dbClient.password) {
        const hashedPassword = await hashPassword(client.password);
        await updateClientPassword(dbClient.ClientID, hashedPassword);
        console.log(`Added password for: ${client.email}`);
      } else if (dbClient && dbClient.password) {
        console.log(`Already has password: ${client.email}`);
      } else {
        console.log(`Not found: ${client.email}`);
      }
    } catch (error) {
      console.error(`Error for ${client.email}:`, error.message);
    }
  }
  
  console.log('\nSetup complete!');
}

setupExistingClients();