import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const FacultyAttendance = sequelize.define('FacultyAttendance', {
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'half-day', 'on-leave', 'holiday'),
    defaultValue: 'absent'
  },
  workingHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true
  },
  markedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'faculty_attendance',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['facultyId', 'date'] }
  ]
});

FacultyAttendance.beforeSave((record) => {
  if (record.checkIn && record.checkOut) {
    const diffTime = Math.abs(record.checkOut - record.checkIn);
    record.workingHours = diffTime / (1000 * 60 * 60);
  }
});

export default FacultyAttendance;
