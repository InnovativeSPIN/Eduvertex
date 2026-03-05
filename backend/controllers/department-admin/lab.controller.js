import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import { models } from '../../models/index.js';

const { Lab, Department, Room, Subject } = models;

// @desc      Get all labs
// @route     GET /api/v1/department-admin/labs
// @access    Private/DepartmentAdmin
export const getLabs = asyncHandler(async (req, res, next) => {
  try {
    const where = {};
    
    // Department admin can only see their department's labs
    if (req.user.role === 'department-admin') {
      where.department_id = req.user.department_id;
    } else if (req.query.department_id) {
      where.department_id = parseInt(req.query.department_id);
    }

    if (req.query.is_active !== undefined) {
      where.is_active = req.query.is_active === 'true';
    }

    const labs = await Lab.findAll({
      where,
      include: [
        { model: Department, as: 'department', attributes: ['id', 'short_name', 'full_name'] },
        { model: Room, as: 'room', attributes: ['id', 'room_number', 'room_name', 'capacity'] }
      ],
      order: [['lab_code', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: labs.length,
      data: labs
    });
  } catch (error) {
    console.error('Error in getLabs:', error);
    return next(new ErrorResponse(error.message || 'Error fetching labs', 500));
  }
});

// @desc      Get single lab
// @route     GET /api/v1/department-admin/labs/:id
// @access    Private/DepartmentAdmin
export const getLab = asyncHandler(async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department', attributes: ['id', 'short_name', 'full_name'] },
        { model: Room, as: 'room', attributes: ['id', 'room_number', 'room_name', 'capacity'] }
      ]
    });

    if (!lab) {
      return next(new ErrorResponse(`Lab not found with id of ${req.params.id}`, 404));
    }

    // Department admin can only see their department's labs
    if (req.user.role === 'department-admin' && lab.department_id !== req.user.department_id) {
      return next(new ErrorResponse('Not authorized to access this lab', 403));
    }

    res.status(200).json({
      success: true,
      data: lab
    });
  } catch (error) {
    console.error('Error in getLab:', error);
    return next(new ErrorResponse(error.message || 'Error fetching lab', 500));
  }
});

// @desc      Create new lab
// @route     POST /api/v1/department-admin/labs
// @access    Private/DepartmentAdmin
export const createLab = asyncHandler(async (req, res, next) => {
  try {
    // Department admin can only create labs for their department
    if (req.user.role === 'department-admin') {
      req.body.department_id = req.user.department_id;
    }

    // Check if lab code already exists
    const existingLab = await Lab.findOne({
      where: {
        lab_code: req.body.lab_code
      }
    });

    if (existingLab) {
      return next(new ErrorResponse(`Lab with code ${req.body.lab_code} already exists`, 400));
    }

    // If room_id is provided, verify it exists and belongs to the department
    if (req.body.room_id) {
      const room = await Room.findByPk(req.body.room_id);
      if (!room) {
        return next(new ErrorResponse(`Room not found with id of ${req.body.room_id}`, 404));
      }
      if (room.department_id !== req.body.department_id) {
        return next(new ErrorResponse('Room does not belong to this department', 400));
      }
    }

    const lab = await Lab.create(req.body);

    res.status(201).json({
      success: true,
      data: lab
    });
  } catch (error) {
    console.error('Error in createLab:', error);
    return next(new ErrorResponse(error.message || 'Error creating lab', 500));
  }
});

