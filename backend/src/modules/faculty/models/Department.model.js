const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add department name'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add department code'],
    unique: true,
    uppercase: true
  },
  description: {
    type: String
  },
  head: {
    type: mongoose.Schema.ObjectId,
    ref: 'Faculty'
  },
  establishedYear: {
    type: Number
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

module.exports = mongoose.model('Department', DepartmentSchema);
