import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const LeaveBalance = sequelize.define('LeaveBalance', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userType: {
    type: DataTypes.ENUM('faculty', 'student'),
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  casual: {
    type: DataTypes.JSON,
    defaultValue: { total: 12, used: 0, balance: 12 }
  },
  sick: {
    type: DataTypes.JSON,
    defaultValue: { total: 10, used: 0, balance: 10 }
  },
  earned: {
    type: DataTypes.JSON,
    defaultValue: { total: 15, used: 0, balance: 15 }
  },
  maternity: {
    type: DataTypes.JSON,
    defaultValue: { total: 180, used: 0, balance: 180 }
  },
  paternity: {
    type: DataTypes.JSON,
    defaultValue: { total: 15, used: 0, balance: 15 }
  },
  study: {
    type: DataTypes.JSON,
    defaultValue: { total: 30, used: 0, balance: 30 }
  }
}, {
  tableName: 'leave_balances',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['userId', 'academicYear'] }
  ]
});

export default LeaveBalance;