// @desc      Update lab
// @route     PUT /api/v1/department-admin/labs/:id
// @access    Private/DepartmentAdmin
export const updateLab = asyncHandler(async (req, res, next) => {
  try {
    let lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return next(new ErrorResponse(`Lab not found with id of ${req.params.id}`, 404));
    }

    // Department admin can only update their department's labs
    if (req.user.role === 'department-admin' && lab.department_id !== req.user.department_id) {
      return next(new ErrorResponse('Not authorized to update this lab', 403));
    }

    // Don't allow changing department_id
    delete req.body.department_id;

    // Check for duplicate lab code if being changed
    if (req.body.lab_code && req.body.lab_code !== lab.lab_code) {
      const existingLab = await Lab.findOne({
        where: {
          lab_code: req.body.lab_code
        }
      });

      if (existingLab) {
        return next(new ErrorResponse(`Lab with code ${req.body.lab_code} already exists`, 400));
      }
    }

    // Verify room if being changed
    if (req.body.room_id && req.body.room_id !== lab.room_id) {
      const room = await Room.findByPk(req.body.room_id);
      if (!room) {
        return next(new ErrorResponse(`Room not found with id of ${req.body.room_id}`, 404));
      }
      if (room.department_id !== lab.department_id) {
        return next(new ErrorResponse('Room does not belong to this department', 400));
      }
    }

    lab = await lab.update(req.body);

    res.status(200).json({
      success: true,
      data: lab
    });
  } catch (error) {
    console.error('Error in updateLab:', error);
    return next(new ErrorResponse(error.message || 'Error updating lab', 500));
  }
});

// @desc      Delete lab
// @route     DELETE /api/v1/department-admin/labs/:id
// @access    Private/DepartmentAdmin
export const deleteLab = asyncHandler(async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return next(new ErrorResponse(`Lab not found with id of ${req.params.id}`, 404));
    }

    // Department admin can only delete their department's labs
    if (req.user.role === 'department-admin' && lab.department_id !== req.user.department_id) {
      return next(new ErrorResponse('Not authorized to delete this lab', 403));
    }

    // Soft delete by setting is_active to false
    await lab.update({ is_active: false });

    res.status(200).json({
      success: true,
      data: {},
      message: 'Lab deactivated successfully'
    });
  } catch (error) {
    console.error('Error in deleteLab:', error);
    return next(new ErrorResponse(error.message || 'Error deleting lab', 500));
  }
});

// @desc      Get labs by subject
// @route     GET /api/v1/department-admin/labs/by-subject/:subjectId
// @access    Private/DepartmentAdmin
export const getLabsBySubject = asyncHandler(async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const where = {
      is_active: true
    };

    // Department admin can only see their department's labs
    if (req.user.role === 'department-admin') {
      where.department_id = req.user.department_id;
    }

    const labs = await Lab.findAll({ where });

    // Filter labs that have this subject in their subject_ids array
    const filteredLabs = labs.filter(lab => {
      if (!lab.subject_ids || !Array.isArray(lab.subject_ids)) return false;
      return lab.subject_ids.includes(parseInt(subjectId));
    });

    res.status(200).json({
      success: true,
      count: filteredLabs.length,
      data: filteredLabs
    });
  } catch (error) {
    console.error('Error in getLabsBySubject:', error);
    return next(new ErrorResponse(error.message || 'Error fetching labs by subject', 500));
  }
});

// @desc      Assign subjects to lab
// @route     POST /api/v1/department-admin/labs/:id/assign-subjects
// @access    Private/DepartmentAdmin
export const assignSubjectsToLab = asyncHandler(async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return next(new ErrorResponse(`Lab not found with id of ${req.params.id}`, 404));
    }

    // Department admin can only update their department's labs
    if (req.user.role === 'department-admin' && lab.department_id !== req.user.department_id) {
      return next(new ErrorResponse('Not authorized to update this lab', 403));
    }

    const { subject_ids } = req.body;

    if (!Array.isArray(subject_ids)) {
      return next(new ErrorResponse('subject_ids must be an array', 400));
    }

    // Verify all subjects exist and belong to the department
    const subjects = await Subject.findAll({
      where: {
        id: subject_ids,
        department_id: lab.department_id
      }
    });

    if (subjects.length !== subject_ids.length) {
      return next(new ErrorResponse('Some subjects not found or do not belong to this department', 400));
    }

    await lab.update({ subject_ids });

    res.status(200).json({
      success: true,
      data: lab,
      message: 'Subjects assigned to lab successfully'
    });
  } catch (error) {
    console.error('Error in assignSubjectsToLab:', error);
    return next(new ErrorResponse(error.message || 'Error assigning subjects to lab', 500));
  }
});
