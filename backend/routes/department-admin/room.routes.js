import express from 'express';
import { protect, authorize } from '../../middleware/auth.js';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms,
} from '../../controllers/department-admin/room.controller.js';

const router = express.Router();

// All routes require authentication and department-admin role
router.use(protect);
router.use(authorize('department-admin', 'superadmin'));

// Room CRUD routes
router.route('/')
  .get(getRooms)
  .post(createRoom);

router.get('/available', getAvailableRooms);

router.route('/:id')
  .get(getRoom)
  .put(updateRoom)
  .delete(deleteRoom);

export default router;
