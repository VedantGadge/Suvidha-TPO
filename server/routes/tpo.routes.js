import express from 'express';
import { getTPO, addTPO, updateTPO, deleteTPO } from '../controllers/tpo.controllers.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Protect all TPO routes with JWT authentication
router.get('/get', verifyToken, getTPO);
router.post('/add', verifyToken, addTPO);
router.put('/update/:id', verifyToken, updateTPO);
router.delete('/delete/:id', verifyToken, deleteTPO);

export default router;
