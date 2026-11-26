import React from 'react';

/**
 * Clean White Surface Card Component
 */
export default function Card({ children, className = '', hover = false, ...rest }) {
  return (
    <div
      className={`
        bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs
        ${hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
}
