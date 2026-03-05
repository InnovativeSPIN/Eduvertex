import express from 'express';
import {
  getBreakTimingsByYear,
  getAllBreakTimings,
  getBreakTimingsByYearGroup,
  createBreakTiming,
  updateBreakTiming,
  deleteBreakTiming,
  bulkCreateBreakTimings,
  bulkUpdateBreakTimings
} from '../../controllers/department-admin/break-timing.controller.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication and department-admin role
router.use(protect);
router.use(authorize('department-admin', 'superadmin'));

// Break timing routes
router.get('/year/:year', getBreakTimingsByYear);
router.get('/year-group/:yearGroup', getBreakTimingsByYearGroup);
router.get('/', getAllBreakTimings);
router.post('/create', createBreakTiming);
router.post('/bulk-create', bulkCreateBreakTimings);
router.post('/bulk-update', bulkUpdateBreakTimings);
router.put('/:id', updateBreakTiming);
router.delete('/:id', deleteBreakTiming);

export default router;
