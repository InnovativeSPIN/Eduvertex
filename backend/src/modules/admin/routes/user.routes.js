const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUsersByRole,
  getDashboardStats
} = require('../controllers/user.controller');

const router = express.Router();

const { protect, authorize } = require('../../../middleware/auth');

// All routes require authentication and admin roles
router.use(protect);
router.use(authorize('superadmin', 'executiveadmin', 'academicadmin'));

router.route('/stats/dashboard').get(getDashboardStats);
router.route('/role/:role').get(getUsersByRole);

router.route('/')
  .get(getUsers)
  .post(authorize('superadmin'), createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('superadmin'), deleteUser);

router.route('/:id/deactivate').put(deactivateUser);
router.route('/:id/activate').put(activateUser);

module.exports = router;
