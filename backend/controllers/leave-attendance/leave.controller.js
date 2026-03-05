import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import { models } from '../../models/index.js';
const { Leave, LeaveBalance, User, Department, Faculty, LeaveNotification } = models;
import { Op } from 'sequelize';

// @desc      Get all leave applications
// @route     GET /api/v1/leave
// @access    Private
export const getAllLeaves = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    let where = {};

    // For non-admin users, show only their leaves
    if (!['superadmin', 'executiveadmin', 'academicadmin'].includes(req.user.role)) {
      where.applicantId = req.user.id;
    }

    // Filter by status
    if (req.query.status) {
      where.status = req.query.status;
    }

    // Filter by leave type
    if (req.query.leaveType) {
      where.leaveType = req.query.leaveType;
    }

    // Filter by department
    if (req.query.department) {
      where.departmentId = req.query.department;
    }

    // Filter by applicant type
    if (req.query.applicantType) {
      where.applicantType = req.query.applicantType;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      where.startDate = { [Op.gte]: new Date(req.query.startDate) };
      where.endDate = { [Op.lte]: new Date(req.query.endDate) };
    }

    const total = await Leave.count({ where });
    const leaves = await Leave.findAll({
      where,
      offset: startIndex,
      limit,
      order: [['createdAt', 'DESC']],
      raw: true
    });

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
  } catch (error) {
    console.error('[getAllLeaves] Error:', error.message);
    return next(new ErrorResponse(`Error fetching leaves: ${error.message}`, 500));
  }
});

