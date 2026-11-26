import axios from 'axios';

/**
 * Extracts a cookie value by name from document.cookie.
 * @param {string} name - Cookie name
 * @returns {string|null}
 */
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Centralized Axios instance configured for InterviewAce application.
 * - withCredentials: true sends and receives HttpOnly session cookies across origins.
 * - Interceptors automatically attach the CSRF token on state-changing requests.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables HttpOnly cookie transmission
  timeout: 15000,
});

let csrfTokenPromise = null;

/**
 * Ensures a valid CSRF token is available from the backend before mutating requests.
 * @returns {Promise<string>}
 */
export const ensureCsrfToken = async () => {
  const existingCookie = getCookie('interviewace_csrf');
  if (existingCookie) {
    return existingCookie;
  }

  if (!csrfTokenPromise) {
    csrfTokenPromise = apiClient
      .get('/auth/csrf')
      .then((res) => {
        csrfTokenPromise = null;
        return res.data?.data?.csrfToken || getCookie('interviewace_csrf');
      })
      .catch((err) => {
        csrfTokenPromise = null;
        console.warn('[apiClient] Failed to fetch CSRF token:', err.message);
        return null;
      });
  }

  return csrfTokenPromise;
};

/**
 * Request Interceptor:
 * Attaches the CSRF token header for mutating HTTP methods (POST, PUT, PATCH, DELETE).
 */
apiClient.interceptors.request.use(
  async (config) => {
    const method = (config.method || 'get').toUpperCase();
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (isMutating && !config.headers['x-csrf-token']) {
      const csrfToken = await ensureCsrfToken();
      if (csrfToken) {
        config.headers['x-csrf-token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * Handles global error responses.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return sanitized error messages for UI display
    const responseData = error.response?.data;
    if (responseData?.message) {
      error.message = responseData.message;
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Unable to connect to the InterviewAce server. Please ensure the backend is running.';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
