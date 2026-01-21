const ErrorResponse = require('../../../utils/errorResponse');
const asyncHandler = require('../../../middleware/async');
const Faculty = require('../models/Faculty.model');
const User = require('../../admin/models/User.model');

// @desc      Get all faculty
// @route     GET /api/v1/faculty
// @access    Private
exports.getAllFaculty = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let query = {};

  // Filter by department
  if (req.query.department) {
    query.department = req.query.department;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by designation
  if (req.query.designation) {
    query.designation = req.query.designation;
  }

  // Search by name or employee ID
  if (req.query.search) {
    query.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { employeeId: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const total = await Faculty.countDocuments(query);
  const faculty = await Faculty.find(query)
    .populate('department', 'name code')
    .populate('subjects', 'name code')
    .populate('user', 'name email')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

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
exports.getFaculty = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id)
    .populate('department', 'name code')
    .populate('subjects', 'name code credits')
    .populate('assignedClasses')
    .populate('user', 'name email');

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
exports.createFaculty = asyncHandler(async (req, res, next) => {
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
  req.body.user = user._id;
  const faculty = await Faculty.create(req.body);

  res.status(201).json({
    success: true,
    data: faculty
  });
});

// @desc      Update faculty
// @route     PUT /api/v1/faculty/:id
// @access    Private/Admin
exports.updateFaculty = asyncHandler(async (req, res, next) => {
  let faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc      Delete faculty
// @route     DELETE /api/v1/faculty/:id
// @access    Private/Admin
exports.deleteFaculty = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  // Also delete the associated user
  await User.findByIdAndDelete(faculty.user);
  await faculty.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get faculty by department
// @route     GET /api/v1/faculty/department/:departmentId
// @access    Private
exports.getFacultyByDepartment = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.find({ 
    department: req.params.departmentId,
    status: 'active'
  })
    .populate('department', 'name code')
    .populate('subjects', 'name code');

  res.status(200).json({
    success: true,
    count: faculty.length,
    data: faculty
  });
});

// @desc      Assign subjects to faculty
// @route     PUT /api/v1/faculty/:id/subjects
// @access    Private/Admin
exports.assignSubjects = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { subjects: req.body.subjects },
    { new: true, runValidators: true }
  ).populate('subjects', 'name code');

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc      Assign classes to faculty
// @route     PUT /api/v1/faculty/:id/classes
// @access    Private/Admin
exports.assignClasses = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { assignedClasses: req.body.classes },
    { new: true, runValidators: true }
  ).populate('assignedClasses');

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc      Update faculty status
// @route     PUT /api/v1/faculty/:id/status
// @access    Private/Admin
exports.updateFacultyStatus = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!faculty) {
    return next(new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404));
  }

  // Update user active status
  await User.findByIdAndUpdate(faculty.user, {
    isActive: req.body.status === 'active'
  });

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc      Get faculty profile (for logged in faculty)
// @route     GET /api/v1/faculty/me/profile
// @access    Private/Faculty
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findOne({ user: req.user.id })
    .populate('department', 'name code')
    .populate('subjects', 'name code credits')
    .populate('assignedClasses');

  if (!faculty) {
    return next(new ErrorResponse('Faculty profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: faculty
  });
});
