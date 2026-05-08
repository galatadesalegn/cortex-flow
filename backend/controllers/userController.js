import { User } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendInvitationEmail } from '../utils/emailService.js';
import { getFullImageUrl } from '../utils/image.js';
import { validateImageUrl } from '../utils/validation.js';

// @desc    Get all users/admins
// @route   GET /api/users
// @access  Private (Super Admin only)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $in: ['admin', 'super_admin', 'editor', 'viewer'] } })
    .select('-password')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Create new admin user
// @route   POST /api/users
// @access  Private (Super Admin only)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, username, password, role, permissions } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error(`User with email "${email}" already exists. Use the "Manage Admins" section to update their role instead.`);
  }

  // Check username if provided
  if (username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400);
      throw new Error('Username already taken');
    }
  }

  // Generate password if not provided
  const userPassword = password || Math.random().toString(36).slice(-8);

  const user = await User.create({
    name,
    email,
    username,
    password: userPassword,
    role: role || 'editor',
    status: 'active',
    permissions: permissions || {
      dashboard: true,
      projects: true,
      experience: true,
      skills: true,
      certificates: true,
      services: true,
      messages: false,
      settings: false,
      manageAdmins: false
    },
    lastActive: new Date()
  });

  // Send invitation email
  const adminPanelUrl = `${process.env.FRONTEND_URL || 'https://galatadesalegn.onrender.com'}/login`;
  const emailResult = await sendInvitationEmail(email, name, userPassword, adminPanelUrl);

  if (emailResult.success) {
    // Update user to mark invitation as sent
    user.invitationSent = true;
    user.invitationSentAt = new Date();
    await user.save();
  } else {
    console.error('Failed to send invitation email:', emailResult.error);
    // Don't fail the request if email fails, just log it
  }

  res.status(201).json({
    success: true,
    message: emailResult.success 
      ? 'Admin created successfully. Invitation email sent.' 
      : 'Admin created successfully. Email failed to send.',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      lastActive: user.lastActive,
      permissions: user.getPermissions(),
      invitationSent: emailResult.success
    }
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Super Admin only)
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, username, role, status, permissions } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent changing own role if super admin
  if (user._id.toString() === req.user.id && role && role !== user.role) {
    res.status(400);
    throw new Error('Cannot change your own role');
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (username) user.username = username;
  if (role) user.role = role;
  if (status) user.status = status;
  if (permissions) user.permissions = { ...user.permissions, ...permissions };

  await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username || user.email.split('@')[0],
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      lastActive: user.lastActive,
      permissions: user.getPermissions()
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Super Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent self-deletion
  if (user._id.toString() === req.user.id) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Update user permissions
// @route   PUT /api/users/:id/permissions
// @access  Private (Super Admin only)
export const updatePermissions = asyncHandler(async (req, res) => {
  const { permissions } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Super admins always have all permissions
  if (user.role === 'super_admin') {
    res.status(400);
    throw new Error('Cannot modify super admin permissions');
  }

  user.permissions = { ...user.permissions, ...permissions };
  await user.save();

  res.json({
    success: true,
    message: 'Permissions updated successfully',
    data: {
      _id: user._id,
      permissions: user.getPermissions()
    }
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});
