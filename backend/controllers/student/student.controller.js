import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import Student from '../../models/Student.model.js';
import User from '../../models/User.model.js';
import Department from '../../models/Department.model.js';
import ClassModel from '../../models/Class.model.js';
import Subject from '../../models/Subject.model.js';
import { Op, Sequelize } from 'sequelize';

// @desc      Get all students
// @route     GET /api/v1/students
// @access    Private
export const getAllStudents = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  let where = {};

  // Filter by department
  if (req.query.department) {
    where.departmentId = req.query.department;
  }

  // Filter by class
  if (req.query.class) {
    where.classId = req.query.class;
  }

  // Filter by semester
  if (req.query.semester) {
    where.semester = parseInt(req.query.semester);
  }

  // Filter by batch
  if (req.query.batch) {
    where.batch = req.query.batch;
  }

  // Filter by status
  if (req.query.status) {
    where.status = req.query.status;
  }

  // Search by name, student ID, or email
  if (req.query.search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${req.query.search}%` } },
      { lastName: { [Op.like]: `%${req.query.search}%` } },
      { studentId: { [Op.like]: `%${req.query.search}%` } },
      { email: { [Op.like]: `%${req.query.search}%` } },
      { rollNumber: { [Op.like]: `%${req.query.search}%` } }
    ];
  }

  const total = await Student.count({ where });
  const students = await Student.findAll({
    where,
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: ClassModel, as: 'class', attributes: ['name', 'section'] },
      { model: User, as: 'user', attributes: ['name', 'email'] }
    ],
    offset: startIndex,
    limit,
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: students
  });
});

// @desc      Get single student
// @route     GET /api/v1/students/:id
// @access    Private
export const getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByPk(req.params.id, {
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: ClassModel, as: 'class', attributes: ['name', 'section', 'room'] },
      { model: Subject, as: 'subjects', attributes: ['name', 'code', 'credits'] },
      { model: User, as: 'user', attributes: ['name', 'email'] }
    ]
  });

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc      Create student
// @route     POST /api/v1/students
// @access    Private/Admin
export const createStudent = asyncHandler(async (req, res, next) => {
  // Create user account first
  const userData = {
    name: `${req.body.firstName} ${req.body.lastName}`,
    email: req.body.email,
    password: req.body.password || 'student123',
    role: 'student',
    phone: req.body.phone
  };

  const user = await User.create(userData);

  // Generate student ID if not provided
  if (!req.body.studentId) {
    const department = await Department.findByPk(req.body.department);
    const departmentCode = department ? department.code : 'GEN';
    req.body.studentId = await Student.generateStudentId(req.body.batch, departmentCode);
  }

  // Create student profile
  req.body.userId = user.id;
  req.body.departmentId = req.body.department;
  req.body.classId = req.body.class;
  delete req.body.department;
  delete req.body.class;
  const student = await Student.create(req.body);

  res.status(201).json({
    success: true,
    data: student
  });
});

// @desc      Update student
// @route     PUT /api/v1/students/:id
// @access    Private/Admin
export const updateStudent = asyncHandler(async (req, res, next) => {
  let student = await Student.findByPk(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  if (req.body.department) {
    req.body.departmentId = req.body.department;
    delete req.body.department;
  }
  if (req.body.class) {
    req.body.classId = req.body.class;
    delete req.body.class;
  }
  await Student.update(req.body, { where: { id: req.params.id } });
  student = await Student.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc      Delete student
// @route     DELETE /api/v1/students/:id
// @access    Private/Admin
export const deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByPk(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  // Also delete the associated user
  await User.destroy({ where: { id: student.userId } });
  await student.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get students by class
// @route     GET /api/v1/students/class/:classId
// @access    Private
export const getStudentsByClass = asyncHandler(async (req, res, next) => {
  const students = await Student.findAll({
    where: {
      classId: req.params.classId,
      status: 'active'
    },
    include: [{ model: Department, as: 'department', attributes: ['name', 'code'] }],
    order: [['rollNumber', 'ASC']]
  });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// @desc      Get students by department
// @route     GET /api/v1/students/department/:departmentId
// @access    Private
export const getStudentsByDepartment = asyncHandler(async (req, res, next) => {
  const students = await Student.findAll({
    where: {
      departmentId: req.params.departmentId,
      status: 'active'
    },
    include: [{ model: ClassModel, as: 'class', attributes: ['name', 'section'] }],
    order: [['semester', 'ASC'], ['rollNumber', 'ASC']]
  });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// @desc      Update student status
// @route     PUT /api/v1/students/:id/status
// @access    Private/Admin
export const updateStudentStatus = asyncHandler(async (req, res, next) => {
  await Student.update(
    { status: req.body.status },
    { where: { id: req.params.id } }
  );
  const student = await Student.findByPk(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  // Update user active status
  await User.update({
    isActive: req.body.status === 'active'
  }, { where: { id: student.userId } });

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc      Promote students to next semester
// @route     PUT /api/v1/students/promote
// @access    Private/Admin
export const promoteStudents = asyncHandler(async (req, res, next) => {
  const { studentIds, newSemester, newClass } = req.body;

  const result = await Student.update(
    {
      semester: newSemester,
      classId: newClass
    },
    { where: { id: { [Op.in]: studentIds } } }
  );

  res.status(200).json({
    success: true,
    message: `${result[0]} students promoted successfully`
  });
});

// @desc      Get student profile (for logged in student)
// @route     GET /api/v1/students/me/profile
// @access    Private/Student
export const getMyProfile = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({
    where: { userId: req.user.id },
    include: [
      { model: Department, as: 'department', attributes: ['name', 'code'] },
      { model: ClassModel, as: 'class', attributes: ['name', 'section', 'room'] },
      { model: Subject, as: 'subjects', attributes: ['name', 'code', 'credits'] }
    ]
  });

  if (!student) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc      Get student statistics
// @route     GET /api/v1/students/stats
// @access    Private/Admin
export const getStudentStats = asyncHandler(async (req, res, next) => {
  const totalStudents = await Student.count();
  const activeStudents = await Student.count({ where: { status: 'active' } });
  const graduatedStudents = await Student.count({ where: { status: 'graduated' } });

  const byDepartment = await Student.findAll({
    where: { status: 'active' },
    attributes: ['departmentId', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    group: ['departmentId']
  });

  const bySemester = await Student.findAll({
    where: { status: 'active' },
    attributes: ['semester', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    group: ['semester'],
    order: [['semester', 'ASC']]
  });

  const byBatch = await Student.findAll({
    where: { status: 'active' },
    attributes: ['batch', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    group: ['batch'],
    order: [['batch', 'DESC']]
  });

  res.status(200).json({
    success: true,
    data: {
      totalStudents,
      activeStudents,
      graduatedStudents,
      byDepartment,
      bySemester,
      byBatch
    }
  });
});
