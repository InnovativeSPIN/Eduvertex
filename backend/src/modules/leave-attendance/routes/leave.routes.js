const express = require('express');
const {
  getAllLeaves,
  getLeave,
  createLeave,
  updateLeave,
  updateLeaveStatus,
  cancelLeave,
  deleteLeave,
  getMyLeaves,
  getLeaveBalance,
  getPendingCount
} = require('../controllers/leave.controller');

const router = express.Router();

const { protect, authorize } = require('../../../middleware/auth');

// All routes require authentication
router.use(protect);

// User routes
router.get('/my-leaves', getMyLeaves);
router.get('/balance', getLeaveBalance);
router.put('/:id/cancel', cancelLeave);

// Admin routes
router.get('/pending-count', authorize('superadmin', 'executiveadmin', 'academicadmin'), getPendingCount);

// Main routes
router.route('/')
  .get(getAllLeaves)
  .post(createLeave);

router.route('/:id')
  .get(getLeave)
  .put(updateLeave)
  .delete(authorize('superadmin', 'executiveadmin', 'academicadmin'), deleteLeave);

router.put('/:id/status', authorize('superadmin', 'executiveadmin', 'academicadmin'), updateLeaveStatus);

module.exports = router;
