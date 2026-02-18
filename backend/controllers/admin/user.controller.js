import path from 'path';
import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import User from '../../models/User.model.js';
import { Op } from 'sequelize';

// @desc      Upload photo for user
// @route     PUT /api/v1/users/:id/photo
// @access    Private/Admin
export const uploadUserPhoto = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${user.id}${path.parse(file.name).ext}`;

  try {
    const uploadPath = path.resolve(process.env.FILE_UPLOAD_PATH, 'avatars', file.name);

    await file.mv(uploadPath);

    const photoUrl = `/uploads/avatars/${file.name}`;

    await User.update({ avatar: photoUrl }, { where: { id: req.params.id } });

    res.status(200).json({
      success: true,
      data: photoUrl
    });
  } catch (err) {
    console.error('File Upload Error:', err);
    return next(new ErrorResponse('Problem with file upload', 500));
  }
});

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let where = {};

  // Filter by role
  if (req.query.role) {
    where.role = req.query.role;
  }

  // Filter by active status
  if (req.query.isActive) {
    where.isActive = req.query.isActive === 'true';
  }

  // Search by name or email
  if (req.query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${req.query.search}%` } },
      { email: { [Op.like]: `%${req.query.search}%` } }
    ];
  }

  const total = await User.count({ where });
  const users = await User.findAll({
    where,
    offset: startIndex,
    limit,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password', 'pwd', 'resetPasswordToken', 'resetPasswordExpire'] }
  });

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: users
  });
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'pwd', 'resetPasswordToken', 'resetPasswordExpire'] }
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
  // Check if adding a department admin (HOD)
  if (req.body.role === 'department-admin' && req.body.departmentCode) {
    const existingHOD = await User.findOne({
      where: {
        role: 'department-admin',
        departmentCode: req.body.departmentCode
      }
    });

    if (existingHOD) {
      return next(new ErrorResponse(`Department ${req.body.departmentCode} already has a Head of Department (${existingHOD.name})`, 400));
    }
  }

  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  // Prevent password update through this route
  if (req.body.password) {
    delete req.body.password;
  }

  // Check if updating to a department admin (HOD)
  if (req.body.role === 'department-admin' && req.body.departmentCode) {
    const existingHOD = await User.findOne({
      where: {
        role: 'department-admin',
        departmentCode: req.body.departmentCode,
        id: { [Op.ne]: req.params.id }
      }
    });

    if (existingHOD) {
      return next(new ErrorResponse(`Department ${req.body.departmentCode} already has a Head of Department (${existingHOD.name})`, 400));
    }
  }

  await User.update(req.body, { where: { id: req.params.id } });
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'pwd', 'resetPasswordToken', 'resetPasswordExpire'] }
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  await user.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Deactivate user
// @route     PUT /api/v1/users/:id/deactivate
// @access    Private/Admin
export const deactivateUser = asyncHandler(async (req, res, next) => {
  await User.update({ isActive: false }, { where: { id: req.params.id } });
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'pwd', 'resetPasswordToken', 'resetPasswordExpire'] }
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Activate user
// @route     PUT /api/v1/users/:id/activate
// @access    Private/Admin
export const activateUser = asyncHandler(async (req, res, next) => {
  await User.update({ isActive: true }, { where: { id: req.params.id } });
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'pwd', 'resetPasswordToken', 'resetPasswordExpire'] }
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Get users by role
// @route     GET /api/v1/users/role/:role
// @access    Private/Admin
export const getUsersByRole = asyncHandler(async (req, res, next) => {
  const users = await User.findAll({
    where: { role: req.params.role, isActive: true },
    attributes: { exclude: ['password', 'pwd', 'resetPasswordToken', 'resetPasswordExpire'] }
  });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc      Get admin dashboard stats
// @route     GET /api/v1/users/stats/dashboard
// @access    Private/Admin
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.count();
  const totalFaculty = await User.count({ where: { role: 'faculty' } });
  const totalStudents = await User.count({ where: { role: 'student' } });
  const activeUsers = await User.count({ where: { isActive: true } });
  const inactiveUsers = await User.count({ where: { isActive: false } });

  const recentUsers = await User.findAll({
    order: [['createdAt', 'DESC']],
    limit: 5,
    attributes: ['name', 'email', 'role', 'createdAt']
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalFaculty,
      totalStudents,
      activeUsers,
      inactiveUsers,
      recentUsers
    }
  });
});
