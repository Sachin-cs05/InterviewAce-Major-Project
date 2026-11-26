import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
  X,
  RotateCcw,
  Award,
  BarChart3,
  Calendar,
  Building,
  Phone,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Badge from '../components/common/Badge';
import Toast from '../components/common/Toast';
import Modal from '../components/common/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { getScoreTextColor } from '../utils/formatters';

const DEFAULT_PROFILE = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 234-5678',
  targetRole: 'Frontend Developer',
  experienceLevel: 'Student / Fresher',
  companyType: 'Product MNC',
  college: 'State Institute of Technology',
  degree: 'B.Tech in Computer Science & Engineering',
  graduationYear: '2026',
  bio: 'Final-year Computer Science undergraduate passionate about building scalable, high-performance web applications with React and Tailwind CSS. Actively preparing for full-time frontend and software engineering campus drives.',
  skills: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'HTML/CSS', 'TypeScript', 'SQL', 'Git'],
};

/**
 * Candidate Profile Page (White & Emerald Theme)
 */
export default function ProfilePage() {
  const { user } = useAuthStore();

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewace-profile');
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return {
      ...DEFAULT_PROFILE,
      name: user?.name || DEFAULT_PROFILE.name,
      email: user?.email || DEFAULT_PROFILE.email,
      targetRole: user?.targetRole || DEFAULT_PROFILE.targetRole,
    };
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Derived interview metrics from history
  const [stats, setStats] = useState({ total: 0, average: 0, best: 0 });

  useEffect(() => {
    try {
      const historyRaw = localStorage.getItem('interviewace-history');
      if (historyRaw) {
        const history = JSON.parse(historyRaw);
        if (Array.isArray(history) && history.length > 0) {
          const sum = history.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
          setStats({
            total: history.length,
            average: Math.round(sum / history.length),
            best: Math.max(...history.map((h) => h.overallScore || 0)),
          });
        }
      }
    } catch {
      // default 0
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (profile.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill('');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      try {
        localStorage.setItem('interviewace-profile', JSON.stringify(profile));
        // Update user state in auth store if available
        if (useAuthStore.getState().user) {
          useAuthStore.setState((state) => ({
            user: {
              ...state.user,
              name: profile.name,
              email: profile.email,
              targetRole: profile.targetRole,
            },
          }));
        }
      } catch (err) {
        console.warn('Failed to save profile:', err);
      }
      setIsSaving(false);
      setToastMessage('Profile changes saved successfully!');
    }, 400);
  };

  const handleResetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    try {
      localStorage.setItem('interviewace-profile', JSON.stringify(DEFAULT_PROFILE));
    } catch (e) {
      console.warn(e);
    }
    setShowResetModal(false);
    setToastMessage('Profile reset to default demo candidate.');
  };

  const initials = (profile.name || 'Candidate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
          duration={3500}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Candidate Profile</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Manage your personal details, target career role, and skills used to personalize interview questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowResetModal(true)}>
            <RotateCcw className="w-4 h-4 mr-1.5 text-slate-500" />
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Profile Overview Banner */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                <Badge variant="emerald" size="sm">
                  {profile.targetRole}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">{profile.email}</p>
              <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                <span>{profile.college}</span>
                <span>•</span>
                <span>Class of {profile.graduationYear}</span>
              </p>
            </div>
          </div>

          {/* Quick stats badge group */}
          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="p-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total || 4}</p>
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</p>
              <p className={`text-xl font-bold mt-0.5 ${getScoreTextColor(stats.average || 85)}`}>
                {stats.average || 85}%
              </p>
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Score</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">{stats.best || 92}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Career Information */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-lg">Personal & Career Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="e.g. alex@example.com"
              required
            />

            <Select
              label="Target Career Track / Role"
              name="targetRole"
              value={profile.targetRole}
              onChange={handleChange}
              options={[
                { value: 'Frontend Developer', label: 'Frontend Developer (React, Next.js)' },
                { value: 'Backend Developer', label: 'Backend Developer (Node.js, Express)' },
                { value: 'Full Stack MERN', label: 'Full Stack MERN Developer' },
                { value: 'SDE-1', label: 'Software Development Engineer 1 (SDE-1)' },
                { value: 'Data Analyst', label: 'Data Analyst / Python SQL' },
                { value: 'HR Trainee', label: 'HR Trainee / Campus Placement' },
              ]}
            />

            <Select
              label="Experience Level"
              name="experienceLevel"
              value={profile.experienceLevel}
              onChange={handleChange}
              options={[
                { value: 'Student / Fresher', label: 'Student / Fresher (Class of 2026)' },
                { value: '0-1 Years', label: '0-1 Years (Entry Level)' },
                { value: '1-3 Years', label: '1-3 Years (Junior / Associate)' },
                { value: '3+ Years', label: '3+ Years (Mid Level)' },
              ]}
            />

            <Select
              label="Target Company Type"
              name="companyType"
              value={profile.companyType}
              onChange={handleChange}
              options={[
                { value: 'Product MNC', label: 'Product MNC (Microsoft, Adobe, Oracle)' },
                { value: 'Tech Startup', label: 'High-Growth Tech Startup' },
                { value: 'Tier-1 Tech', label: 'FAANG / Tier-1 Tech Giants' },
                { value: 'Service-based IT', label: 'IT Services & Consulting' },
              ]}
            />

            <Input
              label="Contact Phone (Optional)"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </Card>

        {/* Academic Information */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-lg">Academic Background</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <Input
                label="College / University"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="e.g. State Institute of Technology"
              />
            </div>

            <div>
              <Input
                label="Graduation Year"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2026"
              />
            </div>

            <div className="md:col-span-3">
              <Input
                label="Degree & Specialization"
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science and Engineering"
              />
            </div>
          </div>
        </Card>

        {/* Technical Skills Tag Manager */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-lg">Key Skills & Technologies</h3>
            </div>
            <span className="text-xs text-slate-400">
              {profile.skills.length} skills listed
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Add skills you want the AI Interviewer to incorporate into your technical mock interview sessions.
          </p>

          {/* Skill Tag Chips */}
          <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-slate-50/80 rounded-xl border border-slate-200">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-emerald-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <span className="text-xs text-slate-400 italic">No skills added yet. Type below to add.</span>
            )}
          </div>

          {/* Add skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a skill (e.g. Docker, GraphQL, MongoDB) and press Enter"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>
        </Card>

        {/* Career Objective / Bio */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-lg">Candidate Bio & Placement Goals</h3>
          </div>

          <Textarea
            label="About Candidate"
            name="bio"
            rows={4}
            value={profile.bio}
            onChange={handleChange}
            placeholder="Describe your background, key strengths, and target placement objectives..."
          />
        </Card>

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => setShowResetModal(true)}>
            Reset Defaults
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Profile Changes
          </Button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Profile to Defaults"
        description="Are you sure you want to reset your profile details to the original demo student profile? All customized skills and background text will be replaced."
      >
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetProfile}>
            Confirm Reset
          </Button>
        </div>
      </Modal>
    </div>
  );
}
