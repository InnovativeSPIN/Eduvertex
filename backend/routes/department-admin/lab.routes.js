import express from 'express';
import { protect, authorize } from '../../middleware/auth.js';
import {
  getLabs,
  getLab,
  createLab,
  updateLab,
  deleteLab,
  getLabsBySubject,
  assignSubjectsToLab,
} from '../../controllers/department-admin/lab.controller.js';

const router = express.Router();

// All routes require authentication and department-admin role
router.use(protect);
router.use(authorize('department-admin', 'superadmin'));

// Lab CRUD routes
router.route('/')
  .get(getLabs)
  .post(createLab);

router.get('/by-subject/:subjectId', getLabsBySubject);

router.route('/:id')
  .get(getLab)
  .put(updateLab)
  .delete(deleteLab);

router.post('/:id/assign-subjects', assignSubjectsToLab);

export default router;
