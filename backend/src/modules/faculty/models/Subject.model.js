const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add subject name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add subject code'],
    unique: true,
    uppercase: true
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
    required: true
  },
  credits: {
    type: Number,
    required: [true, 'Please add credits']
  },
  type: {
    type: String,
    enum: ['theory', 'practical', 'both'],
    default: 'theory'
  },
  semester: {
    type: Number,
    required: [true, 'Please add semester']
  },
  description: {
    type: String
  },
  syllabus: {
    type: String
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

module.exports = mongoose.model('Subject', SubjectSchema);
