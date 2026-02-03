import express from 'express';
import {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
  getStudentsByDepartment,
  updateStudentStatus,
  promoteStudents,
  getMyProfile,
  getStudentStats
} from '../../controllers/student/student.controller.js';

import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student can access their own profile
router.get('/me/profile', authorize('student'), getMyProfile);

// Stats route
router.get('/stats', authorize('superadmin', 'executiveadmin', 'academicadmin'), getStudentStats);

// Routes for admin and faculty
router.route('/')
  .get(authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getAllStudents)
  .post(authorize('superadmin', 'executiveadmin', 'academicadmin'), createStudent);

router.route('/:id')
  .get(authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty', 'student'), getStudent)
  .put(authorize('superadmin', 'executiveadmin', 'academicadmin'), updateStudent)
  .delete(authorize('superadmin', 'deleteStudent'));

router.get('/class/:classId', authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getStudentsByClass);
router.get('/department/:departmentId', authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getStudentsByDepartment);
router.put('/:id/status', authorize('superadmin', 'executiveadmin', 'academicadmin'), updateStudentStatus);
router.put('/promote', authorize('superadmin', 'executiveadmin', 'academicadmin'), promoteStudents);

export default router;
