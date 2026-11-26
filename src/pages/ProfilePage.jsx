import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Save,
  Plus,
  X,
  RotateCcw,
  Briefcase,
  AlertCircle,
  Lock,
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
import { getUserInterviewHistory } from '../utils/userStorage';

const DEFAULT_EXTRAS = {
  phone: '+1 (555) 234-5678',
  companyType: 'Product MNC',
  college: 'State Institute of Technology',
  degree: 'B.Tech in Computer Science & Engineering',
  graduationYear: '2026',
  bio: 'Final-year Computer Science undergraduate passionate about building scalable web applications. Actively preparing for campus placements and technical interviews.',
};

/**
 * Candidate Profile Page (White & Emerald Theme)
 * Synchronizes candidate details with MongoDB via PATCH /api/users/me.
 */
export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuthStore();

  // Local state initialized from user or fallback
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@example.com',
    targetRole: user?.targetRole || 'Frontend Developer',
    experience: user?.experience || 'Student / Fresher',
    skills: user?.skills && user.skills.length > 0
      ? user.skills
      : ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'SQL', 'Git'],
    education: user?.education || 'B.Tech Computer Science (2026)',
    // Supplementary client-side presentation attributes
    ...DEFAULT_EXTRAS,
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Derived user-isolated interview metrics
  const [stats, setStats] = useState({ total: 0, average: 0, best: 0 });

  // Sync state if user changes in store
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        targetRole: user.targetRole || prev.targetRole,
        experience: user.experience || prev.experience,
        skills: user.skills && user.skills.length > 0 ? user.skills : prev.skills,
        education: user.education || prev.education,
      }));
    }
  }, [user]);

  // Load user-isolated history stats
  useEffect(() => {
    const history = getUserInterviewHistory(user?.id);
    if (Array.isArray(history) && history.length > 0) {
      const sum = history.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      setStats({
        total: history.length,
        average: Math.round(sum / history.length),
        best: Math.max(...history.map((h) => h.overallScore || 0)),
      });
    } else {
      setStats({ total: 0, average: 0, best: 0 });
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSaving(true);

    try {
      // Send only fields accepted by backend updateProfileSchema
      await updateProfile({
        name: formData.name.trim(),
        targetRole: formData.targetRole.trim(),
        experience: formData.experience.trim(),
        skills: formData.skills,
        education: formData.education.trim(),
      });

      // Save supplementary presentation details to localStorage
      try {
        localStorage.setItem(`interviewace-profile-extra-${user?.id}`, JSON.stringify({
          phone: formData.phone,
          companyType: formData.companyType,
          college: formData.college,
          degree: formData.degree,
          graduationYear: formData.graduationYear,
          bio: formData.bio,
        }));
      } catch (e) {
        // Safe fallback
      }

      setToastMessage('Profile updated successfully in database!');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetProfile = () => {
    setFormData((prev) => ({
      ...prev,
      targetRole: 'Frontend Developer',
      experience: 'Student / Fresher',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'SQL', 'Git'],
      education: 'B.Tech Computer Science (2026)',
      ...DEFAULT_EXTRAS,
    }));
    setShowResetModal(false);
    setToastMessage('Profile reset to default values. Click Save to persist.');
  };

  const initials = (formData.name || 'Candidate')
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
          <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving || isLoading}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Overview Banner */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{formData.name}</h2>
                <Badge variant="emerald" size="sm">
                  {formData.targetRole}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">{formData.email}</p>
              <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                <span>{formData.education}</span>
                <span>•</span>
                <span>{formData.experience}</span>
              </p>
            </div>
          </div>

          {/* User-isolated interview statistics */}
          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="p-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</p>
              <p className={`text-xl font-bold mt-0.5 ${getScoreTextColor(stats.average || 0)}`}>
                {stats.average > 0 ? `${stats.average}%` : '—'}
              </p>
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Score</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">
                {stats.best > 0 ? `${stats.best}%` : '—'}
              </p>
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
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>Email Address</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> (read-only)
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full py-2 px-3.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed select-none"
              />
            </div>

            <Select
              label="Target Career Track / Role"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              options={[
                { value: 'Software Engineer', label: 'Software Engineer' },
                { value: 'Frontend Developer', label: 'Frontend Developer (React, Tailwind)' },
                { value: 'Backend Developer', label: 'Backend Developer (Node.js, Express)' },
                { value: 'Full Stack MERN', label: 'Full Stack MERN Developer' },
                { value: 'Data Analyst', label: 'Data Analyst / Python SQL' },
                { value: 'HR Trainee', label: 'HR Trainee / Campus Placement' },
              ]}
            />

            <Select
              label="Experience Level"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              options={[
                { value: 'Student / Fresher', label: 'Student / Fresher (Class of 2026)' },
                { value: '0-1 Years', label: '0-1 Years (Entry Level)' },
                { value: '1-3 Years', label: '1-3 Years (Junior / Associate)' },
                { value: '3+ Years', label: '3+ Years (Mid Level)' },
              ]}
            />

            <div className="md:col-span-2">
              <Input
                label="Education / Degree Summary"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science and Engineering (2026)"
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
              {formData.skills.length} skills listed
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Skills are synchronized with your profile to personalize technical questions during mock interviews.
          </p>

          {/* Skill Tag Chips */}
          <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-slate-50/80 rounded-xl border border-slate-200">
            {formData.skills.map((skill) => (
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
            {formData.skills.length === 0 && (
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

        {/* Action Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => setShowResetModal(true)}>
            Reset Defaults
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving || isLoading}>
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
        description="Are you sure you want to reset your profile details to the original default values? You must click 'Save Profile Changes' afterwards to save to the database."
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
