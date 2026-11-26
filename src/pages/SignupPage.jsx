import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Briefcase,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

/**
 * Split-screen Signup Page (White & Emerald Theme)
 */
export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [validationError, setValidationError] = useState('');

  const roleOptions = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack MERN',
    'Data Analyst',
    'Java Developer',
    'Python Developer',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !password) {
      setValidationError('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setValidationError('Please accept the platform terms to continue.');
      return;
    }

    try {
      await signup({ name, email, password, targetRole });
      navigate('/dashboard', { replace: true });
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Side: Branding (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-emerald-600 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500 rounded-full opacity-40 blur-xl" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-emerald-700 rounded-full opacity-40 blur-2xl" />

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

          <div className="relative z-10 space-y-6 my-auto py-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Start your mock interview journey today.
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed max-w-sm">
              Create your account in seconds. Test real questions from industry rubrics and track your
              progress across multiple technical tracks.
            </p>
            <div className="space-y-3 pt-2 text-xs text-emerald-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Simulated college placement assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Zero backend server installation needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Private local browser session storage</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-emerald-200 border-t border-emerald-500/40 pt-4">
            College Major Project Demonstration • Student Prototype
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-lg shadow-slate-200/50">
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-4 hover:underline">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Create Candidate Account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Configure your candidate profile to begin practicing mock interviews.
              </p>
            </div>

            {(error || validationError) && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>

              <Select
                label="Target Career Track"
                name="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                options={roleOptions}
              />

              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1 select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  I understand this is a simulated demo platform for academic evaluation purposes.
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                icon={<UserPlus className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
