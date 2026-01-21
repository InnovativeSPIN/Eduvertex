const ErrorResponse = require('../../../utils/errorResponse');
const asyncHandler = require('../../../middleware/async');
const Attendance = require('../models/Attendance.model');
const FacultyAttendance = require('../models/FacultyAttendance.model');
const Student = require('../../student/models/Student.model');

// @desc      Get all attendance records
// @route     GET /api/v1/attendance
// @access    Private
exports.getAllAttendance = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let query = {};

  if (req.query.class) {
    query.class = req.query.class;
  }

  if (req.query.subject) {
    query.subject = req.query.subject;
  }

  if (req.query.faculty) {
    query.faculty = req.query.faculty;
  }

  if (req.query.date) {
    const date = new Date(req.query.date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    query.date = { $gte: date, $lt: nextDate };
  }

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const total = await Attendance.countDocuments(query);
  const attendance = await Attendance.find(query)
    .populate('class', 'name section')
    .populate('subject', 'name code')
    .populate('faculty', 'firstName lastName')
    .populate('students.student', 'firstName lastName rollNumber')
    .skip(startIndex)
    .limit(limit)
    .sort('-date');

  res.status(200).json({
    success: true,
    count: attendance.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: attendance
  });
});

// @desc      Get single attendance record
// @route     GET /api/v1/attendance/:id
// @access    Private
exports.getAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('class', 'name section')
    .populate('subject', 'name code')
    .populate('faculty', 'firstName lastName')
    .populate('students.student', 'firstName lastName rollNumber studentId');

  if (!attendance) {
    return next(new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc      Mark attendance
// @route     POST /api/v1/attendance
// @access    Private/Faculty
exports.markAttendance = asyncHandler(async (req, res, next) => {
  req.body.markedBy = req.user.id;

  // Check if attendance already marked for this class, subject, date, and period
  const existingAttendance = await Attendance.findOne({
    class: req.body.class,
    subject: req.body.subject,
    date: {
      $gte: new Date(new Date(req.body.date).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(req.body.date).setHours(23, 59, 59, 999))
    },
    period: req.body.period
  });

  if (existingAttendance) {
    return next(new ErrorResponse('Attendance already marked for this class, subject, date, and period', 400));
  }

  const attendance = await Attendance.create(req.body);

  res.status(201).json({
    success: true,
    data: attendance
  });
});

// @desc      Update attendance
// @route     PUT /api/v1/attendance/:id
// @access    Private/Faculty
exports.updateAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404));
  }

  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc      Delete attendance
// @route     DELETE /api/v1/attendance/:id
// @access    Private/Admin
exports.deleteAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404));
  }

  await attendance.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get attendance by class and date range
// @route     GET /api/v1/attendance/class/:classId
// @access    Private
exports.getAttendanceByClass = asyncHandler(async (req, res, next) => {
  let query = { class: req.params.classId };

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const attendance = await Attendance.find(query)
    .populate('subject', 'name code')
    .populate('faculty', 'firstName lastName')
    .populate('students.student', 'firstName lastName rollNumber')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc      Get student attendance report
// @route     GET /api/v1/attendance/student/:studentId
// @access    Private
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  let query = { 'students.student': req.params.studentId };

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  if (req.query.subject) {
    query.subject = req.query.subject;
  }

  const attendance = await Attendance.find(query)
    .populate('subject', 'name code')
    .populate('faculty', 'firstName lastName')
    .sort('-date');

  // Calculate attendance percentage
  let totalClasses = attendance.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  attendance.forEach(record => {
    const studentRecord = record.students.find(
      s => s.student.toString() === req.params.studentId
    );
    if (studentRecord) {
      if (studentRecord.status === 'present') presentCount++;
      else if (studentRecord.status === 'absent') absentCount++;
      else if (studentRecord.status === 'late') lateCount++;
    }
  });

  const attendancePercentage = totalClasses > 0 
    ? ((presentCount + lateCount) / totalClasses * 100).toFixed(2) 
    : 0;

  res.status(200).json({
    success: true,
    data: {
      attendance,
      summary: {
        totalClasses,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        attendancePercentage
      }
    }
  });
});

