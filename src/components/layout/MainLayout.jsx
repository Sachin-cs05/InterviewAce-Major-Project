import React from 'react';
import DashboardLayout from './DashboardLayout';

/**
 * MainLayout Component
 * Re-exports DashboardLayout to maintain 100% backward compatibility with App.jsx
 * and all teammate branches.
 */
export default function MainLayout() {
  return <DashboardLayout />;
}
