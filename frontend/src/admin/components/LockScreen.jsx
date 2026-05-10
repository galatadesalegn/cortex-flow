import { useState, useEffect } from 'react';
import { Lock, Unlock, Shield, Clock, Activity } from 'lucide-react';
import { useAuth } from '../hooks';

const LockScreen = ({ onUnlock, timeRemaining, isDark }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnlocking(true);

    // Simple password check - in production, verify against stored password
    // For now, we'll accept any non-empty password or check against a simple pattern
    if (password.length < 1) {
      setError('Please enter your password');
      setIsUnlocking(false);
      return;
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if password matches (you can customize this logic)
    // For demo purposes, accepting "admin123" or any 6+ char password
    if (password === 'admin123' || password.length >= 6) {
      onUnlock();
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
    }

    setIsUnlocking(false);
  };

  // Calculate inactive time
  const inactiveMinutes = Math.floor((5 * 60 * 1000 - timeRemaining) / 60000);
  const inactiveSeconds = Math.floor(((5 * 60 * 1000 - timeRemaining) % 60000) / 1000);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]' 
        : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-80 h-80 rounded-full blur-[100px] animate-pulse ${
          isDark ? 'bg-cyan-500/20' : 'bg-cyan-400/20'
        }`} />
        <div className={`absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-[100px] animate-pulse delay-1000 ${
          isDark ? 'bg-emerald-500/20' : 'bg-emerald-400/20'
        }`} />
      </div>

      {/* Main Card */}
      <div className={`relative w-full max-w-md mx-4 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${
        isDark 
          ? 'bg-[#12121a]/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        {/* Header */}
        <div className={`p-6 text-center border-b ${
          isDark ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
            isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'
          }`}>
            <Lock size={28} className={isDark ? 'text-cyan-400' : 'text-cyan-600'} />
          </div>
          <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Session Locked
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Admin panel secured due to inactivity
          </p>
        </div>

        {/* Time Display */}
        <div className={`px-6 py-4 border-b ${
          isDark ? 'border-gray-700/50 bg-gray-900/30' : 'border-gray-200/50 bg-gray-50/50'
        }`}>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold tracking-wider ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {formatTime(currentTime)}
              </div>
              <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Inactivity Info */}
        <div className={`px-6 py-3 flex items-center justify-center gap-2 text-xs ${
          isDark ? 'text-gray-500 bg-gray-900/20' : 'text-gray-400 bg-gray-50'
        }`}>
          <Activity size={14} />
          <span>Inactive for {inactiveMinutes}m {inactiveSeconds}s</span>
          <span className="mx-1">•</span>
          <Clock size={14} />
          <span>Auto-locked after 5 min</span>
        </div>

        {/* Unlock Form */}
        <div className="p-6">
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Enter Password to Unlock
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-gray-900' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white'
                  } ${error ? 'border-red-500/50' : ''}`}
                  autoFocus
                />
                <Shield 
                  size={18} 
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`} 
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <Activity size={14} />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUnlocking || password.length < 1}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                isUnlocking || password.length < 1
                  ? isDark 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'
                    : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'
              }`}
            >
              {isUnlocking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  Unlock Panel
                </>
              )}
            </button>
          </form>

          {/* User Info */}
          {user && (
            <div className={`mt-6 pt-4 border-t text-center ${
              isDark ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Logged in as <span className="font-medium text-cyan-400">{user.name || user.username || 'Admin'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className={`px-6 py-3 text-xs text-center ${
          isDark ? 'bg-gray-900/30 text-gray-500' : 'bg-gray-50 text-gray-400'
        }`}>
          <Shield size={12} className="inline mr-1" />
          Secured by CortexFlow Security System
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs ${
        isDark ? 'bg-gray-900/50 text-gray-400' : 'bg-white/50 text-gray-500'
      }`}>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Session Locked
      </div>
    </div>
  );
};

export default LockScreen;
