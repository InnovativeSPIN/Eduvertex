import { DataTypes } from 'sequelize';

const StudentInternalMark = (sequelize) => {
    const StudentInternalMarkModel = sequelize.define('StudentInternalMark', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        studentId: { type: DataTypes.INTEGER, allowNull: false },
        subjectId: { type: DataTypes.INTEGER, allowNull: false },
        semester: { type: DataTypes.INTEGER, allowNull: false },
        academicYear: { type: DataTypes.STRING(9), allowNull: false },
        internalNumber: { type: DataTypes.INTEGER, allowNull: false },
        internalScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
        assessmentScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
        totalScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
        remarks: { type: DataTypes.STRING(255), allowNull: true },
    }, {
        tableName: 'student_internal_marks',
        timestamps: true,
    });

    StudentInternalMarkModel.associate = (models) => {
        StudentInternalMarkModel.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
        StudentInternalMarkModel.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    };

    return StudentInternalMarkModel;
};

export default StudentInternalMark;
