const mongoose = require('mongoose');

const FacultyAttendanceSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: 'Faculty',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'on-leave', 'holiday'],
    default: 'absent'
  },
  workingHours: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String
  },
  markedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate working hours before saving
FacultyAttendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const diffTime = Math.abs(this.checkOut - this.checkIn);
    this.workingHours = diffTime / (1000 * 60 * 60); // hours
  }
  next();
});

// Index for efficient queries
FacultyAttendanceSchema.index({ faculty: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('FacultyAttendance', FacultyAttendanceSchema);
