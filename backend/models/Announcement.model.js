import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    category: {
        type: String,
        default: 'General'
    },
    targetRole: {
        type: [String],
        required: true,
        enum: [
            'all',
            'super-admin',
            'superadmin',
            'executiveadmin',
            'academicadmin',
            'exam_cell_admin',
            'placement_cell_admin',
            'research_development_admin',
            'department-admin',
            'faculty',
            'student'
        ]
    },
    department: {
        type: String, // department code
        default: null
    },
    attachments: [{
        name: String,
        url: String,
        type: String // 'image', 'pdf', 'word', etc.
    }],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    creatorRole: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Announcement', AnnouncementSchema);
