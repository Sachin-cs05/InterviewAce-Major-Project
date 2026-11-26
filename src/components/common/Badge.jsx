import React from 'react';

/**
 * Pill Badge Component (White & Emerald Theme)
 */
export default function Badge({
  children,
  variant = 'emerald',
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200',
    blue: 'bg-sky-50 text-sky-700 border border-sky-200',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full select-none
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.emerald}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
