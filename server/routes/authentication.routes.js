import express from 'express';
import { 
  signInUser, 
  registerUser, 
  getCurrentUser, 
  updateUserProfile,
  validateRegister,
  validateLogin,
  validateUpdateProfile 
} from '../controllers/authentication.controllers.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes with validation
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, signInUser);

// Protected routes with validation
router.get('/me', verifyToken, getCurrentUser);
router.put('/update-profile', verifyToken, validateUpdateProfile, updateUserProfile);

export default router;
