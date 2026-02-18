import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Leave = sequelize.define('Leave', {
  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  applicantType: {
    type: DataTypes.ENUM('faculty', 'student'),
    allowNull: false
  },
  leaveType: {
    type: DataTypes.ENUM('casual', 'sick', 'earned', 'maternity', 'paternity', 'study', 'emergency', 'other'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  totalDays: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    defaultValue: 'pending'
  },
  approvedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  approvalDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvalRemarks: {
    type: DataTypes.STRING,
    allowNull: true
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'leaves',
  timestamps: true,
  indexes: [
    { fields: ['applicantId', 'startDate'] },
    { fields: ['status', 'departmentId'] }
  ]
});

Leave.beforeSave((record) => {
  if (record.startDate && record.endDate) {
    const start = new Date(record.startDate);
    const end = new Date(record.endDate);
    const diffTime = Math.abs(end - start);
    record.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
});

export default Leave;
