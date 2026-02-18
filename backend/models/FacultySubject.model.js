import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const FacultySubject = sequelize.define('FacultySubject', {
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'faculty_subjects',
  timestamps: false
});

export default FacultySubject;
