import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Reusable Floating Top-Right Notification Toast Banner
 *
 * @param {Object} props
 * @param {string} props.message - Toast message content
 * @param {'success' | 'error' | 'info'} [props.type='info'] - Notification severity
 * @param {function} props.onClose - Callback to dismiss the toast
 * @param {number} [props.duration=3000] - Auto-dismiss timeout in ms
 */
export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) {
  // Auto-dismiss timer
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  // Type styling configurations
  const typeConfig = {
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-slate-900/95',
      text: 'text-emerald-300',
      shadow: 'shadow-emerald-500/10',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    error: {
      border: 'border-rose-500/40',
      bg: 'bg-slate-900/95',
      text: 'text-rose-300',
      shadow: 'shadow-rose-500/10',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    info: {
      border: 'border-indigo-500/40',
      bg: 'bg-slate-900/95',
      text: 'text-indigo-300',
      shadow: 'shadow-indigo-500/10',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
    },
  };

  const currentConfig = typeConfig[type] || typeConfig.info;

  return (
    <div
      role="alert"
      className={`fixed top-5 right-5 z-50 max-w-sm w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${currentConfig.border} ${currentConfig.bg} ${currentConfig.shadow} shadow-2xl backdrop-blur-md transition-all duration-300 animate-slideDown`}
    >
      <div className="flex items-center gap-3">
        {currentConfig.icon}
        <p className={`text-xs sm:text-sm font-medium ${currentConfig.text}`}>
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
