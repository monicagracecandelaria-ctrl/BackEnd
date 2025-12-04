import pool from '../config/database.js';

await prepareClientsTable();

// Client model functions
export const createClient = async (clientData) => {
  const { fullName, email, password, contactNumber } = clientData;
  
  // For Generating ClientID (e.g., C004, C005, etc.)
  const [latestClient] = await pool.execute(
    'SELECT ClientID FROM clients ORDER BY ClientID DESC LIMIT 1'
  );
  
  let nextId = 'C001';
  if (latestClient.length > 0) {
    const lastId = latestClient[0].ClientID;
    const num = parseInt(lastId.substring(1)) + 1;
    nextId = 'C' + num.toString().padStart(3, '0');
  }
  
  const sql = `
    INSERT INTO clients (ClientID, FullName, Email, ContactNumber, password, DateCreated) 
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  
  const [result] = await pool.execute(sql, [
    nextId, 
    fullName, 
    email, 
    contactNumber || '', 
    password
  ]);
  
  return { 
    clientID: nextId, 
    fullName, 
    email, 
    contactNumber 
  };
};

export const findClientByEmail = async (email) => {
  const sql = `SELECT * FROM clients WHERE Email = ?`;
  const [rows] = await pool.execute(sql, [email]);
  return rows[0] || null;
};

export const findClientById = async (clientId) => {
  const sql = `SELECT ClientID, FullName, Email, ContactNumber, DateCreated FROM clients WHERE ClientID = ?`;
  const [rows] = await pool.execute(sql, [clientId]);
  return rows[0] || null;
};

export const updateClientPassword = async (clientId, hashedPassword) => {
  const sql = `UPDATE clients SET password = ? WHERE ClientID = ?`;
  await pool.execute(sql, [hashedPassword, clientId]);
};