import React, { useState } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  PlayCircle,
  LogOut,
  User,
  Menu,
  X,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * Main application layout wrapper.
 * Features a responsive dark-mode Navbar with branding, navigation links, user badge, and logout.
 * Automatically hides the Navbar when on `/interview/:sessionId` for an immersive, distraction-free interview.
 */
export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Distraction-free interview mode: hide navigation bar when inside the active interview room
  const isInterviewRoom = /^\/interview\/[^/]+$/.test(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar: Hidden in Live Interview Room for immersive full-screen UX */}
      {!isInterviewRoom && (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand Logo */}
              <Link
                to="/dashboard"
                className="flex items-center gap-3 group transition-transform active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/30 group-hover:shadow-indigo-500/40 transition-all">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                      AI Interviewer
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Major Project
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 hidden sm:block">Intelligent Mock Interview Agent</p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800/90 text-indigo-400 shadow-sm border border-slate-700/60'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/setup"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <PlayCircle className="w-4 h-4" />
                  New Interview
                </NavLink>
              </nav>

              {/* User Profile Badge & Logout */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-slate-200 leading-none">
                      {user?.name || 'Dev Candidate'}
                    </span>
                    <span className="text-xs text-indigo-400 mt-1 font-mono">
                      {user?.targetRole || 'SDE-1'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-2 backdrop-blur-lg">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{user?.name || 'Dev Candidate'}</p>
                    <p className="text-xs text-indigo-400 font-mono">{user?.targetRole || 'SDE-1'}</p>
                  </div>
                </div>
              </div>

              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                Dashboard
              </NavLink>

              <NavLink
                to="/setup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-400 hover:bg-slate-900"
              >
                <PlayCircle className="w-4 h-4 text-indigo-400" />
                New Interview
              </NavLink>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </header>
      )}

      {/* Main App Content Viewport */}
      <main className={`flex-1 ${isInterviewRoom ? 'h-screen overflow-hidden' : 'p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto'}`}>
        <Outlet />
      </main>

      {/* Footer (Hidden during live interview) */}
      {!isInterviewRoom && (
        <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-400">
          <p>© 2026 AI Mock Interview Agent • Major Project • Architecture by Member 1</p>
        </footer>
      )}
    </div>
  );
}