// @desc      Get my attendance (for logged in student)
// @route     GET /api/v1/attendance/my-attendance
// @access    Private/Student
exports.getMyAttendance = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ user: req.user.id });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  let query = { 'students.student': student._id };

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const attendance = await Attendance.find(query)
    .populate('subject', 'name code')
    .populate('faculty', 'firstName lastName')
    .sort('-date');

  // Calculate summary
  let totalClasses = attendance.length;
  let presentCount = 0;
  let absentCount = 0;

  attendance.forEach(record => {
    const studentRecord = record.students.find(
      s => s.student.toString() === student._id.toString()
    );
    if (studentRecord) {
      if (studentRecord.status === 'present' || studentRecord.status === 'late') {
        presentCount++;
      } else {
        absentCount++;
      }
    }
  });

  res.status(200).json({
    success: true,
    data: {
      attendance,
      summary: {
        totalClasses,
        present: presentCount,
        absent: absentCount,
        percentage: totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0
      }
    }
  });
});

// @desc      Mark faculty attendance
// @route     POST /api/v1/attendance/faculty
// @access    Private/Admin
exports.markFacultyAttendance = asyncHandler(async (req, res, next) => {
  req.body.markedBy = req.user.id;

  // Check if attendance already marked for this date
  const existingAttendance = await FacultyAttendance.findOne({
    faculty: req.body.faculty,
    date: {
      $gte: new Date(new Date(req.body.date).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(req.body.date).setHours(23, 59, 59, 999))
    }
  });

  if (existingAttendance) {
    // Update existing
    const updated = await FacultyAttendance.findByIdAndUpdate(
      existingAttendance._id,
      req.body,
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      data: updated
    });
  }

  const attendance = await FacultyAttendance.create(req.body);

  res.status(201).json({
    success: true,
    data: attendance
  });
});

// @desc      Get faculty attendance
// @route     GET /api/v1/attendance/faculty/:facultyId
// @access    Private
exports.getFacultyAttendance = asyncHandler(async (req, res, next) => {
  let query = { faculty: req.params.facultyId };

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const attendance = await FacultyAttendance.find(query)
    .populate('faculty', 'firstName lastName employeeId')
    .sort('-date');

  // Calculate summary
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const absentDays = attendance.filter(a => a.status === 'absent').length;
  const halfDays = attendance.filter(a => a.status === 'half-day').length;
  const onLeaveDays = attendance.filter(a => a.status === 'on-leave').length;

  res.status(200).json({
    success: true,
    data: {
      attendance,
      summary: {
        totalDays,
        present: presentDays,
        absent: absentDays,
        halfDay: halfDays,
        onLeave: onLeaveDays,
        percentage: totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0
      }
    }
  });
});

// @desc      Get attendance statistics
// @route     GET /api/v1/attendance/stats
// @access    Private/Admin
exports.getAttendanceStats = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAttendance = await Attendance.find({
    date: { $gte: today }
  });

  let totalStudentsMarked = 0;
  let totalPresent = 0;
  let totalAbsent = 0;

  todayAttendance.forEach(record => {
    totalStudentsMarked += record.students.length;
    totalPresent += record.totalPresent;
    totalAbsent += record.totalAbsent;
  });

  // Monthly statistics
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyAttendance = await Attendance.find({
    date: { $gte: startOfMonth }
  });

  res.status(200).json({
    success: true,
    data: {
      today: {
        classesMarked: todayAttendance.length,
        totalStudentsMarked,
        present: totalPresent,
        absent: totalAbsent
      },
      monthly: {
        totalRecords: monthlyAttendance.length
      }
    }
  });
});
