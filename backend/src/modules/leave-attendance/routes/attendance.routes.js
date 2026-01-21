const express = require('express');
const {
  getAllAttendance,
  getAttendance,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceByClass,
  getStudentAttendance,
  getMyAttendance,
  markFacultyAttendance,
  getFacultyAttendance,
  getAttendanceStats
} = require('../controllers/attendance.controller');

const router = express.Router();

const { protect, authorize } = require('../../../middleware/auth');

// All routes require authentication
router.use(protect);

// Student route
router.get('/my-attendance', authorize('student'), getMyAttendance);

// Stats route
router.get('/stats', authorize('superadmin', 'executiveadmin', 'academicadmin'), getAttendanceStats);

// Class and student attendance routes
router.get('/class/:classId', authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getAttendanceByClass);
router.get('/student/:studentId', authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty', 'student'), getStudentAttendance);

// Faculty attendance routes
router.route('/faculty')
  .post(authorize('superadmin', 'executiveadmin', 'academicadmin'), markFacultyAttendance);
router.get('/faculty/:facultyId', authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getFacultyAttendance);

// Main routes
router.route('/')
  .get(authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getAllAttendance)
  .post(authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), markAttendance);

router.route('/:id')
  .get(getAttendance)
  .put(authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), updateAttendance)
  .delete(authorize('superadmin', 'executiveadmin', 'academicadmin'), deleteAttendance);

module.exports = router;
