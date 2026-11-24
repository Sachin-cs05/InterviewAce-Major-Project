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
  Check,
  X,
  Send,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';

/**
 * Unified Authentication Page Component
 * Handles both /login and /signup routes with live password strength meter,
 * working forgot password modal, multi-persona demo quick logins, and toast notifications.
 */
export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  // Zustand auth store contract
  const { login, signup, demoLogin, isLoading, error: storeError, isAuthenticated } = useAuthStore();

  // Mode state aligned with URL
  const isInitialSignup = location.pathname === '/signup';
  const [mode, setMode] = useState(isInitialSignup ? 'signup' : 'login');

  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'login');
  }, [location.pathname]);

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'SDE-1',
  });

  // Client-side validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Toast notification state
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  // Auto-redirect if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Switch between Login and Signup modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setValidationErrors({});
    window.history.replaceState(null, '', newMode === 'signup' ? '/signup' : '/login');
  };

  // Form field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Live Password Strength Calculation
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', checks: {} };

    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };

    const passedCount = Object.values(checks).filter(Boolean).length;
    let label = 'Weak';
    let color = 'bg-rose-500';

    if (passedCount === 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    } else if (passedCount === 3) {
      label = 'Good';
      color = 'bg-indigo-400';
    } else if (passedCount === 2) {
      label = 'Fair';
      color = 'bg-amber-400';
    } else {
      label = 'Weak';
      color = 'bg-rose-500';
    }

    return { score: passedCount, label, color, checks };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Client-side validation
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'signup') {
      if (!formData.name || !formData.name.trim()) {
        errors.name = 'Full name is required';
      }
    }

    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

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
      setToast({ message: 'Please correct the highlighted fields.', type: 'error' });
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
        setToast({ message: 'Account registered successfully! Redirecting...', type: 'success' });
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
        setToast({ message: 'Signed in successfully! Redirecting...', type: 'success' });
      }
      navigate('/dashboard', { replace: true });
    } catch {
      setToast({ message: storeError || 'Authentication failed. Please verify credentials.', type: 'error' });
    }
  };

  // Quick Demo Persona Logins (SDE-1 & Frontend)
  const handleQuickDemo = async (personaRole) => {
    try {
      setToast({ message: `Logging in as Demo ${personaRole}...`, type: 'info' });
      await demoLogin();
      navigate('/dashboard', { replace: true });
    } catch {
      setToast({ message: 'Failed to authenticate demo candidate.', type: 'error' });
    }
  };

  // Handle Password Reset Request
  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setToast({ message: 'Please provide a valid email address for password reset.', type: 'error' });
      return;
    }
    setResetSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200 relative">
      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'info' })}
        />
      )}

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

            {/* Bottom Viva / Evaluation Callout Card */}
            <div className="mt-10 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">
                  Ready for Project Viva & Evaluation
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                "Use the instant Demo persona buttons on the right to test end-to-end interview flow
                without registering temporary database credentials."
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

              {/* Store Error Banner */}
              {storeError && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{storeError}</span>
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name Field (Signup Mode) */}
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
                <div>
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    error={validationErrors.password}
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />

                  {/* Forgot Password Link in Login Mode */}
                  {mode === 'login' && (
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(formData.email);
                          setResetSubmitted(false);
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Live 4-Bar Password Strength Meter (Signup Mode Only) */}
                  {mode === 'signup' && formData.password.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Password Strength:</span>
                        <span className="font-semibold text-slate-200 text-[11px]">
                          {passwordStrength.label}
                        </span>
                      </div>

                      {/* 4-Segment Bar */}
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-all duration-300 ${
                              passwordStrength.score >= step
                                ? passwordStrength.color
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Checklist requirements */}
                      <div className="grid grid-cols-2 gap-1 pt-1.5 text-[10px]">
                        <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passwordStrength.checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>8+ characters</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passwordStrength.checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>Uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passwordStrength.checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>Number (0-9)</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {passwordStrength.checks.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>Special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Career Role Dropdown (Signup Mode Only) */}
                {mode === 'signup' && (
                  <div className="w-full flex flex-col gap-1.5">
                    <label
                      htmlFor="targetRole"
                      className="block text-xs font-medium text-slate-300 tracking-wide select-none"
                    >
                      Target Career Role
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
                  Or Instant Demo Personas
                </span>
              </div>

              {/* Multi-Persona Demo Buttons for Viva/Evaluation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={isLoading}
                  onClick={() => handleQuickDemo('SDE-1')}
                  icon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                  className="border-slate-700 hover:border-slate-600 bg-slate-950/70"
                >
                  Demo as SDE-1
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={isLoading}
                  onClick={() => handleQuickDemo('Frontend Dev')}
                  icon={<Code2 className="w-3.5 h-3.5 text-violet-400" />}
                  className="border-slate-700 hover:border-slate-600 bg-slate-950/70"
                >
                  Demo as Frontend Dev
                </Button>
              </div>

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

      {/* ==================== FORGOT PASSWORD MODAL ==================== */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Your Password"
      >
        {resetSubmitted ? (
          <div className="space-y-4 text-center py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Reset Link Dispatched</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                A password reset confirmation has been simulated for{' '}
                <span className="text-indigo-300 font-medium">{resetEmail}</span>. Check your inbox
                to set a new password.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => setIsForgotModalOpen(false)}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter the email address associated with your candidate account. We'll send you an
              instant reset link.
            </p>
            <Input
              label="Email Address"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsForgotModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<Send className="w-4 h-4" />}
                iconPosition="right"
                className="flex-1"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Simple Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-900 bg-slate-950/40">
        AI Mock Interview Agent • Major Project Submission
      </footer>
    </div>
  );
}
