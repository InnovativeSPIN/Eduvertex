import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  admin_name: {
    type: String
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
  role: {
    type: String,
    enum: [
      'superadmin',
      'super-admin',
      'executiveadmin',
      'academicadmin',
      'exam_cell_admin',
      'placement_cell_admin',
      'research_development_admin',
      'department-admin',
      'faculty',
      'student'
    ],
    default: 'student'
  },
  admintype: {
    type: String
  },
  admin_id: {
    type: String
  },
  password: {
    type: String,
    required: false,
    minlength: 3,
    select: false
  },
  pwd: {
    type: String,
    select: false
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  department: {
    type: String
  },
  departmentCode: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  strict: false, // Allow fields not defined in schema
  collection: 'users' // Explicitly set collection name
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Check if we have a hashed password
  if (this.password) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  // Check legacy plaintext pwd field
  if (this.pwd) {
    return enteredPassword === this.pwd;
  }
  return false;
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model('User', UserSchema);
