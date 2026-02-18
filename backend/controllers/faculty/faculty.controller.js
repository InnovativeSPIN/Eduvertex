import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import Faculty from '../../models/Faculty.model.js';
import User from '../../models/User.model.js';
import Department from '../../models/Department.model.js';
import Subject from '../../models/Subject.model.js';
import ClassModel from '../../models/Class.model.js';
import { Op } from 'sequelize';

// @desc      Get all faculty
// @route     GET /api/v1/faculty
// @access    Private
export const getAllFaculty = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let where = {};

  // Filter by department
  if (req.query.department) {
    where.departmentId = req.query.department;
  }

  // Filter by status
  if (req.query.status) {
    where.status = req.query.status;
  }

  // Filter by designation
  if (req.query.designation) {
    where.designation = req.query.designation;
  }

  // Search by name or employee ID
  if (req.query.search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${req.query.search}%` } },
      { lastName: { [Op.like]: `%${req.query.search}%` } },
      { employeeId: { [Op.like]: `%${req.query.search}%` } },
      { email: { [Op.like]: `%${req.query.search}%` } }
    ];
  }

  const total = await Faculty.count({ where });
  const faculty = await Faculty.findAll({
    where,
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: Subject, as: 'subjects', attributes: ['name', 'code'] },
      { model: User, as: 'user', attributes: ['name', 'email'] }
    ],
    offset: startIndex,
    limit,
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    success: true,
    count: faculty.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: faculty
  });
});

// @desc      Get single faculty
// @route     GET /api/v1/faculty/:id
// @access    Private
export const getFaculty = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findByPk(req.params.id, {
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: Subject, as: 'subjects', attributes: ['name', 'code', 'credits'] },
      { model: ClassModel, as: 'assignedClasses' },
      { model: User, as: 'user', attributes: ['name', 'email'] }
    ]
  });

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc      Create faculty
// @route     POST /api/v1/faculty
// @access    Private/Admin
export const createFaculty = asyncHandler(async (req, res, next) => {
  // Check if adding an HOD
  if (req.body.designation === 'HOD') {
    const existingHOD = await Faculty.findOne({
      where: {
        departmentId: req.body.department,
        designation: 'HOD'
      },
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    });

    if (existingHOD) {
      return next(new ErrorResponse(`Department already has a Head of Department (${existingHOD.user ? existingHOD.user.name : 'Unknown'}) in faculty records`, 400));
    }
  }

  // Create user account first
  const userData = {
    name: `${req.body.firstName} ${req.body.lastName}`,
    email: req.body.email,
    password: req.body.password || 'default123',
    role: 'faculty',
    phone: req.body.phone,
    department: req.body.department
  };

  const user = await User.create(userData);

  // Create faculty profile
  req.body.userId = user.id;
  req.body.departmentId = req.body.department;
  delete req.body.department;
  const faculty = await Faculty.create(req.body);

  res.status(201).json({
    success: true,
    data: faculty
  });
});

// @desc      Update faculty
// @route     PUT /api/v1/faculty/:id
// @access    Private/Admin
export const updateFaculty = asyncHandler(async (req, res, next) => {
  let faculty = await Faculty.findByPk(req.params.id);

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  // Check if updating to an HOD
  if (req.body.designation === 'HOD') {
    const existingHOD = await Faculty.findOne({
      where: {
        departmentId: req.body.department || faculty.departmentId,
        designation: 'HOD',
        id: { [Op.ne]: req.params.id }
      },
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    });

    if (existingHOD) {
      return next(new ErrorResponse(`Department already has a Head of Department (${existingHOD.user ? existingHOD.user.name : 'Unknown'}) in faculty records`, 400));
    }
  }

  if (req.body.department) {
    req.body.departmentId = req.body.department;
    delete req.body.department;
  }
  await Faculty.update(req.body, { where: { id: req.params.id } });
  faculty = await Faculty.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc      Delete faculty
// @route     DELETE /api/v1/faculty/:id
// @access    Private/Admin
export const deleteFaculty = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findByPk(req.params.id);

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  // Also delete the associated user
  await User.destroy({ where: { id: faculty.userId } });
  await faculty.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get faculty by department
// @route     GET /api/v1/faculty/department/:departmentId
// @access    Private
export const getFacultyByDepartment = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findAll({
    where: {
      departmentId: req.params.departmentId,
      status: 'active'
    },
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: Subject, as: 'subjects', attributes: ['name', 'code'] }
    ]
  });

  res.status(200).json({
    success: true,
    count: faculty.length,
    data: faculty
  });
});

// @desc      Assign subjects to faculty
// @route     PUT /api/v1/faculty/:id/subjects
// @access    Private/Admin
export const assignSubjects = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findByPk(req.params.id);

  if (faculty) {
    await faculty.setSubjects(req.body.subjects || []);
  }

  const updatedFaculty = await Faculty.findByPk(req.params.id, {
    include: [{ model: Subject, as: 'subjects', attributes: ['name', 'code'] }]
  });

  if (!updatedFaculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: updatedFaculty
  });
});

// @desc      Assign classes to faculty
// @route     PUT /api/v1/faculty/:id/classes
// @access    Private/Admin
export const assignClasses = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findByPk(req.params.id);

  if (faculty) {
    await faculty.setAssignedClasses(req.body.classes || []);
  }

  const updatedFaculty = await Faculty.findByPk(req.params.id, {
    include: [{ model: ClassModel, as: 'assignedClasses' }]
  });

  if (!updatedFaculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: updatedFaculty
  });
});

// @desc      Update faculty status
// @route     PUT /api/v1/faculty/:id/status
// @access    Private/Admin
export const updateFacultyStatus = asyncHandler(async (req, res, next) => {
  await Faculty.update(
    { status: req.body.status },
    { where: { id: req.params.id } }
  );
  const faculty = await Faculty.findByPk(req.params.id);

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  // Update user active status
  await User.update({
    isActive: req.body.status === 'active'
  }, { where: { id: faculty.userId } });

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc      Get faculty profile (for logged in faculty)
// @route     GET /api/v1/faculty/me/profile
// @access    Private/Faculty
export const getMyProfile = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findOne({
    where: { userId: req.user.id },
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: Subject, as: 'subjects', attributes: ['name', 'code', 'credits'] },
      { model: ClassModel, as: 'assignedClasses' }
    ]
  });

  if (!faculty) {
    return next(new ErrorResponse('Faculty profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: faculty
  });
});
