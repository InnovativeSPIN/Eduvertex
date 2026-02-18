import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AttendanceStudent = sequelize.define('AttendanceStudent', {
  attendanceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    defaultValue: 'absent'
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'attendance_students',
  timestamps: false
});

export default AttendanceStudent;
