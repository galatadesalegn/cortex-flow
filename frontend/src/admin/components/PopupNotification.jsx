import { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const PopupNotification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle size={22} className="text-emerald-400" />,
    error: <XCircle size={22} className="text-red-400" />,
    warning: <AlertCircle size={22} className="text-amber-400" />,
    info: <Info size={22} className="text-cyan-400" />
  };

  const styles = {
    success: 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5',
    error: 'border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-500/5',
    warning: 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5',
    info: 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5'
  };

  const progressColors = {
    success: 'bg-emerald-400',
    error: 'bg-red-400',
    warning: 'bg-amber-400',
    info: 'bg-cyan-400'
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] transition-all duration-300 ease-out ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-[420px] ${styles[type]}`}
        style={{
          boxShadow: `0 8px 32px -8px ${
            type === 'success' ? 'rgba(16, 185, 129, 0.3)' :
            type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
            type === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
            'rgba(6, 182, 212, 0.3)'
          }`
        }}
      >
        {/* Glow effect */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 ${
          type === 'success' ? 'bg-emerald-500' :
          type === 'error' ? 'bg-red-500' :
          type === 'warning' ? 'bg-amber-500' :
          'bg-cyan-500'
        }`} />

        <div className="relative p-4 flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-xl ${
            type === 'success' ? 'bg-emerald-500/20' :
            type === 'error' ? 'bg-red-500/20' :
            type === 'warning' ? 'bg-amber-500/20' :
            'bg-cyan-500/20'
          }`}>
            {icons[type]}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-0.5 ${
              type === 'success' ? 'text-emerald-300' :
              type === 'error' ? 'text-red-300' :
              type === 'warning' ? 'text-amber-300' :
              'text-cyan-300'
            }`}>
              {type === 'success' ? 'Success' :
               type === 'error' ? 'Error' :
               type === 'warning' ? 'Warning' :
               'Info'}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div
            className={`h-full transition-all duration-100 ease-linear ${progressColors[type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupNotification;
