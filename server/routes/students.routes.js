import express from 'express';
import { getStudents, addStudents, updateStudents, deleteStudents } from '../controllers/students.controllers.js';

const router = express.Router();

router.get('/get', getStudents);
router.post('/add', addStudents);
router.put('/update/:id', updateStudents);
router.delete('/delete/:id', deleteStudents);

export default router;
