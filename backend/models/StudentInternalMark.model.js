import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentInternalMark = sequelize.define('StudentInternalMark', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → students.id'
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → subjects.id'
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 12 }
    },
    academicYear: {
        type: DataTypes.STRING(9),
        allowNull: false,
        comment: 'e.g. 2023-2024'
    },
    internalNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 2 },
        comment: '1 = Internal 1, 2 = Internal 2'
    },
    internalScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0, max: 60 },
        comment: 'Internal test score out of 60'
    },
    assessmentScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0, max: 40 },
        comment: 'Assessment/assignment score out of 40'
    },
    totalScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    },
    remarks: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'student_internal_marks',
    timestamps: true,
    indexes: [
        { fields: ['studentId', 'semester', 'internalNumber'] },
        { fields: ['subjectId', 'semester'] },
        {
            unique: true,
            fields: ['studentId', 'subjectId', 'semester', 'academicYear', 'internalNumber']
        }
    ]
});

StudentInternalMark.beforeSave((record) => {
    if (record.internalScore !== null && record.assessmentScore !== null) {
        record.totalScore = parseFloat(record.internalScore) + parseFloat(record.assessmentScore);
    }
});

export default StudentInternalMark;
