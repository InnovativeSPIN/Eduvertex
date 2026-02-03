const mongoose = require('mongoose');

const LeaveBalanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['faculty', 'student'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  casual: {
    total: { type: Number, default: 12 },
    used: { type: Number, default: 0 },
    balance: { type: Number, default: 12 }
  },
  sick: {
    total: { type: Number, default: 10 },
    used: { type: Number, default: 0 },
    balance: { type: Number, default: 10 }
  },
  earned: {
    total: { type: Number, default: 15 },
    used: { type: Number, default: 0 },
    balance: { type: Number, default: 15 }
  },
  maternity: {
    total: { type: Number, default: 180 },
    used: { type: Number, default: 0 },
    balance: { type: Number, default: 180 }
  },
  paternity: {
    total: { type: Number, default: 15 },
    used: { type: Number, default: 0 },
    balance: { type: Number, default: 15 }
  },
  study: {
    total: { type: Number, default: 30 },
    used: { type: Number, default: 0 },
    balance: { type: Number, default: 30 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
LeaveBalanceSchema.index({ user: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('LeaveBalance', LeaveBalanceSchema);
