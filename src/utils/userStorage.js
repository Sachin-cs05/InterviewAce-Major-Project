/**
 * Returns the isolated localStorage key for interview history based on authenticated user ID.
 * Ensures multi-user privacy so one candidate cannot see another's local mock records.
 * 
 * @param {string|null} userId
 * @returns {string} localStorage key
 */
export const getUserHistoryStorageKey = (userId) => {
  return userId ? `interviewace-history-${userId}` : 'interviewace-history-anonymous';
};

/**
 * Retrieves the interview history array for the specified user.
 * @param {string|null} userId
 * @returns {Array}
 */
export const getUserInterviewHistory = (userId) => {
  const key = getUserHistoryStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('[userStorage] Failed to read user history:', err);
  }
  return [];
};

/**
 * Saves the interview history array for the specified user.
 * @param {string|null} userId
 * @param {Array} history
 */
export const saveUserInterviewHistory = (userId, history) => {
  const key = getUserHistoryStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(history));
  } catch (err) {
    console.warn('[userStorage] Failed to save user history:', err);
  }
};
