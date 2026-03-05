import { DataTypes } from 'sequelize';

const YearBreakTiming = (sequelize) => {
  const YearBreakTimingModel = sequelize.define('YearBreakTiming', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year_group: {
      type: DataTypes.ENUM('year_1', 'year_2', 'year_3_4'),
      allowNull: true,
      comment: 'Year grouping: year_1, year_2, or year_3_4 (shared)',
    },
    year: {
      type: DataTypes.ENUM('1st', '2nd', '3rd', '4th'),
      allowNull: true,
      comment: 'Backward compatibility - use year_group instead',
    },
    break_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Break sequence number (1, 2, 3...)',
    },
    break_name: {
      type: DataTypes.STRING(100),
      allowNull: false, // e.g., "Morning Break", "Lunch Break"
    },
    break_type: {
      type: DataTypes.ENUM('short', 'lunch'),
      allowNull: true,
    },
    period_after: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Which period this break follows',
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false, // HH:MM:SS format
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false, // HH:MM:SS format
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'year_break_timings',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  YearBreakTimingModel.associate = (models) => {
    YearBreakTimingModel.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department',
    });
  };

  return YearBreakTimingModel;
};

export default YearBreakTiming;
