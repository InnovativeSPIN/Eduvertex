const mongoose = require('mongoose');

const PeriodConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  periods: [{
    periodNumber: {
      type: Number,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    type: {
      type: String,
      enum: ['class', 'break', 'lunch'],
      default: 'class'
    }
  }],
  workingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PeriodConfig', PeriodConfigSchema);
