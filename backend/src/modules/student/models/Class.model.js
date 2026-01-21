const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add class name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add class code'],
    unique: true
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
    required: true
  },
  semester: {
    type: Number,
    required: [true, 'Please add semester']
  },
  section: {
    type: String,
    default: 'A'
  },
  academicYear: {
    type: String,
    required: [true, 'Please add academic year']
  },
  classTeacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'Faculty'
  },
  maxStudents: {
    type: Number,
    default: 60
  },
  room: {
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

module.exports = mongoose.model('Class', ClassSchema);
