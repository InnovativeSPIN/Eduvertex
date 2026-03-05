import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import { models } from '../../models/index.js';

const { Room, Department } = models;

// @desc      Get all rooms
// @route     GET /api/v1/department-admin/rooms
// @access    Private/DepartmentAdmin
export const getRooms = asyncHandler(async (req, res, next) => {
  try {
    const where = {};
    
    // Department admin can only see their department's rooms
    if (req.user.role === 'department-admin') {
      where.department_id = req.user.department_id;
    } else if (req.query.department_id) {
      where.department_id = parseInt(req.query.department_id);
    }

    if (req.query.room_type) {
      where.room_type = req.query.room_type;
    }

    if (req.query.is_active !== undefined) {
      where.is_active = req.query.is_active === 'true';
    }

    const rooms = await Room.findAll({
      where,
      include: [
        { model: Department, as: 'department', attributes: ['id', 'short_name', 'full_name'] }
      ],
      order: [['room_number', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error in getRooms:', error);
    return next(new ErrorResponse(error.message || 'Error fetching rooms', 500));
  }
});

// @desc      Get single room
// @route     GET /api/v1/department-admin/rooms/:id
// @access    Private/DepartmentAdmin
export const getRoom = asyncHandler(async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department', attributes: ['id', 'short_name', 'full_name'] }
      ]
    });

    if (!room) {
      return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
    }

    // Department admin can only see their department's rooms
    if (req.user.role === 'department-admin' && room.department_id !== req.user.department_id) {
      return next(new ErrorResponse('Not authorized to access this room', 403));
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error in getRoom:', error);
    return next(new ErrorResponse(error.message || 'Error fetching room', 500));
  }
});

// @desc      Create new room
// @route     POST /api/v1/department-admin/rooms
// @access    Private/DepartmentAdmin
export const createRoom = asyncHandler(async (req, res, next) => {
  try {
    // Department admin can only create rooms for their department
    if (req.user.role === 'department-admin') {
      req.body.department_id = req.user.department_id;
    }

    // Check if room number already exists in the department
    const existingRoom = await Room.findOne({
      where: {
        room_number: req.body.room_number,
        department_id: req.body.department_id
      }
    });

    if (existingRoom) {
      return next(new ErrorResponse(`Room ${req.body.room_number} already exists in this department`, 400));
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error in createRoom:', error);
    return next(new ErrorResponse(error.message || 'Error creating room', 500));
  }
});

// @desc      Update room
// @route     PUT /api/v1/department-admin/rooms/:id
// @access    Private/DepartmentAdmin
export const updateRoom = asyncHandler(async (req, res, next) => {
  try {
    let room = await Room.findByPk(req.params.id);

    if (!room) {
      return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
    }

    // Department admin can only update their department's rooms
    if (req.user.role === 'department-admin' && room.department_id !== req.user.department_id) {
      return next(new ErrorResponse('Not authorized to update this room', 403));
    }

    // Don't allow changing department_id
    delete req.body.department_id;

    // Check for duplicate room number if being changed
    if (req.body.room_number && req.body.room_number !== room.room_number) {
      const existingRoom = await Room.findOne({
        where: {
          room_number: req.body.room_number,
          department_id: room.department_id
        }
      });

      if (existingRoom) {
        return next(new ErrorResponse(`Room ${req.body.room_number} already exists in this department`, 400));
      }
    }

    room = await room.update(req.body);

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error in updateRoom:', error);
    return next(new ErrorResponse(error.message || 'Error updating room', 500));
  }
});

// @desc      Delete room
// @route     DELETE /api/v1/department-admin/rooms/:id
// @access    Private/DepartmentAdmin
export const deleteRoom = asyncHandler(async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
    }

    // Department admin can only delete their department's rooms
    if (req.user.role === 'department-admin' && room.department_id !== req.user.department_id) {
      return next(new ErrorResponse('Not authorized to delete this room', 403));
    }

    // Soft delete by setting is_active to false
    await room.update({ is_active: false });

    res.status(200).json({
      success: true,
      data: {},
      message: 'Room deactivated successfully'
    });
  } catch (error) {
    console.error('Error in deleteRoom:', error);
    return next(new ErrorResponse(error.message || 'Error deleting room', 500));
  }
});

// @desc      Get available rooms for a time slot
// @route     GET /api/v1/department-admin/rooms/available
// @access    Private/DepartmentAdmin
export const getAvailableRooms = asyncHandler(async (req, res, next) => {
  try {
    const { day, period, timetable_master_id } = req.query;

    if (!day || !period) {
      return next(new ErrorResponse('Please provide day and period', 400));
    }

    const where = {
      is_active: true
    };

    // Department admin can only see their department's rooms
    if (req.user.role === 'department-admin') {
      where.department_id = req.user.department_id;
    }

    // Get all active rooms
    const allRooms = await Room.findAll({ where });

    // Get occupied rooms for this time slot
    const { TimetablePeriod } = models;
    const occupiedPeriods = await TimetablePeriod.findAll({
      where: {
        day,
        period_number: parseInt(period),
        ...(timetable_master_id && { timetable_master_id: parseInt(timetable_master_id) })
      },
      attributes: ['room_id']
    });

    const occupiedRoomIds = occupiedPeriods.map(p => p.room_id).filter(id => id !== null);

    // Filter out occupied rooms
    const availableRooms = allRooms.filter(room => !occupiedRoomIds.includes(room.id));

    res.status(200).json({
      success: true,
      count: availableRooms.length,
      data: availableRooms
    });
  } catch (error) {
    console.error('Error in getAvailableRooms:', error);
    return next(new ErrorResponse(error.message || 'Error fetching available rooms', 500));
  }
});
