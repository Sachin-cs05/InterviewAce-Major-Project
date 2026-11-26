import React from 'react';

/**
 * Linear Progress Bar Component (White & Emerald Theme)
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showPercentage = true,
  height = 'h-2',
  colorClass = 'bg-emerald-600',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-slate-500">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
