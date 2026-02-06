import path from 'path';
import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import Announcement from '../../models/Announcement.model.js';

// @desc      Get all announcements for user
// @route     GET /api/v1/announcements
// @access    Private
export const getAnnouncements = asyncHandler(async (req, res, next) => {
    const { role, departmentCode } = req.user;

    let query = { isActive: true };

    // If not superadmin, filter by role and department
    const superRoles = ['superadmin', 'super-admin', 'executiveadmin', 'academicadmin'];

    if (!superRoles.includes(role)) {
        query.$or = [
            { targetRole: 'all' },
            { targetRole: role }
        ];

        // If department admin, faculty or student, filter by department if announcement is department specific
        if (departmentCode) {
            query.$and = [
                {
                    $or: [
                        { department: null },
                        { department: departmentCode }
                    ]
                }
            ];
        }
    }

    const announcements = await Announcement.find(query)
        .populate('createdBy', 'name avatar')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements
    });
});

// @desc      Get all announcements (Admin view)
// @route     GET /api/v1/announcements/admin
// @access    Private/Admin
export const getAdminAnnouncements = asyncHandler(async (req, res, next) => {
    const announcements = await Announcement.find()
        .populate('createdBy', 'name avatar')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements
    });
});

// @desc      Create announcement
// @route     POST /api/v1/announcements
// @access    Private/Admin
export const createAnnouncement = asyncHandler(async (req, res, next) => {
    req.body.createdBy = req.user.id;
    req.body.creatorRole = req.user.role;

    // Set department if created by HOD
    if (req.user.role === 'department-admin') {
        req.body.department = req.user.departmentCode;
    }

    // Handle attachments
    let attachments = [];
    if (req.files && req.files.files) {
        let files = req.files.files;
        if (!Array.isArray(files)) {
            files = [files];
        }

        for (const file of files) {
            const ext = path.parse(file.name).ext;
            const fileName = `announcement_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
            const uploadPath = path.resolve(process.env.FILE_UPLOAD_PATH, 'announcements', fileName);

            await file.mv(uploadPath);

            attachments.push({
                name: file.name,
                url: `/uploads/announcements/${fileName}`,
                type: file.mimetype.split('/')[1]
            });
        }
    }

    req.body.attachments = attachments;

    // Parse targetRole if it's a string (from FormData)
    if (typeof req.body.targetRole === 'string') {
        req.body.targetRole = req.body.targetRole.split(',');
    }

    const announcement = await Announcement.create(req.body);

    res.status(201).json({
        success: true,
        data: announcement
    });
});

// @desc      Delete announcement
// @route     DELETE /api/v1/announcements/:id
// @access    Private/Admin
export const deleteAnnouncement = asyncHandler(async (req, res, next) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
    }

    // Check ownership if not superadmin
    const superRoles = ['superadmin', 'super-admin'];
    if (!superRoles.includes(req.user.role) && announcement.createdBy.toString() !== req.user.id) {
        return next(new ErrorResponse(`User not authorized to delete this announcement`, 401));
    }

    await announcement.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
