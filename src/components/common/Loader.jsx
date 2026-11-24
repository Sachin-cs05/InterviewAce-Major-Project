import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Clean Animated Spinner Component for Dark SaaS Theme
 *
 * @param {Object} props
 * @param {string} [props.text] - Optional text displayed below or next to the spinner
 * @param {boolean} [props.fullScreen=false] - When true, renders a fixed backdrop covering the whole screen
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - Spinner size scale
 * @param {string} [props.className=''] - Extra classes for styling
 */
export default function Loader({
  text = '',
  fullScreen = false,
  size = 'md',
  className = '',
}) {
  const sizeMap = {
    sm: {
      spinner: 'w-4 h-4',
      text: 'text-xs',
      gap: 'gap-2',
    },
    md: {
      spinner: 'w-6 h-6',
      text: 'text-sm',
      gap: 'gap-3',
    },
    lg: {
      spinner: 'w-9 h-9',
      text: 'text-base',
      gap: 'gap-3.5',
    },
    xl: {
      spinner: 'w-12 h-12',
      text: 'text-lg',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div
      className={`inline-flex flex-col items-center justify-center ${currentSize.gap} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle ambient radial glow behind spinner */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full" />
        <Loader2
          className={`relative animate-spin text-indigo-400 shrink-0 ${currentSize.spinner}`}
        />
      </div>

      {text && (
        <p className={`font-medium text-slate-300 tracking-wide animate-pulse ${currentSize.text}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md transition-all duration-300"
      >
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center max-w-sm mx-4">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center p-4">
      {content}
    </div>
  );
}
