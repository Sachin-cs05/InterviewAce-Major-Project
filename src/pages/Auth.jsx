import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
  Mail,
  Lock,
  Code2,
  Zap,
  Award,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

/**
 * Unified Authentication Page Component
 * Handles both /login and /signup routes seamlessly with tab-based toggling,
 * split-screen branding, client-side validation, and viva one-click demo login.
 */
export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  // Zustand auth store contract
  const { login, signup, demoLogin, isLoading, error: storeError, isAuthenticated } = useAuthStore();

  // Route-based mode detection with tab switching support
  const isInitialSignup = location.pathname === '/signup';
  const [mode, setMode] = useState(isInitialSignup ? 'signup' : 'login');

  // Keep internal state aligned if route changes externally
  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'login');
  }, [location.pathname]);

  // Form field state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'SDE-1',
  });

  // Client-side validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Handle mode switch between login and signup
  const switchMode = (newMode) => {
    setMode(newMode);
    setValidationErrors({});
    // Soft update URL history without page reload
    window.history.replaceState(null, '', newMode === 'signup' ? '/signup' : '/login');
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific validation error upon editing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation logic
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Full name validation (signup only)
    if (mode === 'signup') {
      if (!formData.name || !formData.name.trim()) {
        errors.name = 'Full name is required';
      }
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'signup') {
        await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          targetRole: formData.targetRole,
        });
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      }
      navigate('/dashboard', { replace: true });
    } catch {
      // Error message is stored in Zustand state
    }
  };

  // Handle 1-Click Demo Evaluation Sign-in
  const handleDemoSignIn = async () => {
    try {
      await demoLogin();
      navigate('/dashboard', { replace: true });
    } catch {
      // Handled in store
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Simple Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/30 border border-indigo-400/20 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            AI Interviewer
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Split-Screen Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ==================== LEFT PANEL (Branding & Project Highlights) ==================== */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Background Gradient Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-600/10 blur-[90px] pointer-events-none -z-10" />

            {/* Top Badge & Headline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CS Major Project • 5-Member Team</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Simulate Technical Rounds with{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Intelligent Voice AI
                </span>
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Designed for engineering candidates preparing for high-standard software engineering
                and data roles. Practice live communication, algorithm problem solving, and system
                design.
              </p>

              {/* Feature Highlights List */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      Real-time Speech Synthesis & Recognition
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Two-way voice dialogue with natural pacing and responsive conversational turn-taking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      Dynamic Role-Specific Tracks
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Curated questions for SDE-1, Frontend, Backend, Full Stack MERN, and Data Analysts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      Instant 4-Dimension Rubric Scorecard
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Technical accuracy, problem solving, system design, and communication breakdown.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial / Evaluation Viva Card */}
            <div className="mt-10 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">
                  Ready for Project Viva & Evaluation
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                "Use the instant Demo Student login button on the right to test end-to-end interview
                flow without creating mock database entries."
              </p>
            </div>
          </div>

          {/* ==================== RIGHT PANEL (Authentication Card) ==================== */}
          <div className="col-span-1 lg:col-span-6 flex flex-col justify-center">
            <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative">
              {/* Mode Toggle Tabs */}
              <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form Heading */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {mode === 'signup' ? 'Create Candidate Account' : 'Welcome Back'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'signup'
                    ? 'Register your profile to begin customized AI mock sessions.'
                    : 'Sign in to access your interview dashboard and scorecards.'}
                </p>
              </div>

              {/* Store Error Alert */}
              {storeError && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{storeError}</span>
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name Field (Signup Mode Only) */}
                {mode === 'signup' && (
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Johnson"
                    error={validationErrors.name}
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                )}

                {/* Email Address Field */}
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex@example.com"
                  error={validationErrors.email}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                {/* Password Field */}
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  error={validationErrors.password}
                  icon={<Lock className="w-4 h-4" />}
                  helperText={mode === 'signup' ? 'Must be at least 6 characters' : ''}
                  required
                />

                {/* Target Career Role Dropdown (Signup Mode Only) */}
                {mode === 'signup' && (
                  <div className="w-full flex flex-col gap-1.5">
                    <label
                      htmlFor="targetRole"
                      className="block text-xs font-medium text-slate-300 tracking-wide select-none"
                    >
                      Target Role
                      <span className="text-rose-400 ml-1 font-semibold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-slate-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <select
                        id="targetRole"
                        name="targetRole"
                        value={formData.targetRole}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 bg-slate-950/90 text-slate-100 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none cursor-pointer"
                      >
                        <option value="SDE-1">SDE-1 (Software Development Engineer)</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack MERN">Full Stack MERN</option>
                        <option value="Data Analyst">Data Analyst</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    isLoading={isLoading}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    {mode === 'signup' ? 'Complete Registration' : 'Sign In with Email'}
                  </Button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-slate-900 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Or Viva Evaluation Demo
                </span>
              </div>

              {/* 1-Click Demo Login Button */}
              <Button
                type="button"
                variant="secondary"
                size="md"
                fullWidth
                isLoading={isLoading}
                onClick={handleDemoSignIn}
                icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
                className="border-slate-700 hover:border-slate-600 bg-slate-950/60"
              >
                Continue with Demo Student Account
              </Button>

              {/* Bottom Mode Switch Link */}
              <div className="mt-6 text-center text-xs text-slate-400">
                {mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold focus:outline-none cursor-pointer ml-1 underline-offset-4 hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold focus:outline-none cursor-pointer ml-1 underline-offset-4 hover:underline"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-900 bg-slate-950/40">
        AI Mock Interview Agent • Major Project Submission
      </footer>
    </div>
  );
}
