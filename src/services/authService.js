// import apiClient from './apiClient';

/**
 * Simulates a network latency delay for mock API responses.
 * @param {number} ms - Milliseconds to delay (default 800ms)
 * @returns {Promise<void>}
 */
const mockDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Authenticates an existing user with email and password.
 * 
 * // TODO: Replace with real Express API:
 * // const response = await apiClient.post('/auth/login', credentials);
 * // return response.data;
 * 
 * @param {Object} credentials
 * @param {string} credentials.email - User email address
 * @param {string} credentials.password - User password
 * @returns {Promise<{ user: { id: string, name: string, email: string, targetRole: string }, token: string }>}
 */
export const loginUser = async (credentials) => {
  await mockDelay(800);

  if (!credentials?.email || !credentials?.password) {
    throw new Error('Please provide both email and password.');
  }

  // Mock successful response
  return {
    user: {
      id: 'usr_001',
      name: credentials.email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()) || 'Alex Johnson',
      email: credentials.email,
      targetRole: 'Full Stack Engineer',
    },
    token: 'mock-jwt-token-xyz-101',
  };
};

/**
 * Registers a new candidate account.
 * 
 * // TODO: Replace with real Express API:
 * // const response = await apiClient.post('/auth/signup', userData);
 * // return response.data;
 * 
 * @param {Object} userData
 * @param {string} userData.name - Full name of the candidate
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Account password
 * @param {string} [userData.targetRole] - Desired career role (e.g. 'SDE-1')
 * @returns {Promise<{ user: { id: string, name: string, email: string, targetRole: string }, token: string }>}
 */
export const signupUser = async (userData) => {
  await mockDelay(800);

  if (!userData?.email || !userData?.password || !userData?.name) {
    throw new Error('Name, email, and password are required for registration.');
  }

  return {
    user: {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      targetRole: userData.targetRole || 'SDE-1',
    },
    token: `mock-jwt-token-new-${Date.now()}`,
  };
};

/**
 * Authenticates with a pre-configured demo candidate profile for rapid testing and grading.
 * 
 * // TODO: Replace with real Express API:
 * // const response = await apiClient.post('/auth/demo');
 * // return response.data;
 * 
 * @returns {Promise<{ user: { id: string, name: string, email: string, targetRole: string }, token: string }>}
 */
export const demoLoginUser = async () => {
  await mockDelay(800);

  return {
    user: {
      id: 'usr_demo_42',
      name: 'Dev Candidate',
      email: 'demo@interviewace.ai',
      targetRole: 'SDE-1 (Frontend & React)',
    },
    token: 'mock-jwt-token-demo-42',
  };
};
