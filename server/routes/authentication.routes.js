import express from 'express';
import { signInUser, registerUser } from '../controllers/authentication.controllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', signInUser);


export default router;
