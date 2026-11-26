import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Loader from '../common/Loader';

/**
 * Route guard component that checks verified backend authentication status.
 * - Displays a loading indicator while session initialization is in progress.
 * - Redirects unauthenticated users to /login preserving intended destination.
 * - Allows access only when authenticated.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  // Wait until session verification has completed before determining access
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader size="lg" text="Verifying authentication session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
