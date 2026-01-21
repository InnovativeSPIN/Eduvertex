const express = require('express');
const {
  getAllTimetables,
  getTimetable,
  getTimetableByClass,
  getTimetableByFaculty,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  addSlot,
  updateSlot,
  removeSlot,
  getPeriodConfigs,
  createPeriodConfig,
  getTodaySchedule
} = require('../controllers/timetable.controller');

const router = express.Router();

const { protect, authorize } = require('../../../middleware/auth');

// All routes require authentication
router.use(protect);

// Get today's schedule for logged in user
router.get('/today', getTodaySchedule);

// Period configuration routes
router.route('/config/periods')
  .get(getPeriodConfigs)
  .post(authorize('superadmin', 'executiveadmin', 'academicadmin'), createPeriodConfig);

// Get timetable by class or faculty
router.get('/class/:classId', getTimetableByClass);
router.get('/faculty/:facultyId', getTimetableByFaculty);

// Main timetable routes
router.route('/')
  .get(getAllTimetables)
  .post(authorize('superadmin', 'executiveadmin', 'academicadmin'), createTimetable);

router.route('/:id')
  .get(getTimetable)
  .put(authorize('superadmin', 'executiveadmin', 'academicadmin'), updateTimetable)
  .delete(authorize('superadmin', 'executiveadmin', 'academicadmin'), deleteTimetable);

// Slot management routes
router.route('/:id/slots')
  .post(authorize('superadmin', 'executiveadmin', 'academicadmin'), addSlot);

router.route('/:id/slots/:slotId')
  .put(authorize('superadmin', 'executiveadmin', 'academicadmin'), updateSlot)
  .delete(authorize('superadmin', 'executiveadmin', 'academicadmin'), removeSlot);

module.exports = router;
