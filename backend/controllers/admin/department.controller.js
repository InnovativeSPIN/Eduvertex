import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import Department from '../../models/Department.model.js';
import User from '../../models/User.model.js';

import Faculty from '../../models/Faculty.model.js';
import Student from '../../models/Student.model.js';

// @desc      Get all departments
// @route     GET /api/v1/departments
// @access    Private/Admin
export const getDepartments = asyncHandler(async (req, res, next) => {
    const departments = await Department.find().sort('name').lean();

    // Fetch counts and HOD for each department
    const departmentsWithInfo = await Promise.all(departments.map(async (dept) => {
        const hod = await User.findOne({
            role: 'department-admin',
            departmentCode: dept.code
        }).select('name email');

        const facultyCount = await Faculty.countDocuments({ department: dept._id });
        const studentCount = await Student.countDocuments({ department: dept._id });

        return {
            ...dept,
            headOfDepartment: hod ? hod.name : 'Not Assigned',
            hodCount: hod ? 1 : 0,
            facultyCount: facultyCount,
            studentCount: studentCount
        };
    }));

    res.status(200).json({
        success: true,
        count: departmentsWithInfo.length,
        data: departmentsWithInfo
    });
});

// @desc      Get single department
// @route     GET /api/v1/departments/:id
// @access    Private/Admin
export const getDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.findById(req.params.id).lean();

    if (!department) {
        return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
    }

    const hod = await User.findOne({
        role: 'department-admin',
        departmentCode: department.code
    }).select('name email');

    const facultyCount = await Faculty.countDocuments({ department: department._id });
    const studentCount = await Student.countDocuments({ department: department._id });

    res.status(200).json({
        success: true,
        data: {
            ...department,
            headOfDepartment: hod ? hod.name : 'Not Assigned',
            hodCount: hod ? 1 : 0,
            facultyCount: facultyCount,
            studentCount: studentCount
        }
    });
});

// @desc      Create department
// @route     POST /api/v1/departments
// @access    Private/Admin
export const createDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.create(req.body);

    res.status(201).json({
        success: true,
        data: department
    });
});

// @desc      Update department
// @route     PUT /api/v1/departments/:id
// @access    Private/Admin
export const updateDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!department) {
        return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: department
    });
});

// @desc      Delete department
// @route     DELETE /api/v1/departments/:id
// @access    Private/Admin
export const deleteDepartment = asyncHandler(async (req, res, next) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
        return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
    }

    await department.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
