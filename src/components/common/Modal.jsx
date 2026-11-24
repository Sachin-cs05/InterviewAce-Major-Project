import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Dark-Mode Modal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {function} props.onClose - Callback triggered to close the modal
 * @param {string|React.ReactNode} [props.title] - Modal header title
 * @param {React.ReactNode} props.children - Modal body content
 * @param {string} [props.maxWidth='max-w-md'] - Tailwind max-width class for modal sizing
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) {
  // Handle Escape key and disable background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card (stops click propagation so clicking inside doesn't close) */}
      <div
        className={`relative w-full ${maxWidth} bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-slate-100 transition-all duration-200 transform scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          {title && (
            <h3 className="text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-700 cursor-pointer ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
