const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: true
  },
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    required: true
  },
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: 'Faculty',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add attendance date'],
    default: Date.now
  },
  period: {
    type: Number,
    required: true
  },
  students: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'absent'
    },
    remarks: String
  }],
  totalPresent: {
    type: Number,
    default: 0
  },
  totalAbsent: {
    type: Number,
    default: 0
  },
  totalLate: {
    type: Number,
    default: 0
  },
  totalExcused: {
    type: Number,
    default: 0
  },
  markedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
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

// Calculate totals before saving
AttendanceSchema.pre('save', function(next) {
  this.totalPresent = this.students.filter(s => s.status === 'present').length;
  this.totalAbsent = this.students.filter(s => s.status === 'absent').length;
  this.totalLate = this.students.filter(s => s.status === 'late').length;
  this.totalExcused = this.students.filter(s => s.status === 'excused').length;
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
AttendanceSchema.index({ class: 1, date: 1 });
AttendanceSchema.index({ faculty: 1, date: 1 });
AttendanceSchema.index({ 'students.student': 1, date: 1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
