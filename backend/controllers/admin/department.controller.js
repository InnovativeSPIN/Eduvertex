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
    const departments = await Department.findAll({
        order: [['name', 'ASC']]
    });

    // Fetch counts and HOD for each department
    const departmentsWithInfo = await Promise.all(departments.map(async (dept) => {
        const hod = await User.findOne({
            where: {
                role: 'department-admin',
                departmentCode: dept.code
            },
            attributes: ['name', 'email']
        });

        const facultyCount = await Faculty.count({ where: { departmentId: dept.id } });
        const studentCount = await Student.count({ where: { departmentId: dept.id } });

        return {
            ...dept.toJSON(),
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
    const department = await Department.findByPk(req.params.id);

    if (!department) {
        return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
    }

    const hod = await User.findOne({
        where: {
            role: 'department-admin',
            departmentCode: department.code
        },
        attributes: ['name', 'email']
    });

    const facultyCount = await Faculty.count({ where: { departmentId: department.id } });
    const studentCount = await Student.count({ where: { departmentId: department.id } });

    res.status(200).json({
        success: true,
        data: {
            ...department.toJSON(),
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
    await Department.update(req.body, { where: { id: req.params.id } });
    const department = await Department.findByPk(req.params.id);

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
    const department = await Department.findByPk(req.params.id);

    if (!department) {
        return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
    }

    await department.destroy();

    res.status(200).json({
        success: true,
        data: {}
    });
});
