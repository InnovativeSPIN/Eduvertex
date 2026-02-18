import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Attendance = sequelize.define('Attendance', {
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  period: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalPresent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalAbsent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalLate: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalExcused: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  markedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  indexes: [
    { fields: ['classId', 'date'] },
    { fields: ['facultyId', 'date'] }
  ]
});

export default Attendance;
