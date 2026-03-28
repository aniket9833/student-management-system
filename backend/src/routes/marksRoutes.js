import { Router } from 'express';
import { deleteMark, getSubjects } from '../controllers/marksController.js';
import { validateIdParam } from '../middleware/validate.js';

const router = Router();

router.delete('/:id', validateIdParam, deleteMark);

export default router;

// subjects sub-router exported separately
export const subjectRouter = Router();
subjectRouter.get('/', getSubjects);
