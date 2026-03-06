import { DataTypes } from 'sequelize';

const LeaveBalance = (sequelize) => {
  const LeaveBalanceModel = sequelize.define('LeaveBalance', {
    balance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leave_type: {
      type: DataTypes.ENUM('Medical', 'Casual', 'Earned', 'On-Duty', 'Personal', 'Maternity', 'Comp-Off'),
      allowNull: false,
    },
    total_allowed: {
      type: DataTypes.DECIMAL(5, 1),
      defaultValue: 0.0,
    },
    used_leaves: {
      type: DataTypes.DECIMAL(5, 1),
      defaultValue: 0.0,
    },
    remaining_leaves: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: true,
    },
  }, {
    tableName: 'staff_leave_balance',
    timestamps: false,
  });


  LeaveBalanceModel.associate = (models) => {
    LeaveBalanceModel.belongsTo(models.Faculty, {
      foreignKey: 'staff_id',
      as: 'staff',
    });
  };


  return LeaveBalanceModel;
};

export default LeaveBalance;