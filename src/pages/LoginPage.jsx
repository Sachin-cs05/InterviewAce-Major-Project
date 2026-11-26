import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

/**
 * Split-screen Login Page (White & Emerald Theme)
 * Authenticates against backend POST /api/auth/login with HttpOnly cookie sessions.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const destination = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    try {
      await login({ email: trimmedEmail, password });
      navigate(destination, { replace: true });
    } catch {
      // Error message is caught and set inside useAuthStore
    }
  };

  /**
   * One-click demo login for college evaluations and quick tests.
   * Attempts to login as demo candidate; automatically signs up if account is not yet seeded.
   */
  const handleDemoSignIn = async () => {
    setValidationError('');
    clearError();
    setIsDemoLoading(true);

    const demoCredentials = {
      name: 'Alex Johnson',
      email: 'alex.candidate@interviewace.dev',
      password: 'Password123!',
      targetRole: 'Frontend Developer',
    };

    try {
      // 1. Try logging in with demo account
      try {
        await login({ email: demoCredentials.email, password: demoCredentials.password });
        navigate(destination, { replace: true });
        return;
      } catch (loginErr) {
        // If login failed because user does not exist in MongoDB, auto-register demo candidate
        if (
          loginErr.message?.toLowerCase().includes('invalid') ||
          loginErr.message?.toLowerCase().includes('not found') ||
          loginErr.message?.toLowerCase().includes('credentials')
        ) {
          await signup(demoCredentials);
          navigate(destination, { replace: true });
          return;
        }
        throw loginErr;
      }
    } catch (err) {
      setValidationError(err.message || 'Demo sign-in failed. Please ensure the backend server is running.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Side: Branding & Features (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-emerald-600 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Geometric ambient circles */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500 rounded-full opacity-40 blur-xl" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-emerald-700 rounded-full opacity-40 blur-2xl" />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-md font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                InterviewAce
              </span>
            </Link>
          </div>

          {/* Middle Value Proposition */}
          <div className="relative z-10 space-y-6 my-auto py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/40 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Simulated Campus Placement AI</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Prepare for high-stakes interviews with confidence.
            </h2>

            <p className="text-emerald-100 text-sm leading-relaxed max-w-sm">
              Practice real-world technical and HR questions, test your webcam and audio clarity, and
              receive actionable performance breakdowns.
            </p>

            <div className="space-y-3 pt-2 text-xs text-emerald-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Deterministic rubric scoring based on keywords</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Full browser speech synthesis & recognition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Secure HttpOnly JWT authentication & session isolation</span>
              </div>
            </div>
          </div>

          {/* Bottom Project Note */}
          <div className="relative z-10 text-xs text-emerald-200 border-t border-emerald-500/40 pt-4">
            College Major Project Demonstration • Student Prototype
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-lg shadow-slate-200/50">
            {/* Header */}
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-4 hover:underline">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials or click 1-Click Demo Login to test immediately.
              </p>
            </div>

            {/* Error alerts */}
            {(error || validationError) && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="candidate@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError('');
                  if (error) clearError();
                }}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError('');
                  if (error) clearError();
                }}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-slate-400">Secure Session</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading && !isDemoLoading}
                icon={<LogIn className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            {/* Quick Demo Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Or Instant Testing
              </span>
            </div>

            {/* 1-Click Demo Button */}
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleDemoSignIn}
              isLoading={isDemoLoading}
              icon={<Sparkles className="w-4 h-4 text-emerald-600" />}
            >
              1-Click Demo Candidate Login
            </Button>

            <p className="text-center text-xs text-slate-500 mt-6">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
