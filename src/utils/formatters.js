/**
 * InterviewAce Utility Formatters (White & Emerald Theme)
 */

/**
 * Formats a duration in seconds into a clean MM:SS or HH:MM:SS string.
 * Example: 65 -> "01:05", 125 -> "02:05", 3661 -> "01:01:01"
 * @param {number|string} seconds
 * @returns {string}
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
 * @param {string|Date} isoString
 * @param {Object} [options]
 * @returns {string}
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
 * corresponding to candidate interview evaluation scores (White & Emerald Light Theme).
 * 
 * @param {number|string} score - Score value between 0 and 100
 * @returns {string} Tailwind CSS class string
 */
export const getScoreBadgeColor = (score) => {
  const numericScore = Number(score) || 0;

  if (numericScore >= 80) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  if (numericScore >= 60) {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }
  return 'bg-rose-50 text-rose-700 border border-rose-200';
};

/**
 * Returns Tailwind CSS text color class based on score.
 * Example: 85 -> "text-emerald-600", 72 -> "text-amber-600", 45 -> "text-rose-600"
 * @param {number|string} score
 * @returns {string}
 */
export const getScoreTextColor = (score) => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 80) return 'text-emerald-600';
  if (numericScore >= 60) return 'text-amber-600';
  return 'text-rose-600';
};

/**
 * Returns Tailwind CSS background color class for progress bars based on score.
 * @param {number|string} score
 * @returns {string}
 */
export const getScoreProgressColor = (score) => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 80) return 'bg-emerald-600';
  if (numericScore >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
};

/**
 * Formats a numeric score into a percentage string.
 * Example: 87.4 -> "87%"
 * @param {number|string} score
 * @returns {string}
 */
export const formatScore = (score) => {
  const numeric = Math.round(Number(score) || 0);
  return `${numeric}%`;
};
