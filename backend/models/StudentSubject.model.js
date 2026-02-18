import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentSubject = sequelize.define('StudentSubject', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'student_subjects',
  timestamps: false
});

export default StudentSubject;
