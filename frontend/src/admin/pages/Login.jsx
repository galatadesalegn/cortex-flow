import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Zap, Sparkles, AlertCircle, Fingerprint, Terminal, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuth, useTheme } from '../hooks';
import api from '../services/api';

const Login = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const { login, error, clearError, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user tried to visit before being redirected to login
  // Default to /admin/dashboard after successful login
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔍 Login: isAuthenticated changed:', isAuthenticated, 'from:', from);
    if (isAuthenticated) {
      console.log('🔍 Login: Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) clearError();
  }, [email, password, error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) return;
    
    console.log('🔍 Login: Submitting login form');
    const result = await login(email, password);
    console.log('🔍 Login: Login result:', result);
    
    if (result.success) {
      console.log('🔍 Login: Login successful, navigating to:', from);
      navigate(from, { replace: true });
    } else {
      console.log('🔍 Login: Login failed');
    }
  };

  // Handle forgot password - Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Please enter your email address');
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError('');
      const response = await api.post('/auth/forgot-password', { email: forgotEmail });
      
      if (response.data.success) {
        setForgotSuccess('OTP sent to your email address');
        setForgotStep(2);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle forgot password - Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setForgotError('Please enter the OTP');
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError('');
      const response = await api.post('/auth/verify-otp', { email: forgotEmail, otp });
      
      if (response.data.success) {
        setForgotSuccess('OTP verified successfully');
        setForgotStep(3);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle forgot password - Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setForgotError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters');
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError('');
      const response = await api.post('/auth/reset-password', { 
        email: forgotEmail, 
        otp, 
        newPassword 
      });
      
      if (response.data.success) {
        setForgotSuccess('Password reset successfully! You can now log in.');
        // Reset all forgot password states
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotStep(1);
          setForgotEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setForgotSuccess('');
          setEmail(forgotEmail);
        }, 2000);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <div className={`min-h-screen w-full flex transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-[#F5F5F7]'}`}>
      {/* Left Side - Visual Showcase */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-300 ${isDark ? 'from-indigo-950 via-[#0a0a0f] to-black' : 'from-blue-100 via-white to-blue-50'}`} />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/20'}`} />
          <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] animate-pulse delay-700 ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-400/10'}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[90px] animate-pulse delay-500 ${isDark ? 'bg-purple-600/20' : 'bg-purple-400/10'}`} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${isDark ? 'bg-blue-400/40' : 'bg-blue-500/30'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Cyber grid */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-10'}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.3)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.3)'} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 h-full">
          {/* Animated Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 animate-pulse" />
              <div className={`absolute inset-[2px] rounded-xl transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-white'} flex items-center justify-center`}>
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className={`font-bold text-xl tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-theme-primary'}`}>Galata.D</span>
              <p className="text-cyan-400/80 text-xs tracking-widest uppercase">Admin Portal</p>
            </div>
          </div>

          {/* Holographic Center Visual */}
          <div className="flex-1 flex items-center justify-center translate-x-32">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-cyan-500/15 animate-[spin_25s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full border border-purple-500/10 animate-[spin_20s_linear_infinite]" />

              {/* Glowing center */}
              <div className="absolute inset-12 rounded-2xl bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-purple-600/20 backdrop-blur-md border border-blue-500/30 shadow-[0_0_60px_rgba(59,130,246,0.3)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Fingerprint className="w-32 h-32 text-cyan-400/60 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full border-2 border-cyan-400/40 animate-ping" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-[spin_15s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg shadow-blue-400/50" />
                </div>
              </div>
              <div className="absolute inset-0 animate-[spin_12s_linear_infinite_reverse]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg shadow-purple-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature tags */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, text: 'AI-Powered Dashboard', color: 'purple' },
              { icon: Terminal, text: 'Secure API Access', color: 'blue' },
              { icon: Shield, text: 'Military-Grade Encryption', color: 'cyan' }
            ].map((feature, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/50 border-blue-100 hover:bg-white/80'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center`}>
                  <feature.icon className={`w-4 h-4 text-${feature.color}-400`} />
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-white/90' : 'text-theme-primary'}`}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-300 ${isDark ? 'from-gray-900 via-[#0a0a0f] to-black' : 'from-gray-50 via-white to-gray-100'}`} />
        
        {/* Subtle grid */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-10' : 'opacity-5'}`}
          style={{
            backgroundImage: `linear-gradient(${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px),
                              linear-gradient(90deg, ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Header with gradient text */}
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-medium">System Online</span>
            </div>
            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r transition-colors duration-300 ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
              Welcome Back
            </h1>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-theme-secondary'}`}>Sign in to access your admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Glassmorphism Login Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />

            <div className={`relative backdrop-blur-2xl border rounded-2xl px-6 md:px-8 py-12 md:py-16 transition-all duration-500 ${
              isDark ? 'bg-[#12121a]/90 border-gray-800 hover:border-gray-700/50' : 'bg-white/90 border-blue-100 hover:border-blue-200'
            }`}>
              {!showForgotPassword ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field - Floating Label */}
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'email' || email ? 'text-blue-400' : 'text-gray-500'}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    placeholder="Email"
                    required
                  />
                  <label className={`absolute transition-all duration-300 pointer-events-none
                    ${focusedField === 'email' || email 
                      ? '-top-2.5 left-3 text-xs text-blue-400 bg-[#12121a] px-2' 
                      : 'top-4 left-12 text-gray-500 text-sm'}`}>
                    Email Address
                  </label>
                </div>

                {/* Password Field - Floating Label */}
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'password' || password ? 'text-blue-400' : 'text-gray-500'}`}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-12 py-4 text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    placeholder="Password"
                    required
                  />
                  <label className={`absolute transition-all duration-300 pointer-events-none
                    ${focusedField === 'password' || password 
                      ? '-top-2.5 left-3 text-xs text-blue-400 bg-[#12121a] px-2' 
                      : 'top-4 left-12 text-gray-500 text-sm'}`}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border transition-all ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-gray-600 bg-gray-800/50 group-hover:border-gray-500'}`}>
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button with 3D hover */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-[1px] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl px-6 py-3.5 transition-all duration-300 group-hover:from-blue-500 group-hover:to-cyan-400">
                  <span className="relative z-10 text-white font-medium flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Zap className="w-4 h-4 animate-pulse" />
                        Authenticating...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </div>
              </button>

              </form>
              ) : (
              /* Forgot Password Flow */
              <div className="space-y-6">
                {/* Back button */}
                <button
                  onClick={resetForgotPassword}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        step <= forgotStep ? 'bg-cyan-500' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Step 1: Email */}
                {forgotStep === 1 && (
                  <form onSubmit={handleSendOTP} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                        <Mail className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Reset Password</h3>
                      <p className="text-gray-400 text-sm mt-1">Enter your email to receive an OTP</p>
                    </div>

                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {forgotError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-400 text-sm">{forgotError}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl px-6 py-4 text-white font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Verify OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Enter OTP</h3>
                      <p className="text-gray-400 text-sm mt-1">Enter the 6-digit code sent to {forgotEmail}</p>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>

                    {forgotError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-400 text-sm">{forgotError}</p>
                      </div>
                    )}

                    {forgotSuccess && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-green-400 text-sm">{forgotSuccess}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl px-6 py-4 text-white font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                  </form>
                )}

                {/* Step 3: New Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Set New Password</h3>
                      <p className="text-gray-400 text-sm mt-1">Create a strong password for your account</p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                          placeholder="New password"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                          placeholder="Confirm password"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>

                    {forgotError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-400 text-sm">{forgotError}</p>
                      </div>
                    )}

                    {forgotSuccess && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-green-400 text-sm">{forgotSuccess}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl px-6 py-4 text-white font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Resetting...
                        </span>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </form>
                )}
              </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-500 text-sm">
              © 2024 Galata.D. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <button className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
