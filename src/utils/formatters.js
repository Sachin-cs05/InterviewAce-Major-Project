/**
 * Formats a duration in seconds into a clean MM:SS or HH:MM:SS string.
 * Example: 65 -> "01:05", 125 -> "02:05", 3661 -> "01:01:01"
 * 
 * @param {number|string} seconds - Total duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const pad = (num) => String(num).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
};

/**
 * Formats an ISO date string or timestamp into a clean, human-readable date.
 * Example: "2026-11-25T16:30:00.000Z" -> "Nov 25, 2026"
 * 
 * @param {string|Date} isoString - Date string or Date object
 * @param {Object} [options] - Optional Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (isoString, options = {}) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const defaultOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Returns Tailwind CSS badge classes (background, text, and border)
 * corresponding to candidate interview evaluation scores.
 * 
 * Scoring thresholds:
 * - High (>= 80): Emerald (Green) badge
 * - Medium (60 - 79): Amber (Yellow/Orange) badge
 * - Low (< 60): Rose (Red) badge
 * 
 * @param {number|string} score - Score value between 0 and 100
 * @returns {string} Tailwind CSS class string
 */
export const getScoreBadgeColor = (score) => {
  const numericScore = Number(score) || 0;

  if (numericScore >= 80) {
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  }
  if (numericScore >= 60) {
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  }
  return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
};

/**
 * Returns Tailwind CSS text color class based on score.
 * Example: 85 -> "text-emerald-400", 72 -> "text-amber-400", 45 -> "text-rose-400"
 * 
 * @param {number|string} score
 * @returns {string}
 */
export const getScoreTextColor = (score) => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 80) return 'text-emerald-400';
  if (numericScore >= 60) return 'text-amber-400';
  return 'text-rose-400';
};

/**
 * Returns Tailwind CSS background color class for progress bars based on score.
 * Example: 85 -> "bg-emerald-500", 72 -> "bg-amber-500", 45 -> "bg-rose-500"
 * 
 * @param {number|string} score
 * @returns {string}
 */
export const getScoreProgressColor = (score) => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 80) return 'bg-emerald-500';
  if (numericScore >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
};

/**
 * Formats a numeric score into a percentage string.
 * Example: 87.4 -> "87%"
 * 
 * @param {number|string} score
 * @returns {string}
 */
export const formatScore = (score) => {
  const numeric = Math.round(Number(score) || 0);
  return `${numeric}%`;
};
