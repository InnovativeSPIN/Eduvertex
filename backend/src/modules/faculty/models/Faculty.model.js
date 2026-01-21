const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: [true, 'Please add employee ID'],
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'Please add first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  alternatePhone: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
    required: true
  },
  designation: {
    type: String,
    required: [true, 'Please add designation'],
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Lab Assistant', 'HOD']
  },
  qualification: {
    type: String,
    required: [true, 'Please add qualification']
  },
  specialization: {
    type: String
  },
  experience: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    basic: { type: Number },
    allowances: { type: Number },
    deductions: { type: Number }
  },
  subjects: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Subject'
  }],
  assignedClasses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Class'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave', 'resigned'],
    default: 'active'
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountHolderName: String
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
FacultySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for full name
FacultySchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Faculty', FacultySchema);
