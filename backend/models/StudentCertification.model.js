import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentCertification = sequelize.define('StudentCertification', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → students.id'
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Certification name'
    },
    issuer: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Issuing organization'
    },
    issueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Null = no expiry'
    },
    credentialId: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    credentialUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: { isUrl: true }
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of skill strings'
    },
    documentUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Uploaded certificate file URL'
    },
    approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    approvedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK → users.id (faculty who approved)'
    },
    approvalRemarks: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    approvalDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'student_certifications',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
        { fields: ['studentId', 'approvalStatus'] }
    ]
});

export default StudentCertification;
