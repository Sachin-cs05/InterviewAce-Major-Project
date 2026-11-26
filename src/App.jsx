import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout Wrappers
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/layout/ErrorBoundary';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Student Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import DeviceCheckPage from './pages/DeviceCheckPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import FeedbackReportPage from './pages/FeedbackReportPage';
import HistoryPage from './pages/HistoryPage';
import InterviewDetailPage from './pages/InterviewDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Authentication Store
import { useAuthStore } from './store/useAuthStore';

/**
 * Public route wrapper that redirects authenticated users to /dashboard.
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (isInitialized && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * Root Application Component with centralized routing table (White & Emerald Theme).
 */
export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Restore session on app boot
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected Routes inside Main Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/setup" element={<InterviewSetupPage />} />
              <Route path="/interview/new" element={<InterviewSetupPage />} />
              <Route path="/device-check" element={<DeviceCheckPage />} />
              <Route path="/interview/:sessionId" element={<InterviewRoomPage />} />
              <Route path="/report/:sessionId" element={<FeedbackReportPage />} />
              <Route path="/interview/:sessionId/result" element={<FeedbackReportPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:sessionId" element={<InterviewDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback Wildcard (404 Not Found) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
