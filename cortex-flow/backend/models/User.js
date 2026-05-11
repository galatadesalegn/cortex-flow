import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin', 'editor', 'viewer'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  permissions: {
    dashboard: { type: Boolean, default: false },
    projects: { type: Boolean, default: false },
    experience: { type: Boolean, default: false },
    education: { type: Boolean, default: false },
    skills: { type: Boolean, default: false },
    certificates: { type: Boolean, default: false },
    services: { type: Boolean, default: false },
    messages: { type: Boolean, default: false },
    testimonials: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
    manageAdmins: { type: Boolean, default: false }
  },
  lastActive: {
    type: Date,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  // Password reset fields
  resetOTP: {
    type: String,
    default: null
  },
  resetOTPExpires: {
    type: Date,
    default: null
  },
  // Invitation tracking
  invitationSent: {
    type: Boolean,
    default: false
  },
  invitationSentAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active
userSchema.methods.updateLastActive = async function () {
  this.lastActive = new Date();
  return await this.save();
};

// Get permissions based on role
userSchema.methods.getPermissions = function () {
  if (this.role === 'super_admin') {
    return {
      dashboard: true,
      projects: true,
      experience: true,
      education: true,
      skills: true,
      certificates: true,
      services: true,
      messages: true,
      testimonials: true,
      settings: true,
      manageAdmins: true
    };
  }
  return this.permissions;
};

// Generate OTP for password reset
userSchema.methods.generateOTP = function () {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOTP = otp;
  // OTP expires in 10 minutes
  this.resetOTPExpires = Date.now() + 10 * 60 * 1000;
  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (otp) {
  if (this.resetOTP !== otp) return false;
  if (Date.now() > this.resetOTPExpires) return false;
  return true;
};

// Clear OTP
userSchema.methods.clearOTP = function () {
  this.resetOTP = null;
  this.resetOTPExpires = null;
};

const User = mongoose.model('User', userSchema);

export default User;
