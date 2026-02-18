import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import sendEmail from '../../utils/sendEmail.js';
import sendTokenResponse from '../../utils/sendTokenResponse.js';
import User from '../../models/User.model.js';
import { Op } from 'sequelize';

// @desc      Upload avatar
// @route     POST /api/v1/auth/avatar
// @access    Private
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `avatar_${req.user.id}${path.parse(file.name).ext}`;

  try {
    // Determine folder based on role
    let roleFolder = 'avatars';
    if (req.user.role === 'student') roleFolder = 'students';
    else if (req.user.role === 'faculty') roleFolder = 'faculty';
    else if (req.user.role === 'department-admin') roleFolder = 'department-admins';

    const dirPath = path.resolve(process.env.FILE_UPLOAD_PATH, roleFolder);

    // Create directory if not exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const uploadPath = path.resolve(dirPath, file.name);

    await file.mv(uploadPath);

    const avatarUrl = `/uploads/${roleFolder}/${file.name}`;

    await User.update({ avatar: avatarUrl }, { where: { id: req.user.id } });

    res.status(200).json({
      success: true,
      data: avatarUrl
    });
  } catch (err) {
    console.error('File Upload Error:', err);
    return next(new ErrorResponse('Problem with file upload', 500));
  }
});

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, department } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    pwd: password, // Store plaintext for legacy support
    role,
    phone,
    department
  });

  sendTokenResponse(user, 201, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Dummy login for student (development/testing without DB)
  if (email === 'student@nscet.com' && (password === 'student123' || password === 'password123')) {
    const dummyUser = User.build({
      id: 0,
      name: 'Dummy Student',
      email: 'student@nscet.com',
      role: 'student',
      isActive: true,
      department: 'Computer Science',
      year: '3rd',
      semester: '6th',
      rollNo: 'NSC21CS001'
    }, { isNewRecord: false });
    return sendTokenResponse(dummyUser, 200, res);
  }

  // Check for user
  const user = await User.findOne({
    where: { email },
    attributes: { include: ['password', 'pwd'] }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new ErrorResponse('Your account has been deactivated', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'pwd'] }
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  await User.update(fieldsToUpdate, { where: { id: req.user.id } });
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'pwd'] }
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { include: ['password', 'pwd'] }
  });

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  user.pwd = req.body.newPassword; // Update legacy field
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link to reset your password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { [Op.gt]: new Date() }
    },
    attributes: { include: ['password', 'pwd'] }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  sendTokenResponse(user, 200, res);
});
// @desc      Get admins by role
// @route     GET /api/v1/auth/admins/:role
// @access    Public
export const getAdminsByRole = asyncHandler(async (req, res, next) => {
  let { role } = req.params;

  // Handle superadmin variations
  let roles = [role];
  if (role === 'superadmin') {
    roles = ['superadmin', 'super-admin'];
  }

  const admins = await User.findAll({
    where: {
      [Op.or]: [
        { role: { [Op.in]: roles } },
        { admintype: { [Op.in]: roles } }
      ]
    },
    attributes: ['name', 'admin_name', 'email']
  });

  // Map results to ensure each has a 'name' field for the frontend
  const formattedAdmins = admins.map(admin => ({
    name: admin.name || admin.admin_name || 'Admin',
    email: admin.email
  }));

  res.status(200).json({
    success: true,
    data: formattedAdmins
  });
});
