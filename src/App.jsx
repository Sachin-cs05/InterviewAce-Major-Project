import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout Wrappers
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Modular Pages (Teammates can replace these files without touching App.jsx)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import DeviceCheckPage from './pages/DeviceCheckPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import FeedbackReportPage from './pages/FeedbackReportPage';

/**
 * Root Application Component with centralized routing table.
 * 
 * Route Hierarchy:
 * - Public:
 *   /              -> LandingPage (Member 2)
 *   /login         -> LoginPage (Member 2)
 *   /signup        -> SignupPage (Member 2)
 * 
 * - Protected (Wrapped with <ProtectedRoute/> and <MainLayout/>):
 *   /dashboard     -> DashboardPage (Member 3)
 *   /setup         -> InterviewSetupPage (Member 3)
 *   /device-check  -> DeviceCheckPage (Member 4)
 *   /interview/:sessionId -> InterviewRoomPage (Member 4 - Auto-hides Navbar)
 *   /report/:sessionId    -> FeedbackReportPage (Member 5)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes inside Main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/setup" element={<InterviewSetupPage />} />
            <Route path="/device-check" element={<DeviceCheckPage />} />
            <Route path="/interview/:sessionId" element={<InterviewRoomPage />} />
            <Route path="/report/:sessionId" element={<FeedbackReportPage />} />
          </Route>
        </Route>

        {/* Fallback Wildcard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
