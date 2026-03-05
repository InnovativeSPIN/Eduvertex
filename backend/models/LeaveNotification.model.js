import { DataTypes } from 'sequelize';

const LeaveNotification = (sequelize) => {
  const LeaveNotificationModel = sequelize.define('LeaveNotification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // Who receives this notification
    recipientId: { type: DataTypes.INTEGER, allowNull: true },
    recipientType: {
      type: DataTypes.ENUM('faculty', 'department-admin', 'executiveadmin'),
      allowNull: false,
    },
    // Used to filter dept-admin notifications by department
    departmentId: { type: DataTypes.INTEGER, allowNull: true },
    // Who triggered this notification
    senderId: { type: DataTypes.INTEGER, allowNull: true },
    senderName: { type: DataTypes.STRING(150), allowNull: true },
    // Leave reference
    leaveId: { type: DataTypes.INTEGER, allowNull: false },
    facultyName: { type: DataTypes.STRING(150), allowNull: true },
    leaveType: { type: DataTypes.STRING(50), allowNull: true },
    startDate: { type: DataTypes.DATEONLY, allowNull: true },
    endDate: { type: DataTypes.DATEONLY, allowNull: true },
    // Notification content
    type: {
      type: DataTypes.ENUM('leave_submitted', 'leave_approved', 'leave_rejected'),
      allowNull: false,
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'leave_notifications',
    timestamps: true,
  });

  LeaveNotificationModel.associate = (models) => {
    LeaveNotificationModel.belongsTo(models.Leave, {
      foreignKey: 'leaveId',
      as: 'leave',
    });
  };

  return LeaveNotificationModel;
};

export default LeaveNotification;
