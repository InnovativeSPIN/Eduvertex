import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentNotification = sequelize.define('StudentNotification', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → students.id'
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(
            'academic',
            'leave',
            'fee',
            'general',
            'disciplinary',
            'attendance',
            'result',
            'approval',
            'announcement'
        ),
        allowNull: false,
        defaultValue: 'general'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'low'
    },
    referenceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the related DB record (e.g. leave ID, certification ID)'
    },
    referenceType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Model name of the related record e.g. Leave, StudentCertification'
    },
    actionUrl: {
        type: DataTypes.STRING(300),
        allowNull: true,
        comment: 'Frontend route to navigate on click'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Optional expiry; null = never expire'
    }
}, {
    tableName: 'student_notifications',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
        { fields: ['studentId', 'isRead'] },
        { fields: ['studentId', 'type'] },
        { fields: ['studentId', 'priority'] }
    ]
});

StudentNotification.markAsRead = async function (notificationId, studentId) {
    return StudentNotification.update(
        { isRead: true, readAt: new Date() },
        { where: { id: notificationId, studentId } }
    );
};

StudentNotification.markAllAsRead = async function (studentId) {
    return StudentNotification.update(
        { isRead: true, readAt: new Date() },
        { where: { studentId, isRead: false } }
    );
};

export default StudentNotification;