// @desc      Get single leave application
// @route     GET /api/v1/leave/:id
// @access    Private
export const getLeave = asyncHandler(async (req, res, next) => {
  try {
    const leave = await Leave.findByPk(req.params.id, {
      raw: true
    });

    if (!leave) {
      return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
    }

    // Check if user is authorized to view this leave
    if (
      !['superadmin', 'executiveadmin', 'academicadmin'].includes(req.user.role) &&
      leave.applicantId !== Number(req.user.id)
    ) {
      return next(new ErrorResponse('Not authorized to view this leave application', 403));
    }

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (error) {
    console.error('[getLeave] Error:', error.message);
    return next(new ErrorResponse(`Error fetching leave: ${error.message}`, 500));
  }
});

// @desc      Create leave application
// @route     POST /api/v1/leave
// @access    Private
export const createLeave = asyncHandler(async (req, res, next) => {
  req.body.applicantId = req.user.id;
  req.body.applicantType = req.user.role === 'faculty' ? 'faculty' : 'student';

  // Set department ID if user has department (faculty or student with department)
  if (req.user.departmentId) {
    req.body.departmentId = req.user.departmentId;
  }

  // Store reassign faculty
  if (req.body.reassignFacultyId) {
    req.body.reassign_faculty_id = req.body.reassignFacultyId;
  }

  // Calculate total days
  const start = new Date(req.body.startDate);
  const end = new Date(req.body.endDate);
  const diffTime = Math.abs(end - start);
  req.body.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const leave = await Leave.create(req.body);

  // Notify department admin
  try {
    if (leave.departmentId) {
      const deptAdmin = await Faculty.findOne({
        where: { department_id: leave.departmentId, role_id: 7, status: 'active' },
        attributes: ['faculty_id'],
      });

      const senderName = req.user.Name || req.user.name || 'Faculty';
      const startStr = new Date(req.body.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const endStr = new Date(req.body.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      await LeaveNotification.create({
        recipientId: deptAdmin?.faculty_id || null,
        recipientType: 'department-admin',
        departmentId: leave.departmentId,
        senderId: req.user.id,
        senderName,
        leaveId: leave.id,
        facultyName: senderName,
        leaveType: req.body.leaveType,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        type: 'leave_submitted',
        title: `Leave Request from ${senderName}`,
        message: `${senderName} has applied for ${req.body.leaveType} leave from ${startStr} to ${endStr}`,
        isRead: false,
      });
    }
  } catch (notifErr) {
    console.error('[Leave] Notification error (non-fatal):', notifErr.message);
  }

  res.status(201).json({
    success: true,
    data: leave
  });
});

// @desc      Update leave application
// @route     PUT /api/v1/leave/:id
// @access    Private
export const updateLeave = asyncHandler(async (req, res, next) => {
  let leave = await Leave.findByPk(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  // Only allow update if status is pending and user is the applicant
  if (leave.status !== 'pending') {
    return next(new ErrorResponse('Cannot update leave application after it has been processed', 400));
  }

  if (leave.applicantId !== Number(req.user.id)) {
    return next(new ErrorResponse('Not authorized to update this leave application', 403));
  }

  await Leave.update(req.body, { where: { id: req.params.id } });
  leave = await Leave.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc      Approve/Reject leave application
// @route     PUT /api/v1/leave/:id/status
// @access    Private/Admin
export const updateLeaveStatus = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findByPk(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  if (leave.status !== 'pending') {
    return next(new ErrorResponse('Leave application has already been processed', 400));
  }

  // Check authorization - department admin can only approve leaves from their department
  const superRoles = ['superadmin', 'super-admin', 'executiveadmin', 'academicadmin'];
  if (req.user.role === 'department-admin' && leave.departmentId !== Number(req.user.departmentId)) {
    return next(new ErrorResponse('Not authorized to approve leave applications from other departments', 403));
  }

  leave.status = req.body.status;
  leave.approvedById = req.user.id;
  leave.approvalDate = Date.now();
  leave.approvalRemarks = req.body.remarks;

  await leave.save();

  // Update leave balance if approved
  if (req.body.status === 'approved') {
    const currentYear = new Date().getFullYear().toString();
    const leaveBalance = await LeaveBalance.findOne({
      where: {
        userId: leave.applicantId,
        academicYear: currentYear
      }
    });

    if (leaveBalance && leaveBalance[leave.leaveType]) {
      const updatedBalance = {
        ...leaveBalance[leave.leaveType],
        used: leaveBalance[leave.leaveType].used + leave.totalDays,
        balance: leaveBalance[leave.leaveType].balance - leave.totalDays
      };
      leaveBalance.set(leave.leaveType, updatedBalance);
      await leaveBalance.save();
    }
  }

  // Create notifications (non-fatal)
  try {
    const approverName = req.user.Name || req.user.name || 'Department Admin';
    const isApproved = req.body.status === 'approved';
    const statusLabel = isApproved ? 'Approved' : 'Rejected';

    // Find the faculty applicant for their name
    const applicantFaculty = await Faculty.findByPk(leave.applicantId, { attributes: ['faculty_id', 'Name', 'department_id'] });
    const applicantName = applicantFaculty?.Name || 'Faculty';

    // 1. Notify the faculty who applied
    await LeaveNotification.create({
      recipientId: leave.applicantId,
      recipientType: 'faculty',
      departmentId: leave.departmentId,
      senderId: req.user.id,
      senderName: approverName,
      leaveId: leave.id,
      facultyName: applicantName,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      type: isApproved ? 'leave_approved' : 'leave_rejected',
      title: `Leave ${statusLabel}`,
      message: `Your ${leave.leaveType} leave request has been ${req.body.status} by the Department Admin.${req.body.remarks ? ` Remarks: ${req.body.remarks}` : ''}`,
      isRead: false,
    });

    // 2. If approved, notify all executive admins
    if (isApproved) {
      await LeaveNotification.create({
        recipientId: null,
        recipientType: 'executiveadmin',
        departmentId: leave.departmentId,
        senderId: req.user.id,
        senderName: approverName,
        leaveId: leave.id,
        facultyName: applicantName,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        type: 'leave_approved',
        title: `Leave Approved: ${applicantName}`,
        message: `${applicantName}'s ${leave.leaveType} leave has been approved by ${approverName}.`,
        isRead: false,
      });
    }
  } catch (notifErr) {
    console.error('[LeaveStatus] Notification error (non-fatal):', notifErr.message);
  }

  res.status(200).json({
    success: true,
    data: leave
  });
});

// @desc      Cancel leave application
// @route     PUT /api/v1/leave/:id/cancel
// @access    Private
export const cancelLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findByPk(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  if (leave.applicantId !== Number(req.user.id)) {
    return next(new ErrorResponse('Not authorized to cancel this leave application', 403));
  }

  // If leave was approved, restore balance
  if (leave.status === 'approved') {
    const currentYear = new Date().getFullYear().toString();
    const leaveBalance = await LeaveBalance.findOne({
      where: {
        userId: leave.applicantId,
        academicYear: currentYear
      }
    });

    if (leaveBalance && leaveBalance[leave.leaveType]) {
      const updatedBalance = {
        ...leaveBalance[leave.leaveType],
        used: leaveBalance[leave.leaveType].used - leave.totalDays,
        balance: leaveBalance[leave.leaveType].balance + leave.totalDays
      };
      leaveBalance.set(leave.leaveType, updatedBalance);
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
// @access    Private (admin: any; faculty: own pending only)
export const deleteLeave = asyncHandler(async (req, res, next) => {
  const leave = await Leave.findByPk(req.params.id);

  if (!leave) {
    return next(new ErrorResponse(`Leave application not found with id of ${req.params.id}`, 404));
  }

  const isAdmin = ['superadmin', 'super-admin', 'executiveadmin', 'academicadmin', 'department-admin'].includes(req.user.role);

  if (!isAdmin) {
    if (leave.applicantId !== Number(req.user.id)) {
      return next(new ErrorResponse('Not authorized to delete this leave application', 403));
    }
    if (leave.status !== 'pending') {
      return next(new ErrorResponse('Only pending leave applications can be deleted', 400));
    }
  }

  await leave.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get my leave applications
// @route     GET /api/v1/leave/my-leaves
// @access    Private
export const getMyLeaves = asyncHandler(async (req, res, next) => {
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    console.error('[Leave] Authentication failed - req.user:', req.user);
    return next(new ErrorResponse('User not authenticated', 401));
  }

  try {
    console.log('[Leave] Fetching leaves for user:', req.user.id, 'Role:', req.user.role);
    
    // First, just count the records to verify the query works
    const count = await Leave.count({
      where: { applicantId: req.user.id }
    });
    console.log('[Leave] Count query returned:', count);

    // Now fetch the leaves
    const leaves = await Leave.findAll({
      where: { applicantId: req.user.id },
      order: [['createdAt', 'DESC']],
      raw: true  // Return plain objects instead of Sequelize instances
    });

    console.log('[Leave] Found', leaves.length, 'leaves');

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    console.error('[Leave] Query Error:', error.message, error.stack);
    return next(new ErrorResponse(`Error fetching leaves: ${error.message}`, 500));
  }
});

// @desc      Get leave balance
// @route     GET /api/v1/leave/balance
// @access    Private
export const getLeaveBalance = asyncHandler(async (req, res, next) => {
  const currentYear = new Date().getFullYear().toString();

  let leaveBalance = await LeaveBalance.findOne({
    where: {
      userId: req.user.id,
      academicYear: currentYear
    }
  });

  // Create default balance if not exists
  if (!leaveBalance) {
    leaveBalance = await LeaveBalance.create({
      userId: req.user.id,
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
export const getPendingCount = asyncHandler(async (req, res, next) => {
  let where = { status: 'pending' };

  // Department admin sees only their department's pending leaves
  if (req.user.role === 'department-admin' && req.user.departmentId) {
    where.departmentId = req.user.departmentId;
  }

  const count = await Leave.count({ where });

  res.status(200).json({
    success: true,
    data: { pendingCount: count }
  });
});

// @desc      Get pending leaves for approval
// @route     GET /api/v1/leave/pending-approvals
// @access    Private/Admin
export const getPendingLeaves = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    let where = { status: 'pending' };

    // Department admin sees only their department's pending leaves
    if (req.user.role === 'department-admin' && req.user.departmentId) {
      where.departmentId = req.user.departmentId;
    }

    console.log('[PendingLeaves] Fetching with where:', where, 'User role:', req.user.role);

    // Superadmins, executive, academic see all pending leaves
    // Department admin sees only from their department

    const total = await Leave.count({ where });
    console.log('[PendingLeaves] Total count:', total);

    const rawLeaves = await Leave.findAll({
      where,
      offset: startIndex,
      limit,
      order: [['createdAt', 'DESC']],
      raw: true
    });

    // Enrich with applicant name from faculty table
    const applicantIds = [...new Set(rawLeaves.map(l => l.applicantId))];
    const facultyList = applicantIds.length
      ? await Faculty.findAll({
          where: { faculty_id: applicantIds },
          attributes: ['faculty_id', 'Name', 'email', 'designation'],
          raw: true,
        })
      : [];
    const facultyMap = Object.fromEntries(facultyList.map(f => [f.faculty_id, f]));

    const leaves = rawLeaves.map(l => ({
      ...l,
      applicant: facultyMap[l.applicantId]
        ? {
            name: facultyMap[l.applicantId].Name,
            email: facultyMap[l.applicantId].email,
            role: facultyMap[l.applicantId].designation || 'Faculty',
          }
        : { name: 'Unknown', email: '', role: 'Faculty' },
    }));

    console.log('[PendingLeaves] Found', leaves.length, 'leaves');

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
  } catch (error) {
    console.error('[PendingLeaves] Error:', error.message, error.stack);
    return next(new ErrorResponse(`Error fetching pending leaves: ${error.message}`, 500));
  }
});

// @desc      Get leave notifications for current user
// @route     GET /api/v1/leave/notifications
// @access    Private
export const getLeaveNotifications = asyncHandler(async (req, res, next) => {
  try {
    const where = {};

    if (req.user.role === 'faculty') {
      where.recipientType = 'faculty';
      where.recipientId = req.user.id;
    } else if (req.user.role === 'department-admin') {
      where.recipientType = 'department-admin';
      where.departmentId = req.user.departmentId;
    } else if (['executiveadmin', 'superadmin', 'super-admin', 'academicadmin'].includes(req.user.role)) {
      where.recipientType = 'executiveadmin';
    } else {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const notifications = await LeaveNotification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 30,
      raw: true,
    });

    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    console.error('[LeaveNotifications] Error:', error.message);
    return next(new ErrorResponse(`Error fetching notifications: ${error.message}`, 500));
  }
});

// @desc      Get unread leave notification count
// @route     GET /api/v1/leave/notifications/unread-count
// @access    Private
export const getLeaveNotificationCount = asyncHandler(async (req, res, next) => {
  try {
    const where = { isRead: false };

    if (req.user.role === 'faculty') {
      where.recipientType = 'faculty';
      where.recipientId = req.user.id;
    } else if (req.user.role === 'department-admin') {
      where.recipientType = 'department-admin';
      where.departmentId = req.user.departmentId;
    } else if (['executiveadmin', 'superadmin', 'super-admin', 'academicadmin'].includes(req.user.role)) {
      where.recipientType = 'executiveadmin';
    } else {
      return res.status(200).json({ success: true, data: { count: 0 } });
    }

    const count = await LeaveNotification.count({ where });
    res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    console.error('[LeaveNotifCount] Error:', error.message);
    return next(new ErrorResponse(`Error fetching count: ${error.message}`, 500));
  }
});

// @desc      Mark leave notification as read
// @route     PUT /api/v1/leave/notifications/:id/read
// @access    Private
export const markLeaveNotificationRead = asyncHandler(async (req, res, next) => {
  try {
    await LeaveNotification.update(
      { isRead: true },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    return next(new ErrorResponse(`Error marking notification as read: ${error.message}`, 500));
  }
});

// @desc      Mark all leave notifications as read for current user
// @route     PUT /api/v1/leave/notifications/mark-all-read
// @access    Private
export const markAllLeaveNotificationsRead = asyncHandler(async (req, res, next) => {
  try {
    const where = {};

    if (req.user.role === 'faculty') {
      where.recipientType = 'faculty';
      where.recipientId = req.user.id;
    } else if (req.user.role === 'department-admin') {
      where.recipientType = 'department-admin';
      where.departmentId = req.user.departmentId;
    } else if (['executiveadmin', 'superadmin'].includes(req.user.role)) {
      where.recipientType = 'executiveadmin';
    }

    await LeaveNotification.update({ isRead: true }, { where });
    res.status(200).json({ success: true });
  } catch (error) {
    return next(new ErrorResponse(`Error marking notifications as read: ${error.message}`, 500));
  }
});
