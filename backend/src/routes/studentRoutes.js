import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import {
  getMarksByStudent,
  upsertMark,
} from '../controllers/marksController.js';
import {
  validateStudent,
  validateUpdateStudent,
  validateIdParam,
  validateMark,
} from '../middleware/validate.js';

const router = Router();

// /api/students
router.get('/', getStudents);
router.post('/', validateStudent, createStudent);

// /api/students/:id
router.get('/:id', validateIdParam, getStudentById);
router.put(
  '/:id',
  [...validateIdParam, ...validateUpdateStudent],
  updateStudent,
);
router.delete('/:id', validateIdParam, deleteStudent);

// /api/students/:id/marks
router.get('/:id/marks', validateIdParam, getMarksByStudent);
router.post('/:id/marks', [...validateIdParam, ...validateMark], upsertMark);

export default router;
