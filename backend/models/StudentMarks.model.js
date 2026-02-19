import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentMarks = sequelize.define('StudentMarks', {
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
    internalMarks: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0, max: 50 },
        comment: 'Internal marks out of 50'
    },
    externalMarks: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0, max: 50 },
        comment: 'External exam marks out of 50'
    },
    totalMarks: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    },
    grade: {
        type: DataTypes.ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'),
        allowNull: true
    },
    gradePoints: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        validate: { min: 0, max: 10 }
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4
    },
    status: {
        type: DataTypes.ENUM('pass', 'fail', 'absent', 'withheld', 'pending'),
        defaultValue: 'pending'
    },
    remarks: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'student_marks',
    timestamps: true,
    indexes: [
        { fields: ['studentId', 'semester'] },
        { fields: ['subjectId', 'semester'] },
        { unique: true, fields: ['studentId', 'subjectId', 'semester', 'academicYear'] }
    ]
});

StudentMarks.beforeSave((record) => {
    if (record.internalMarks !== null && record.externalMarks !== null) {
        record.totalMarks = parseFloat(record.internalMarks) + parseFloat(record.externalMarks);
    }

    const gradeScale = [
        { min: 91, grade: 'A+', points: 10 },
        { min: 81, grade: 'A', points: 9 },
        { min: 76, grade: 'A-', points: 8.5 },
        { min: 71, grade: 'B+', points: 8 },
        { min: 61, grade: 'B', points: 7 },
        { min: 56, grade: 'B-', points: 6.5 },
        { min: 51, grade: 'C+', points: 6 },
        { min: 46, grade: 'C', points: 5 },
        { min: 41, grade: 'C-', points: 4.5 },
        { min: 35, grade: 'D', points: 4 },
        { min: 0, grade: 'F', points: 0 },
    ];

    if (record.totalMarks !== null) {
        const match = gradeScale.find(g => record.totalMarks >= g.min);
        if (match) {
            record.grade = match.grade;
            record.gradePoints = match.points;
            record.status = match.grade === 'F' ? 'fail' : 'pass';
        }
    }
});

export default StudentMarks;
