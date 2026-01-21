const ErrorResponse = require('../../../utils/errorResponse');
const asyncHandler = require('../../../middleware/async');
const Leave = require('../models/Leave.model');
const LeaveBalance = require('../models/LeaveBalance.model');

// @desc      Get all leave applications
// @route     GET /api/v1/leave
// @access    Private
exports.getAllLeaves = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let query = {};

  // For non-admin users, show only their leaves
  if (!['superadmin', 'executiveadmin', 'academicadmin'].includes(req.user.role)) {
    query.applicant = req.user.id;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by leave type
  if (req.query.leaveType) {
    query.leaveType = req.query.leaveType;
  }

  // Filter by department
  if (req.query.department) {
    query.department = req.query.department;
  }

  // Filter by applicant type
  if (req.query.applicantType) {
    query.applicantType = req.query.applicantType;
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    query.startDate = { $gte: new Date(req.query.startDate) };
    query.endDate = { $lte: new Date(req.query.endDate) };
  }

  const total = await Leave.countDocuments(query);
  const leaves = await Leave.find(query)
    .populate('applicant', 'name email role')
    .populate('approvedBy', 'name')
    .populate('department', 'name')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: leaves.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: leaves
  });
});

// @desc      Get single leave application
// @route     GET /api/v1/leave/:id
// @access    Private
exports.getLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id)
    .populate('applicant', 'name email role')
    .populate('approvedBy', 'name')
    .populate('department', 'name');

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  // Check if user is authorized to view this leave
  if (
    !['superadmin', 'executiveadmin', 'academicadmin'].includes(req.user.role) &&
    leave.applicant._id.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to view this leave application', 403));
  }

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc      Create leave application
// @route     POST /api/v1/leave
// @access    Private
exports.createLeave = asyncHandler(async (req, res, next) => {
  req.body.applicant = req.user.id;
  req.body.applicantType = req.user.role === 'faculty' ? 'faculty' : 'student';

  // Calculate total days
  const start = new Date(req.body.startDate);
  const end = new Date(req.body.endDate);
  const diffTime = Math.abs(end - start);
  req.body.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Check leave balance
  const currentYear = new Date().getFullYear().toString();
  const leaveBalance = await LeaveBalance.findOne({
    user: req.user.id,
    academicYear: currentYear
  });

  if (leaveBalance) {
    const leaveType = req.body.leaveType;
    if (leaveBalance[leaveType] && leaveBalance[leaveType].balance < req.body.totalDays) {
      return next(new ErrorResponse(`Insufficient ${leaveType} leave balance`, 400));
    }
  }

  const leave = await Leave.create(req.body);

  res.status(201).json({
    success: true,
    data: leave
  });
});

// @desc      Update leave application
// @route     PUT /api/v1/leave/:id
// @access    Private
exports.updateLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  // Only allow update if status is pending and user is the applicant
  if (leave.status !== 'pending') {
    return next(new ErrorResponse('Cannot update leave application after it has been processed', 400));
  }

  if (leave.applicant.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this leave application', 403));
  }

  leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc      Approve/Reject leave application
// @route     PUT /api/v1/leave/:id/status
// @access    Private/Admin
exports.updateLeaveStatus = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  if (leave.status !== 'pending') {
    return next(new ErrorResponse('Leave application has already been processed', 400));
  }

  leave.status = req.body.status;
  leave.approvedBy = req.user.id;
  leave.approvalDate = Date.now();
  leave.approvalRemarks = req.body.remarks;

  await leave.save();

  // Update leave balance if approved
  if (req.body.status === 'approved') {
    const currentYear = new Date().getFullYear().toString();
    const leaveBalance = await LeaveBalance.findOne({
      user: leave.applicant,
      academicYear: currentYear
    });

    if (leaveBalance && leaveBalance[leave.leaveType]) {
      leaveBalance[leave.leaveType].used += leave.totalDays;
      leaveBalance[leave.leaveType].balance -= leave.totalDays;
      await leaveBalance.save();
    }
  }

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc      Cancel leave application
// @route     PUT /api/v1/leave/:id/cancel
// @access    Private
exports.cancelLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  if (leave.applicant.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to cancel this leave application', 403));
  }

  // If leave was approved, restore balance
  if (leave.status === 'approved') {
    const currentYear = new Date().getFullYear().toString();
    const leaveBalance = await LeaveBalance.findOne({
      user: leave.applicant,
      academicYear: currentYear
    });

    if (leaveBalance && leaveBalance[leave.leaveType]) {
      leaveBalance[leave.leaveType].used -= leave.totalDays;
      leaveBalance[leave.leaveType].balance += leave.totalDays;
      await leaveBalance.save();
    }
  }

  leave.status = 'cancelled';
  await leave.save();

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc      Delete leave application
// @route     DELETE /api/v1/leave/:id
// @access    Private/Admin
exports.deleteLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  await leave.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get my leave applications
// @route     GET /api/v1/leave/my-leaves
// @access    Private
exports.getMyLeaves = asyncHandler(async (req, res, next) => {
  const leaves = await Leave.find({ applicant: req.user.id })
    .populate('approvedBy', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: leaves.length,
    data: leaves
  });
});

// @desc      Get leave balance
// @route     GET /api/v1/leave/balance
// @access    Private
exports.getLeaveBalance = asyncHandler(async (req, res, next) => {
  const currentYear = new Date().getFullYear().toString();
  
  let leaveBalance = await LeaveBalance.findOne({
    user: req.user.id,
    academicYear: currentYear
  });

  // Create default balance if not exists
  if (!leaveBalance) {
    leaveBalance = await LeaveBalance.create({
      user: req.user.id,
      userType: req.user.role === 'faculty' ? 'faculty' : 'student',
      academicYear: currentYear
    });
  }

  res.status(200).json({
    success: true,
    data: leaveBalance
  });
});

// @desc      Get pending leave count (for admin dashboard)
// @route     GET /api/v1/leave/pending-count
// @access    Private/Admin
exports.getPendingCount = asyncHandler(async (req, res, next) => {
  const count = await Leave.countDocuments({ status: 'pending' });

  res.status(200).json({
    success: true,
    data: { pendingCount: count }
  });
});
