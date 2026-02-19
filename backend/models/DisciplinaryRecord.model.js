import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const DisciplinaryRecord = sequelize.define('DisciplinaryRecord', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → students.id'
    },
    recordDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    type: {
        type: DataTypes.ENUM('warning', 'suspension', 'fine', 'counseling', 'expulsion', 'other'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Issue description'
    },
    actionTaken: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Disciplinary action that was taken'
    },
    staffRemarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Staff / faculty remarks'
    },
    issuedByFacultyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK → faculties.id'
    },
    resolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resolvedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fineAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Fine amount if type is "fine"'
    },
    finePaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of document/evidence URLs'
    }
}, {
    tableName: 'disciplinary_records',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
        { fields: ['studentId', 'resolved'] },
        { fields: ['studentId', 'recordDate'] },
        { fields: ['issuedByFacultyId'] }
    ]
});

export default DisciplinaryRecord;
