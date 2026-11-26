import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Reusable Toast Alert Component (White & Emerald Theme)
 */
export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3500,
  className = '',
}) {
  useEffect(() => {
    if (!message || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-200 bg-white text-slate-800 shadow-emerald-500/5',
    error: 'border-rose-200 bg-white text-slate-800 shadow-rose-500/5',
    warning: 'border-amber-200 bg-white text-slate-800 shadow-amber-500/5',
    info: 'border-sky-200 bg-white text-slate-800 shadow-sky-500/5',
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 max-w-sm w-full p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
        borderMap[type] || borderMap.success
      } ${className}`}
    >
      {iconMap[type] || iconMap.success}
      <p className="text-xs sm:text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
