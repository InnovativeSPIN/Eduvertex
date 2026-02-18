import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ClassModel = sequelize.define('Class', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    defaultValue: 'A'
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classTeacherId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  room: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'classes',
  timestamps: true
});

export default ClassModel;
