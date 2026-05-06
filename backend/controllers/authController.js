import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateRequired } from '../utils/validation.js';
import { sendOTPEmail, sendPasswordChangedEmail } from '../utils/emailService.js';

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const missing = validateRequired(['email', 'password'], req.body);
  if (missing.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  // Find user with Mongoose
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Compare password using model method
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('id email name');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  });
});

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    res.json({
      success: true,
      message: 'If an account exists with this email, an OTP has been sent'
    });
    return;
  }

  // Generate OTP
  const otp = user.generateOTP();
  await user.save();

  // Send OTP email
  const emailResult = await sendOTPEmail(email, otp);
  
  if (!emailResult.success) {
    console.error('Failed to send OTP email:', emailResult.error);
    res.status(500);
    throw new Error('Failed to send OTP email. Please try again later.');
  }

  res.json({
    success: true,
    message: 'OTP sent to your email address',
    email: email // Return email for the next step
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error('Please provide email and OTP');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Invalid request');
  }

  // Verify OTP
  const isValid = user.verifyOTP(otp);
  if (!isValid) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  res.json({
    success: true,
    message: 'OTP verified successfully',
    email: email
  });
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Invalid request');
  }

  // Verify OTP again
  const isValid = user.verifyOTP(otp);
  if (!isValid) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  // Update password
  user.password = newPassword;
  user.clearOTP();
  await user.save();

  // Send confirmation email
  await sendPasswordChangedEmail(email, user.name);

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});
