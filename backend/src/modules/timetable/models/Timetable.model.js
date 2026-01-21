const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: true
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  academicYear: {
    type: String,
    required: [true, 'Please add academic year']
  },
  effectiveFrom: {
    type: Date,
    required: [true, 'Please add effective from date']
  },
  effectiveTo: {
    type: Date
  },
  slots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    period: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    subject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subject'
    },
    faculty: {
      type: mongoose.Schema.ObjectId,
      ref: 'Faculty'
    },
    room: {
      type: String
    },
    type: {
      type: String,
      enum: ['lecture', 'practical', 'tutorial', 'break', 'lunch', 'free'],
      default: 'lecture'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
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

// Update the updatedAt field before saving
TimetableSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
TimetableSchema.index({ class: 1, academicYear: 1, isActive: 1 });
TimetableSchema.index({ department: 1, semester: 1, academicYear: 1 });

module.exports = mongoose.model('Timetable', TimetableSchema);
