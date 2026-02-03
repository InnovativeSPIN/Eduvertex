const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  applicantType: {
    type: String,
    enum: ['faculty', 'student'],
    required: true
  },
  applicantProfile: {
    type: mongoose.Schema.ObjectId,
    refPath: 'applicantType === "faculty" ? "Faculty" : "Student"'
  },
  leaveType: {
    type: String,
    enum: ['casual', 'sick', 'earned', 'maternity', 'paternity', 'study', 'emergency', 'other'],
    required: [true, 'Please specify leave type']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date']
  },
  totalDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please add reason for leave'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  approvalRemarks: {
    type: String
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department'
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

// Calculate total days before saving
LeaveSchema.pre('save', function(next) {
  if (this.isModified('startDate') || this.isModified('endDate')) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end - start);
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
LeaveSchema.index({ applicant: 1, startDate: 1 });
LeaveSchema.index({ status: 1, department: 1 });

module.exports = mongoose.model('Leave', LeaveSchema);
