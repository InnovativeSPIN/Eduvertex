import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const FacultyClass = sequelize.define('FacultyClass', {
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'faculty_classes',
  timestamps: false
});

export default FacultyClass;
