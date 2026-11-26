import React from 'react';
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

/**
 * Root Application Component with centralized routing table (White & Emerald Theme).
 * 
 * Route Map:
 * - Public:
 *   /                     -> LandingPage
 *   /login                -> LoginPage
 *   /signup               -> SignupPage
 *   /about                -> AboutPage
 * 
 * - Protected (Inside ProtectedRoute & MainLayout):
 *   /dashboard            -> DashboardPage
 *   /setup                -> InterviewSetupPage
 *   /interview/new        -> InterviewSetupPage (alias)
 *   /device-check         -> DeviceCheckPage
 *   /interview/:sessionId -> InterviewRoomPage (auto-hides nav for full-screen interview)
 *   /report/:sessionId    -> FeedbackReportPage
 *   /interview/:sessionId/result -> FeedbackReportPage (alias)
 *   /history              -> HistoryPage
 *   /history/:sessionId   -> InterviewDetailPage
 *   /profile              -> ProfilePage
 *   /settings             -> SettingsPage
 * 
 * - Fallback Wildcard:
 *   *                     -> NotFoundPage (404)
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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
