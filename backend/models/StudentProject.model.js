import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentProject = sequelize.define('StudentProject', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → students.id'
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'e.g. Frontend Developer, Team Lead'
    },
    techStack: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of technology strings'
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Null = ongoing'
    },
    projectUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: { isUrl: true }
    },
    repoUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: { isUrl: true }
    },
    thumbnailUrl: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('in-progress', 'completed', 'planned', 'paused'),
        defaultValue: 'in-progress',
        comment: 'Matches frontend: in-progress | completed | planned'
    },
    imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Project thumbnail/screenshot URL'
    },
    approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    approvedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK → users.id'
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
    tableName: 'student_projects',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
        { fields: ['studentId', 'status'] },
        { fields: ['studentId', 'approvalStatus'] }
    ]
});

export default StudentProject;
