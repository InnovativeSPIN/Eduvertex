import { DataTypes } from 'sequelize';

const Room = (sequelize) => {
  const RoomModel = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    room_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room_type: {
      type: DataTypes.ENUM('classroom', 'lab', 'seminar_hall', 'auditorium'),
      allowNull: false,
      defaultValue: 'classroom',
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    floor_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    building: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    has_projector: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    has_ac: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    has_smart_board: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    equipment_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  RoomModel.associate = (models) => {
    RoomModel.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department',
    });
    RoomModel.hasMany(models.Lab, {
      foreignKey: 'room_id',
      as: 'labs',
    });
  };

  return RoomModel;
};

export default Room;
