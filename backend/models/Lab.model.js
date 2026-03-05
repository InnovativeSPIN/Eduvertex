import { DataTypes } from 'sequelize';

const Lab = (sequelize) => {
  const LabModel = sequelize.define('Lab', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lab_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lab_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if not yet assigned to a physical room
    },
    subject_ids: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of subject IDs that use this lab',
    },
    max_batch_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 30,
    },
    equipment_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    software_installed: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lab_incharge_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Faculty ID who is in charge of this lab',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'labs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  LabModel.associate = (models) => {
    LabModel.belongsTo(models.Department, {
      foreignKey: 'department_id',
      as: 'department',
    });
    LabModel.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room',
    });
    LabModel.belongsTo(models.Faculty, {
      foreignKey: 'lab_incharge_id',
      as: 'incharge',
    });
  };

  return LabModel;
};

export default Lab;
