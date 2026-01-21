const express = require('express');
const {
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
} = require('../controllers/student.controller');

const router = express.Router();

const { protect, authorize } = require('../../../middleware/auth');

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
  .delete(authorize('superadmin'), deleteStudent);

router.get('/class/:classId', authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getStudentsByClass);
router.get('/department/:departmentId', authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getStudentsByDepartment);
router.put('/:id/status', authorize('superadmin', 'executiveadmin', 'academicadmin'), updateStudentStatus);
router.put('/promote', authorize('superadmin', 'executiveadmin', 'academicadmin'), promoteStudents);

module.exports = router;
