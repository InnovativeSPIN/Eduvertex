import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const StudentSport = sequelize.define('StudentSport', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK → students.id'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Sport name e.g. Football, Basketball'
    },
    category: {
        type: DataTypes.ENUM('Team Sports', 'Individual Sports', 'Aquatics', 'Combat Sports', 'Other'),
        allowNull: false,
        defaultValue: 'Other'
    },
    joinedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    achievements: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'e.g. Winner, Runner-up, Participation'
    },
    level: {
        type: DataTypes.ENUM('college', 'district', 'state', 'national', 'international'),
        defaultValue: 'college',
        allowNull: false
    },
    documentUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Certificate/proof URL'
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
    tableName: 'student_sports',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
        { fields: ['studentId', 'status'] },
        { fields: ['studentId', 'approvalStatus'] }
    ]
});

export default StudentSport;
