import apiClient from './apiClient';

/**
 * Registers a new candidate account against the real backend API.
 * POST /api/auth/signup
 * 
 * @param {Object} userData
 * @param {string} userData.name - Full name of the candidate
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Account password
 * @param {string} [userData.targetRole] - Desired career role
 * @param {string} [userData.confirmPassword] - Password confirmation
 * @returns {Promise<{ user: Object }>}
 */
export const signupUser = async (userData) => {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data?.data;
};

/**
 * Authenticates an existing candidate with email and password.
 * POST /api/auth/login
 * 
 * @param {Object} credentials
 * @param {string} credentials.email - User email address
 * @param {string} credentials.password - User password
 * @returns {Promise<{ user: Object }>}
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data?.data;
};

/**
 * Retrieves the currently authenticated user's profile and preferences.
 * GET /api/auth/me
 * 
 * @returns {Promise<{ user: Object }>}
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data?.data;
};

/**
 * Logs out the candidate, invalidating the session and clearing HttpOnly cookies.
 * POST /api/auth/logout
 * 
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data?.data;
};

/**
 * Updates candidate profile details.
 * PATCH /api/users/me
 * 
 * @param {Object} profileUpdates - Allowed fields: name, targetRole, experience, skills, education
 * @returns {Promise<{ user: Object }>}
 */
export const updateUserProfile = async (profileUpdates) => {
  const response = await apiClient.patch('/users/me', profileUpdates);
  return response.data?.data;
};

/**
 * Updates interview preferences.
 * PATCH /api/users/me/preferences
 * 
 * @param {Object} preferences - Allowed fields: voiceEnabled, defaultInterviewType, defaultDifficulty, defaultQuestionCount
 * @returns {Promise<{ user: Object }>}
 */
export const updateUserPreferences = async (preferences) => {
  const response = await apiClient.patch('/users/me/preferences', preferences);
  return response.data?.data;
};

/**
 * Changes candidate password and invalidates previous sessions.
 * PATCH /api/users/me/password
 * 
 * @param {Object} passwordData
 * @param {string} passwordData.currentPassword
 * @param {string} passwordData.newPassword
 * @param {string} [passwordData.confirmNewPassword]
 * @returns {Promise<void>}
 */
export const changeUserPassword = async (passwordData) => {
  const response = await apiClient.patch('/users/me/password', passwordData);
  return response.data?.data;
};
