import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Announcement = sequelize.define('Announcement', {
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'General'
    },
    targetRole: {
        type: DataTypes.JSON,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    attachments: {
        type: DataTypes.JSON,
        allowNull: true
    },
    createdById: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creatorRole: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'announcements',
    timestamps: true
});

export default Announcement;
