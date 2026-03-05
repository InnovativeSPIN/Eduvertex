import { DataTypes } from 'sequelize';

const TimetablePeriod = (sequelize) => {
  const TimetablePeriodModel = sequelize.define('TimetablePeriod', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timetable_master_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
      allowNull: false,
    },
    period_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Period number (1-7)',
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    is_break: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    break_type: {
      type: DataTypes.ENUM('short', 'lunch'),
      allowNull: true,
    },
    faculty_college_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    subject_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    year: {
      type: DataTypes.ENUM('1st', '2nd', '3rd', '4th'),
      allowNull: true,
    },
    section: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lab_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_lab_session: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    session_type: {
      type: DataTypes.ENUM('theory', 'lab', 'tutorial'),
      defaultValue: 'theory',
    },
  }, {
    tableName: 'timetable_periods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  TimetablePeriodModel.associate = (models) => {
    TimetablePeriodModel.belongsTo(models.TimetableMaster, {
      foreignKey: 'timetable_master_id',
      as: 'timetable_master',
    });
    TimetablePeriodModel.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room',
    });
    TimetablePeriodModel.belongsTo(models.Lab, {
      foreignKey: 'lab_id',
      as: 'lab',
    });
  };

  return TimetablePeriodModel;
};

export default TimetablePeriod;
