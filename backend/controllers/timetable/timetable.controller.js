import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import Timetable from '../../models/Timetable.model.js';
import PeriodConfig from '../../models/PeriodConfig.model.js';
import Faculty from '../../models/Faculty.model.js';
import Student from '../../models/Student.model.js';

// @desc      Get all timetables
// @route     GET /api/v1/timetable
// @access    Private
export const getAllTimetables = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let query = {};

  if (req.query.department) {
    query.department = req.query.department;
  }

  if (req.query.class) {
    query.class = req.query.class;
  }

  if (req.query.semester) {
    query.semester = parseInt(req.query.semester);
  }

  if (req.query.academicYear) {
    query.academicYear = req.query.academicYear;
  }

  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  const total = await Timetable.countDocuments(query);
  const timetables = await Timetable.find(query)
    .populate('class', 'name section')
    .populate('department', 'name code')
    .populate('slots.subject', 'name code')
    .populate('slots.faculty', 'firstName lastName employeeId')
    .populate('createdBy', 'name')
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: timetables.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: timetables
  });
});

// @desc      Get single timetable
// @route     GET /api/v1/timetable/:id
// @access    Private
export const getTimetable = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findById(req.params.id)
    .populate('class', 'name section room')
    .populate('department', 'name code')
    .populate('slots.subject', 'name code credits type')
    .populate('slots.faculty', 'firstName lastName employeeId email')
    .populate('createdBy', 'name');

  if (!timetable) {
    return next(new ErrorResponse(`Timetable not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc      Get timetable by class
// @route     GET /api/v1/timetable/class/:classId
// @access    Private
export const getTimetableByClass = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findOne({
    class: req.params.classId,
    isActive: true
  })
    .populate('class', 'name section room')
    .populate('department', 'name code')
    .populate('slots.subject', 'name code')
    .populate('slots.faculty', 'firstName lastName');

  if (!timetable) {
    return next(new ErrorResponse('No active timetable found for this class', 404));
  }

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc      Get timetable for faculty
// @route     GET /api/v1/timetable/faculty/:facultyId
// @access    Private
export const getTimetableByFaculty = asyncHandler(async (req, res, next) => {
  const timetables = await Timetable.find({
    'slots.faculty': req.params.facultyId,
    isActive: true
  })
    .populate('class', 'name section')
    .populate('department', 'name code')
    .populate('slots.subject', 'name code')
    .populate('slots.faculty', 'firstName lastName');

  // Extract only the slots for this faculty
  const facultySchedule = [];
  timetables.forEach(tt => {
    const relevantSlots = tt.slots.filter(
      slot => slot.faculty && slot.faculty._id.toString() === req.params.facultyId
    );
    relevantSlots.forEach(slot => {
      facultySchedule.push({
        ...slot.toObject(),
        class: tt.class,
        department: tt.department
      });
    });
  });

  res.status(200).json({
    success: true,
    count: facultySchedule.length,
    data: facultySchedule
  });
});

// @desc      Create timetable
// @route     POST /api/v1/timetable
// @access    Private/Admin
export const createTimetable = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  // Deactivate existing timetable for the same class
  await Timetable.updateMany(
    { class: req.body.class, isActive: true },
    { isActive: false }
  );

  const timetable = await Timetable.create(req.body);

  res.status(201).json({
    success: true,
    data: timetable
  });
});

// @desc      Update timetable
// @route     PUT /api/v1/timetable/:id
// @access    Private/Admin
export const updateTimetable = asyncHandler(async (req, res, next) => {
  let timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return next(new ErrorResponse(`Timetable not found with id of ${req.params.id}`, 404));
  }

  timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc      Delete timetable
// @route     DELETE /api/v1/timetable/:id
// @access    Private/Admin
export const deleteTimetable = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return next(new ErrorResponse(`Timetable not found with id of ${req.params.id}`, 404));
  }

  await timetable.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Add slot to timetable
// @route     POST /api/v1/timetable/:id/slots
// @access    Private/Admin
export const addSlot = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return next(new ErrorResponse(`Timetable not found with id of ${req.params.id}`, 404));
  }

  // Check for conflicts
  const existingSlot = timetable.slots.find(
    slot => slot.day === req.body.day && slot.period === req.body.period
  );

  if (existingSlot) {
    return next(new ErrorResponse('A slot already exists for this day and period', 400));
  }

  timetable.slots.push(req.body);
  await timetable.save();

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc      Update slot in timetable
// @route     PUT /api/v1/timetable/:id/slots/:slotId
// @access    Private/Admin
export const updateSlot = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return next(new ErrorResponse(`Timetable not found with id of ${req.params.id}`, 404));
  }

  const slotIndex = timetable.slots.findIndex(
    slot => slot._id.toString() === req.params.slotId
  );

  if (slotIndex === -1) {
    return next(new ErrorResponse('Slot not found', 404));
  }

  timetable.slots[slotIndex] = { ...timetable.slots[slotIndex].toObject(), ...req.body };
  await timetable.save();

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc      Remove slot from timetable
// @route     DELETE /api/v1/timetable/:id/slots/:slotId
// @access    Private/Admin
export const removeSlot = asyncHandler(async (req, res, next) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return next(new ErrorResponse(`Timetable not found with id of ${req.params.id}`, 404));
  }

  timetable.slots = timetable.slots.filter(
    slot => slot._id.toString() !== req.params.slotId
  );

  await timetable.save();

  res.status(200).json({
    success: true,
    data: timetable
  });
});

// @desc      Get period configurations
// @route     GET /api/v1/timetable/config/periods
// @access    Private
export const getPeriodConfigs = asyncHandler(async (req, res, next) => {
  const configs = await PeriodConfig.find({ isActive: true });

  res.status(200).json({
    success: true,
    count: configs.length,
    data: configs
  });
});

// @desc      Create period configuration
// @route     POST /api/v1/timetable/config/periods
// @access    Private/Admin
export const createPeriodConfig = asyncHandler(async (req, res, next) => {
  // If this is set as default, remove default from others
  if (req.body.isDefault) {
    await PeriodConfig.updateMany({}, { isDefault: false });
  }

  const config = await PeriodConfig.create(req.body);

  res.status(201).json({
    success: true,
    data: config
  });
});

// @desc      Get today's schedule for logged in user
// @route     GET /api/v1/timetable/today
// @access    Private
export const getTodaySchedule = asyncHandler(async (req, res, next) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  let schedule = [];

  if (req.user.role === 'faculty') {
    // Get faculty's schedule for today
    const faculty = await Faculty.findOne({ user: req.user.id });

    if (faculty) {
      const timetables = await Timetable.find({
        'slots.faculty': faculty._id,
        isActive: true
      })
        .populate('class', 'name section')
        .populate('slots.subject', 'name code');

      timetables.forEach(tt => {
        const todaySlots = tt.slots.filter(
          slot => slot.day === today && slot.faculty?.toString() === faculty._id.toString()
        );
        todaySlots.forEach(slot => {
          schedule.push({
            ...slot.toObject(),
            class: tt.class
          });
        });
      });
    }
  } else if (req.user.role === 'student') {
    // Get student's class schedule for today
    const student = await Student.findOne({ user: req.user.id });

    if (student && student.class) {
      const timetable = await Timetable.findOne({
        class: student.class,
        isActive: true
      })
        .populate('slots.subject', 'name code')
        .populate('slots.faculty', 'firstName lastName');

      if (timetable) {
        schedule = timetable.slots.filter(slot => slot.day === today);
      }
    }
  }

  // Sort by period number
  schedule.sort((a, b) => a.period - b.period);

  res.status(200).json({
    success: true,
    day: today,
    count: schedule.length,
    data: schedule
  });
});
