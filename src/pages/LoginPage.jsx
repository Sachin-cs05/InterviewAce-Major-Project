import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bot, LogIn, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Placeholder component for the Candidate Sign In Page.
 * Assigned to: Member 2
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');

  const destination = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate(destination, { replace: true });
    } catch {
      // Error handled in store
    }
  };

  const handleDemoSignIn = async () => {
    try {
      await demoLogin();
      navigate(destination, { replace: true });
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        {/* Ownership Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Bot className="w-3.5 h-3.5" />
            <span>Assigned: Member 2</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">/login</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to AI Interviewer</h2>
          <p className="text-xs text-slate-400 mt-1">Ready to practice your technical mock interview?</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400">
            or instant testing
          </span>
        </div>

        {/* 1-Click Demo Login Button */}
        <button
          onClick={handleDemoSignIn}
          disabled={isLoading}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 font-medium text-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Quick Demo Login (Pre-filled Candidate)</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
