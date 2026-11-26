import { create } from 'zustand';
import {
  loginUser,
  signupUser,
  getCurrentUser,
  logoutUser,
  updateUserProfile,
  updateUserPreferences,
  changeUserPassword,
} from '../services/authService';
import { useInterviewStore } from './useInterviewStore';

/**
 * Centralized Authentication Store (Real MongoDB + HttpOnly JWT session).
 * Client session state is hydrated on app startup via GET /api/auth/me.
 */
export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Actions

  /**
   * Initializes authentication state by querying the server's session endpoint.
   * Runs once on application mount.
   */
  initializeAuth: async () => {
    // Avoid re-running initialization if already in progress
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const data = await getCurrentUser();
      if (data?.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
      }
    } catch {
      // 401 Unauthorized or network unavailable on startup is normal for unauthenticated guests
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  /**
   * Refreshes the user profile data from the backend.
   */
  fetchCurrentUser: async () => {
    try {
      const data = await getCurrentUser();
      if (data?.user) {
        set({ user: data.user, isAuthenticated: true });
      }
    } catch (err) {
      console.warn('[useAuthStore] fetchCurrentUser error:', err.message);
    }
  },

  /**
   * Authenticates user with email and password via POST /api/auth/login.
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(credentials);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data.user;
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check credentials.';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  /**
   * Registers a new account via POST /api/auth/signup.
   */
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await signupUser(userData);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data.user;
    } catch (err) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  /**
   * Logs out the user via POST /api/auth/logout, clearing the HttpOnly cookie
   * and resetting in-memory interview state.
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
    } catch (err) {
      console.warn('[useAuthStore] Logout server call error:', err.message);
    } finally {
      // Reset active interview store state
      try {
        useInterviewStore.getState().resetInterview();
      } catch (e) {
        // Safe fallback
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Updates candidate profile information in MongoDB.
   */
  updateProfile: async (profileUpdates) => {
    set({ isLoading: true, error: null });
    try {
      const data = await updateUserProfile(profileUpdates);
      set((state) => ({
        user: { ...state.user, ...data.user },
        isLoading: false,
      }));
      return data.user;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  /**
   * Updates candidate interview preferences in MongoDB.
   */
  updatePreferences: async (preferences) => {
    set({ isLoading: true, error: null });
    try {
      const data = await updateUserPreferences(preferences);
      set((state) => ({
        user: {
          ...state.user,
          preferences: {
            ...(state.user?.preferences || {}),
            ...(data.user?.preferences || {}),
          },
        },
        isLoading: false,
      }));
      return data.user;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  /**
   * Changes account password and logs out on success.
   */
  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      await changeUserPassword(passwordData);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  /**
   * Clears any active error banner.
   */
  clearError: () => set({ error: null }),
}));
