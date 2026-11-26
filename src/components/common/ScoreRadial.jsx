import React from 'react';

/**
 * Circular Radial Score Gauge Component (White & Emerald Design)
 * Displays an SVG circle gauge with emerald stroke and grade feedback badge.
 */
export default function ScoreRadial({
  score = 0,
  size = 140,
  strokeWidth = 10,
  label = 'Overall Score',
  subtext = 'Simulated Assessment',
  className = '',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, Math.round(Number(score) || 0)));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getScoreColor = () => {
    if (clampedScore >= 80) return '#059669'; // Emerald-600
    if (clampedScore >= 60) return '#D97706'; // Amber-600
    return '#DC2626'; // Red-600
  };

  const getPerformanceBadge = () => {
    if (clampedScore >= 85) return 'Excellent Readiness';
    if (clampedScore >= 70) return 'Good Preparation';
    if (clampedScore >= 55) return 'Moderate Practice';
    return 'Needs Reinforcement';
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      {label && <h4 className="text-sm font-bold text-slate-800 mt-3">{label}</h4>}
      <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        {getPerformanceBadge()}
      </span>
      {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
}
