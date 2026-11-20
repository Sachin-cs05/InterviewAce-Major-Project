import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, signupUser, demoLoginUser } from '../services/authService';

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} targetRole
 */

/**
 * Centralized Authentication Store.
 * Uses Zustand persist middleware to preserve login credentials across browser refreshes.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions

      /**
       * Authenticates a user with email and password.
       * @param {Object} credentials
       * @param {string} credentials.email
       * @param {string} credentials.password
       * @returns {Promise<UserProfile>}
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await loginUser(credentials);
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      /**
       * Registers a new user account.
       * @param {Object} userData
       * @param {string} userData.name
       * @param {string} userData.email
       * @param {string} userData.password
       * @param {string} [userData.targetRole]
       * @returns {Promise<UserProfile>}
       */
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await signupUser(userData);
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      /**
       * Authenticates immediately with a mock demo candidate profile.
       * Useful for development, testing, and team walkthroughs.
       * @returns {Promise<UserProfile>}
       */
      demoLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await demoLoginUser();
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (err) {
          const errorMessage = err.message || 'Demo login failed.';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      /**
       * Logs out the user and clears all session state from storage.
       */
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'interviewace-auth', // Storage key in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
