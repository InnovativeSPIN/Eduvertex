import { DataTypes } from 'sequelize';

const StudentMarks = (sequelize) => {
    const StudentMarksModel = sequelize.define('StudentMarks', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        studentId: { type: DataTypes.INTEGER, allowNull: false },
        subjectId: { type: DataTypes.INTEGER, allowNull: false },
        semester: { type: DataTypes.INTEGER, allowNull: false },
        academicYear: { type: DataTypes.STRING(9), allowNull: false },
        internalMarks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
        externalMarks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
        totalMarks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
        grade: {
            type: DataTypes.ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'),
            allowNull: true,
        },
        gradePoints: { type: DataTypes.DECIMAL(4, 2), allowNull: true },
        credits: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 },
        status: {
            type: DataTypes.ENUM('pass', 'fail', 'absent', 'withheld', 'pending'),
            defaultValue: 'pending',
        },
        remarks: { type: DataTypes.STRING(255), allowNull: true },
    }, {
        tableName: 'student_marks',
        timestamps: true,
    });

    StudentMarksModel.associate = (models) => {
        StudentMarksModel.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
        StudentMarksModel.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    };

    return StudentMarksModel;
};

export default StudentMarks;
