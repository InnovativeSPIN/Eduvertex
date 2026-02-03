import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUsersByRole,
  getDashboardStats
} from '../../controllers/admin/user.controller.js';

import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

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

export default router;
