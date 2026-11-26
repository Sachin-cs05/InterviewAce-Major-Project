import axios from 'axios';

/**
 * Centralized Axios instance configured for the InterviewAce application.
 * Automatically injects the JWT Bearer token from localStorage on every request.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Request Interceptor:
 * Attaches the Authorization header if a valid token exists in localStorage
 * (supports both standalone 'token' key and persisted 'interviewace-auth' store).
 */
apiClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');

    if (!token) {
      try {
        const persistedAuth = localStorage.getItem('interviewace-auth');
        if (persistedAuth) {
          const parsed = JSON.parse(persistedAuth);
          token = parsed?.state?.token || null;
        }
      } catch (err) {
        console.warn('[apiClient] Failed to parse persisted auth token:', err);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * Handles global error responses (such as 401 Unauthorized token expiry).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired auth session if needed
      console.warn('[apiClient] Received 401 Unauthorized. Session expired.');
      localStorage.removeItem('token');
      localStorage.removeItem('interviewace-auth');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
