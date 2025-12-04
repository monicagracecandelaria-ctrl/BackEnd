import express from 'express';
import { 
  registerClient, 
  loginClient, 
  setupClientPassword 
} from '../utils/authController.js';

const router = express.Router();

// POST /api/auth/register - New client registration
router.post('/register', registerClient);

// POST /api/auth/login - Client login
router.post('/login', loginClient);

// POST /api/auth/setup-password - For existing clients to set password
router.post('/setup-password', setupClientPassword);

export default router;