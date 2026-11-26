import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  Sliders,
  Database,
  Trash2,
  Download,
  RotateCcw,
  LogOut,
  Play,
  ShieldAlert,
  KeyRound,
  AlertCircle,
  Lock,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { useAuthStore } from '../store/useAuthStore';
import { getUserInterviewHistory, saveUserInterviewHistory, getUserHistoryStorageKey } from '../utils/userStorage';

const DEFAULT_LOCAL_SETTINGS = {
  speechRate: 1.0,
  speechPitch: 1.0,
  proctoringAlerts: true,
};

/**
 * Settings & Preferences Page (White & Emerald Theme)
 * Manages user preferences via PATCH /api/users/me/preferences and password change via PATCH /api/users/me/password.
 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updatePreferences, changePassword, logout, isLoading } = useAuthStore();

  // Preferences from user model with fallbacks
  const [preferences, setPreferences] = useState({
    voiceEnabled: user?.preferences?.voiceEnabled ?? true,
    defaultInterviewType: user?.preferences?.defaultInterviewType || 'Technical',
    defaultDifficulty: user?.preferences?.defaultDifficulty || 'Medium',
    defaultQuestionCount: user?.preferences?.defaultQuestionCount || 5,
  });

  // Client speech & proctoring settings
  const [localSettings, setLocalSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewace-local-settings');
      if (stored) return { ...DEFAULT_LOCAL_SETTINGS, ...JSON.parse(stored) };
    } catch {
      // fallback
    }
    return DEFAULT_LOCAL_SETTINGS;
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [showResetAppModal, setShowResetAppModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [isSavingPref, setIsSavingPref] = useState(false);

  // Sync state when user object updates
  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        voiceEnabled: user.preferences.voiceEnabled ?? true,
        defaultInterviewType: user.preferences.defaultInterviewType || 'Technical',
        defaultDifficulty: user.preferences.defaultDifficulty || 'Medium',
        defaultQuestionCount: user.preferences.defaultQuestionCount || 5,
      });
    }
  }, [user]);

  // Read user-isolated history count
  useEffect(() => {
    const list = getUserInterviewHistory(user?.id);
    setHistoryCount(list.length);
  }, [user?.id]);

  // Handle server-synced preference changes
  const handlePreferenceChange = async (key, value) => {
    const nextPrefs = { ...preferences, [key]: value };
    setPreferences(nextPrefs);
    setIsSavingPref(true);

    try {
      await updatePreferences(nextPrefs);
      setToastMessage('Preference saved to database.');
    } catch (err) {
      setToastMessage(`Failed to save preference: ${err.message}`);
    } finally {
      setIsSavingPref(false);
    }
  };

  // Handle client-only settings
  const handleLocalSettingChange = (key, value) => {
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem('interviewace-local-settings', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    setToastMessage('Setting updated.');
  };

  // Test Web Speech API voice synthesis
  const handleTestVoice = () => {
    if (!('speechSynthesis' in window)) {
      setToastMessage('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    setIsTestingVoice(true);

    const text = "Hello! I am Ace, your AI mock interviewer. I'm ready to evaluate your technical and behavioral responses.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Number(localSettings.speechRate) || 1.0;
    utterance.pitch = Number(localSettings.speechPitch) || 1.0;

    utterance.onend = () => setIsTestingVoice(false);
    utterance.onerror = () => setIsTestingVoice(false);

    window.speechSynthesis.speak(utterance);
  };

  // Handle password change form
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      });

      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setPasswordSuccess('Password changed successfully! You will now be redirected to sign in with your new credentials.');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Clear user-isolated history records
  const handleClearHistory = () => {
    saveUserInterviewHistory(user?.id, []);
    setHistoryCount(0);
    setShowClearHistoryModal(false);
    setToastMessage('All interview history records cleared.');
  };

  // Reset demo storage
  const handleResetEntireApp = () => {
    try {
      saveUserInterviewHistory(user?.id, []);
      localStorage.removeItem(`interviewace-profile-extra-${user?.id}`);
      localStorage.removeItem('interviewace-local-settings');
      setHistoryCount(0);
    } catch (e) {
      console.warn(e);
    }
    setShowResetAppModal(false);
    setToastMessage('Local storage caches reset.');
  };

  // Export full JSON bundle
  const handleExportAllData = () => {
    const bundle = {
      user,
      preferences,
      localSettings,
      history: getUserInterviewHistory(user?.id),
      exportedAt: new Date().toISOString(),
      platform: 'InterviewAce Web Application',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `interviewace-backup-${user?.id || 'candidate'}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Confirm logout
  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
          duration={3000}
        />
      )}

      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Settings & Preferences</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Configure AI interviewer voice speech, default session parameters, proctoring warnings, and account security.
        </p>
      </div>

      {/* Section 1: AI Interviewer & Voice Playback */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Voice & Audio Output</h3>
              <p className="text-xs text-slate-500">SpeechSynthesis configuration for reading interview questions</p>
            </div>
          </div>
          <Badge variant={preferences.voiceEnabled ? 'emerald' : 'slate'} size="sm">
            {preferences.voiceEnabled ? 'Voice Enabled' : 'Voice Muted'}
          </Badge>
        </div>

        <div className="space-y-5">
          {/* Voice narration toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Read Questions Aloud (SpeechSynthesis)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                AI Interviewer automatically speaks questions when they appear during mock interviews.
              </p>
            </div>
            <button
              type="button"
              disabled={isSavingPref}
              onClick={() => handlePreferenceChange('voiceEnabled', !preferences.voiceEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                preferences.voiceEnabled ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  preferences.voiceEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Voice rate & pitch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Speaking Rate (Speed)
              </label>
              <select
                value={localSettings.speechRate}
                onChange={(e) => handleLocalSettingChange('speechRate', parseFloat(e.target.value))}
                className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value={0.8}>0.8x (Slower / Clear)</option>
                <option value={1.0}>1.0x (Standard Pace)</option>
                <option value={1.2}>1.2x (Fast / Dynamic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Voice Tone Pitch
              </label>
              <select
                value={localSettings.speechPitch}
                onChange={(e) => handleLocalSettingChange('speechPitch', parseFloat(e.target.value))}
                className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value={0.9}>Deep / Authoritative</option>
                <option value={1.0}>Natural Professional (Default)</option>
                <option value={1.1}>Friendly / Energetic</option>
              </select>
            </div>
          </div>

          {/* Test Voice button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleTestVoice}
              isLoading={isTestingVoice}
            >
              <Play className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              {isTestingVoice ? 'Speaking...' : 'Test Interviewer Voice'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Section 2: Mock Interview Session Defaults (Synced to MongoDB) */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Default Interview Parameters</h3>
            <p className="text-xs text-slate-500">Saved to MongoDB and auto-selected in interview setup</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Track
            </label>
            <select
              value={preferences.defaultInterviewType}
              onChange={(e) => handlePreferenceChange('defaultInterviewType', e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Technical">Technical</option>
              <option value="HR / General">HR / General</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Difficulty
            </label>
            <select
              value={preferences.defaultDifficulty}
              onChange={(e) => handlePreferenceChange('defaultDifficulty', e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Easy">Easy (Fundamentals)</option>
              <option value="Medium">Medium (Standard)</option>
              <option value="Hard">Hard (Deep Dive)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Questions
            </label>
            <select
              value={preferences.defaultQuestionCount}
              onChange={(e) => handlePreferenceChange('defaultQuestionCount', parseInt(e.target.value, 10))}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value={3}>3 Questions (~10 mins)</option>
              <option value={5}>5 Questions (~20 mins)</option>
              <option value={10}>10 Questions (~45 mins)</option>
            </select>
          </div>
        </div>

        {/* Proctoring toggle */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 text-sm">Tab Switch Proctoring Alerts</p>
              <p className="text-xs text-slate-500">
                Display warning notifications when navigating away from the active interview tab.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleLocalSettingChange('proctoringAlerts', !localSettings.proctoringAlerts)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              localSettings.proctoringAlerts ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                localSettings.proctoringAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Section 3: Account Security & Change Password */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Account Security & Password</h3>
            <p className="text-xs text-slate-500">Update your account password with bcrypt hashing and session invalidation</p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={passwordForm.currentPassword}
            onChange={(e) => {
              setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }));
              if (passwordError) setPasswordError('');
            }}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="New Password"
              type="password"
              placeholder="Min 8 characters"
              value={passwordForm.newPassword}
              onChange={(e) => {
                setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }));
                if (passwordError) setPasswordError('');
              }}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmNewPassword}
              onChange={(e) => {
                setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }));
                if (passwordError) setPasswordError('');
              }}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isChangingPassword}
          >
            Update Password
          </Button>
        </form>
      </Card>

      {/* Section 4: Data Storage & Session Controls */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Candidate Storage & Isolation</h3>
              <p className="text-xs text-slate-500">Interview history is isolated to your candidate account ID</p>
            </div>
          </div>
          <Badge variant="slate" size="sm">
            {historyCount} Records Saved
          </Badge>
        </div>

        <p className="text-sm text-slate-600">
          Your interview scores, feedback metrics, and transcripts are keyed specifically to your candidate ID (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{user?.id || 'demo-user'}</code>), guaranteeing privacy between multiple users.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleExportAllData}>
            <Download className="w-4 h-4 mr-1.5 text-slate-600" />
            Export Backup (JSON)
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowClearHistoryModal(true)}>
            <Trash2 className="w-4 h-4 mr-1.5 text-amber-600" />
            Clear My History Only
          </Button>

          <Button variant="danger" size="sm" onClick={() => setShowResetAppModal(true)}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset Local Storage
          </Button>
        </div>
      </Card>

      {/* Section 5: Current Account & Session */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-lg">
              {(user?.name || 'Candidate')[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{user?.name || 'Candidate'}</p>
                <Badge variant="emerald" size="sm">
                  {user?.targetRole || 'Candidate'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowLogoutModal(true)}>
            <LogOut className="w-4 h-4 mr-1.5 text-rose-500" />
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Modal: Clear History */}
      <Modal
        isOpen={showClearHistoryModal}
        onClose={() => setShowClearHistoryModal(false)}
        title="Clear Interview History"
        description="Are you sure you want to remove all saved mock interview records for your candidate profile? Your database profile and preferences will remain intact."
      >
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setShowClearHistoryModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleClearHistory}>
            Confirm Clear History
          </Button>
        </div>
      </Modal>

      {/* Modal: Reset Entire App */}
      <Modal
        isOpen={showResetAppModal}
        onClose={() => setShowResetAppModal(false)}
        title="Reset Local Browser Caches"
        description="This will clear your local browser interview history and speech settings cache. You will remain logged in."
      >
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setShowResetAppModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetEntireApp}>
            Reset Cache
          </Button>
        </div>
      </Modal>

      {/* Modal: Logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Sign Out"
        description="Are you sure you want to log out of your session? Your session cookie will be cleared from the browser."
      >
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleLogoutConfirm}>
            Sign Out
          </Button>
        </div>
      </Modal>
    </div>
  );
}
