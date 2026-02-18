import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Subject = sequelize.define('Subject', {
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
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('theory', 'practical', 'both'),
    defaultValue: 'theory'
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  syllabus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'subjects',
  timestamps: true
});

export default Subject;
