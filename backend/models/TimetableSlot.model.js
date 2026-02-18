import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const TimetableSlot = sequelize.define('TimetableSlot', {
  timetableId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: false
  },
  period: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  room: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('lecture', 'practical', 'tutorial', 'break', 'lunch', 'free'),
    defaultValue: 'lecture'
  }
}, {
  tableName: 'timetable_slots',
  timestamps: false
});

export default TimetableSlot;
