import { DataTypes } from 'sequelize';

const StudentNotification = (sequelize) => {
    const StudentNotificationModel = sequelize.define('StudentNotification', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        studentId: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.STRING(200), allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        type: {
            type: DataTypes.ENUM('academic', 'leave', 'fee', 'general', 'disciplinary', 'attendance', 'result', 'approval', 'announcement'),
            defaultValue: 'general',
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            defaultValue: 'low',
        },
        referenceId: { type: DataTypes.INTEGER, allowNull: true },
        referenceType: { type: DataTypes.STRING(50), allowNull: true },
        actionUrl: { type: DataTypes.STRING(300), allowNull: true },
        isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
        readAt: { type: DataTypes.DATE, allowNull: true },
        expiresAt: { type: DataTypes.DATE, allowNull: true },
    }, {
        tableName: 'student_notifications',
        timestamps: true,
    });

    StudentNotificationModel.associate = (models) => {
        StudentNotificationModel.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    };

    return StudentNotificationModel;
};

export default StudentNotification;
