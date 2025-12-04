import { hashPassword, comparePassword } from './passHash.js';
import { 
  createClient, 
  findClientByEmail, 
  findClientById,
  updateClientPassword  
} from '../models/clients.js';

export const registerClient = async (req, res) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;
    
    //Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        error: 'Full name, email, and password are required' 
      });
    }
    
    //Check if client already exists
    const existingClient = await findClientByEmail(email);
    if (existingClient) {
      return res.status(400).json({ 
        error: 'Email already registered' 
      });
    }
    
    //Hash the password
    const hashedPassword = await hashPassword(password);
    
    //Create new client
    const client = await createClient({
      fullName,
      email,
      password: hashedPassword,
      contactNumber: contactNumber || ''
    });
    
    //Don't send password back
    res.status(201).json({
      message: 'Client registered successfully',
      client: {
        clientID: client.clientID,
        fullName: client.fullName,
        email: client.email,
        contactNumber: client.contactNumber
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    //Find client
    const client = await findClientByEmail(email);
    if (!client) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    //Check if client has a password set
    if (!client.password) {
      return res.status(401).json({ 
        error: 'Account not set up for login. Please contact support.' 
      });
    }
    
    //Compare password
    const isPasswordValid = await comparePassword(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    //Login successful - remove password from response
    const { password: _, ...clientWithoutPassword } = client;
    
    res.json({
      message: 'Login successful',
      client: clientWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// For Optional: Update existing client with password
export const setupClientPassword = async (req, res) => {
  try {
    const { clientID, password } = req.body;
    
    if (!clientID || !password) {
      return res.status(400).json({ 
        error: 'Client ID and password are required' 
      });
    }
    
    const client = await findClientById(clientID);
    if (!client) {
      return res.status(404).json({ 
        error: 'Client not found' 
      });
    }
    
    const hashedPassword = await hashPassword(password);
    await updateClientPassword(clientID, hashedPassword);
    
    res.json({
      message: 'Password set successfully',
      clientID
    });
    
  } catch (error) {
    console.error('Setup password error:', error);
    res.status(500).json({ 
      error: 'Server error setting up password' 
    });
  }
};