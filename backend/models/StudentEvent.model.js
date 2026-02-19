import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentEvent = sequelize.define('StudentEvent', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → students.id'
    },
    eventName: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    eventType: {
        type: DataTypes.ENUM('cultural', 'technical', 'sports', 'social', 'workshop', 'seminar', 'other'),
        allowNull: false,
        defaultValue: 'other'
    },
    organizer: {
        type: DataTypes.STRING(150),
        allowNull: true,
        comment: 'Organizing institution or club'
    },
    eventDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('participant', 'organizer', 'volunteer', 'speaker', 'judge', 'other'),
        allowNull: false,
        defaultValue: 'participant'
    },
    achievement: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: 'e.g. 1st place, Best Paper Award'
    },
    level: {
        type: DataTypes.ENUM('college', 'district', 'state', 'national', 'international'),
        defaultValue: 'college',
        allowNull: false
    },
    certificateUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL to uploaded participation/achievement certificate'
    },
    approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    approvedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK → users.id'
    },
    approvalRemarks: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    approvalDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'student_events',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
        { fields: ['studentId', 'eventType'] },
        { fields: ['studentId', 'approvalStatus'] }
    ]
});

export default StudentEvent;
