import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const PeriodConfig = sequelize.define('PeriodConfig', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  periods: {
    type: DataTypes.JSON,
    allowNull: false
  },
  workingDays: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'period_configs',
  timestamps: true
});

export default PeriodConfig;
