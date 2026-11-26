import React, { useState } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  PlayCircle,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import ErrorBoundary from './ErrorBoundary';

/**
 * Reusable Dashboard Layout (White & Emerald Theme)
 * Features a clean white sidebar with active emerald accents, top header with user avatar,
 * breadcrumbs, profile dropdown, and responsive mobile navigation drawer.
 * Automatically hides sidebar when in the live interview room (/interview/:id).
 */
export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Distraction-free interview mode: hide navigation bars when inside live interview room
  const isInterviewRoom = location.pathname.startsWith('/interview/') && !location.pathname.includes('/new');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/setup', label: 'New Interview', icon: PlayCircle },
    { to: '/history', label: 'Interview History', icon: History },
    { to: '/profile', label: 'Candidate Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Candidate Dashboard';
    if (path === '/setup' || path === '/interview/new') return 'Create Interview';
    if (path === '/device-check') return 'Device Readiness Check';
    if (path.startsWith('/report/') || path.includes('/result')) return 'Interview Performance Report';
    if (path === '/history') return 'Interview History';
    if (path.startsWith('/history/')) return 'Interview Session Details';
    if (path === '/profile') return 'Candidate Profile';
    if (path === '/settings') return 'Preferences & Settings';
    if (path === '/about') return 'About & Engineering Team';
    return 'InterviewAce';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col antialiased">
      {/* If inside Live Interview Room, render full-screen view without Dashboard shell */}
      {isInterviewRoom ? (
        <main className="h-screen w-screen overflow-hidden p-0 bg-white">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Desktop Left Sidebar */}
          <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 select-none">
            {/* Sidebar Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
              <Link to="/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Interview<span className="text-emerald-600">Ace</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    AI Mock Platform
                  </span>
                </div>
              </Link>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom User Capsule & Logout */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 mb-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {user?.name || 'Dev Candidate'}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-mono truncate">
                      {user?.targetRole || 'SDE-1'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Navigation Header */}
            <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* Mobile menu button & Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Open sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>

              {/* Right Profile Pill Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {user?.name || 'Candidate'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block leading-tight">
                      {user?.targetRole || 'Software Engineer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40 animate-in fade-in slide-in-from-top-1"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Candidate Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preferences</span>
                    </Link>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
              <div
                className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs md:hidden"
                onClick={() => setMobileOpen(false)}
              >
                <div
                  className="w-72 max-w-full bg-white h-full p-4 flex flex-col justify-between shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">InterviewAce</span>
                      </div>
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <nav className="space-y-1">
                      {navLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`
                            }
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Viewport Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
