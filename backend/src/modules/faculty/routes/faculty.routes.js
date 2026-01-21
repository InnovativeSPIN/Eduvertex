const express = require('express');
const {
  getAllFaculty,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyByDepartment,
  assignSubjects,
  assignClasses,
  updateFacultyStatus,
  getMyProfile
} = require('../controllers/faculty.controller');

const router = express.Router();

const { protect, authorize } = require('../../../middleware/auth');

// All routes require authentication
router.use(protect);

// Faculty can access their own profile
router.get('/me/profile', authorize('faculty'), getMyProfile);

// Routes for admin
router.route('/')
  .get(authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getAllFaculty)
  .post(authorize('superadmin', 'executiveadmin', 'academicadmin'), createFaculty);

router.route('/:id')
  .get(authorize('superadmin', 'executiveadmin', 'academicadmin', 'faculty'), getFaculty)
  .put(authorize('superadmin', 'executiveadmin', 'academicadmin'), updateFaculty)
  .delete(authorize('superadmin'), deleteFaculty);

router.get('/department/:departmentId', authorize('superadmin', 'executiveadmin', 'academicadmin'), getFacultyByDepartment);
router.put('/:id/subjects', authorize('superadmin', 'executiveadmin', 'academicadmin'), assignSubjects);
router.put('/:id/classes', authorize('superadmin', 'executiveadmin', 'academicadmin'), assignClasses);
router.put('/:id/status', authorize('superadmin', 'executiveadmin', 'academicadmin'), updateFacultyStatus);

module.exports = router;
