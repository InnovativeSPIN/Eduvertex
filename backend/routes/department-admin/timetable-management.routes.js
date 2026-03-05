import express from 'express';
import {
  checkTimetableIncharge,
  getTimetablesByDepartmentAndYear,
  createTimetable,
  updateTimetable,
  assignFacultyToSlot,
  changeFacultyAssignment,
  getAvailableFacultyForClass,
  getSlotAssignments,
  deleteSlotAssignment,
  publishTimetable
} from '../../controllers/department-admin/timetable-management.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Timetable CRUD routes (viewing doesn't require timetable incharge)
router.get('/department/:year', getTimetablesByDepartmentAndYear);
router.get('/:timetable_id/slots', getSlotAssignments);

// Protected routes require timetable incharge
router.post('/create', checkTimetableIncharge, createTimetable);
router.put('/:id', checkTimetableIncharge, updateTimetable);
router.post('/:timetable_id/publish', checkTimetableIncharge, publishTimetable);

// Slot assignment routes (require timetable incharge)
router.post('/slots/assign', checkTimetableIncharge, assignFacultyToSlot);
router.put('/slots/:assignment_id/reassign', checkTimetableIncharge, changeFacultyAssignment);
router.delete('/slots/:assignment_id', checkTimetableIncharge, deleteSlotAssignment);

// Faculty availability routes
router.get('/slots/available-faculty', getAvailableFacultyForClass);

export default router;
