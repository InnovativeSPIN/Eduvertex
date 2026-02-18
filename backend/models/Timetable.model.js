import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Timetable = sequelize.define('Timetable', {
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  effectiveFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  effectiveTo: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'timetables',
  timestamps: true,
  indexes: [
    { fields: ['classId', 'academicYear', 'isActive'] },
    { fields: ['departmentId', 'semester', 'academicYear'] }
  ]
});

export default Timetable;
