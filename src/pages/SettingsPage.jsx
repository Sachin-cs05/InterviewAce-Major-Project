import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Volume2,
  Sliders,
  Database,
  Trash2,
  Download,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Play,
  ShieldAlert,
  Save,
  HelpCircle,
  FileText,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { useAuthStore } from '../store/useAuthStore';

const DEFAULT_SETTINGS = {
  voiceEnabled: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  defaultTrack: 'Technical',
  defaultDifficulty: 'Medium',
  defaultQuestionCount: 5,
  proctoringAlerts: true,
  cameraDefaultOn: true,
  microphoneDefaultOn: true,
};

/**
 * Settings & Preferences Page (White & Emerald Theme)
 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewace-settings');
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [showResetAppModal, setShowResetAppModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    try {
      const hist = localStorage.getItem('interviewace-history');
      if (hist) {
        const parsed = JSON.parse(hist);
        if (Array.isArray(parsed)) {
          setHistoryCount(parsed.length);
        }
      }
    } catch {
      setHistoryCount(0);
    }
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('interviewace-settings', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    setToastMessage('Preference updated successfully');
  };

  const handleChange = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem('interviewace-settings', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    setToastMessage('Preference saved');
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
    utterance.rate = Number(settings.speechRate) || 1.0;
    utterance.pitch = Number(settings.speechPitch) || 1.0;

    utterance.onend = () => {
      setIsTestingVoice(false);
    };

    utterance.onerror = () => {
      setIsTestingVoice(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Clear only interview history records
  const handleClearHistory = () => {
    try {
      localStorage.removeItem('interviewace-history');
      localStorage.removeItem('interviewace-last-result');
      // Clear individual report keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('interviewace-report-')) {
          localStorage.removeItem(key);
        }
      }
      setHistoryCount(0);
    } catch (e) {
      console.warn(e);
    }
    setShowClearHistoryModal(false);
    setToastMessage('All interview history records cleared.');
  };

  // Reset entire application to fresh demo state
  const handleResetEntireApp = () => {
    try {
      localStorage.removeItem('interviewace-history');
      localStorage.removeItem('interviewace-last-result');
      localStorage.removeItem('interviewace-settings');
      localStorage.removeItem('interviewace-profile');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('interviewace-report-')) {
          localStorage.removeItem(key);
        }
      }
      setSettings(DEFAULT_SETTINGS);
      setHistoryCount(0);
    } catch (e) {
      console.warn(e);
    }
    setShowResetAppModal(false);
    setToastMessage('All demo data and preferences reset to initial state.');
  };

  // Export full JSON bundle
  const handleExportAllData = () => {
    const bundle = {
      user,
      settings,
      history: JSON.parse(localStorage.getItem('interviewace-history') || '[]'),
      profile: JSON.parse(localStorage.getItem('interviewace-profile') || '{}'),
      exportedAt: new Date().toISOString(),
      platform: 'InterviewAce Web Application',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `interviewace-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Confirm logout
  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
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
          Configure AI interviewer voice speech, default session parameters, proctoring warnings, and storage.
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
              <p className="text-xs text-slate-500">Browser SpeechSynthesis configuration for question reading</p>
            </div>
          </div>
          <Badge variant={settings.voiceEnabled ? 'emerald' : 'slate'} size="sm">
            {settings.voiceEnabled ? 'Voice Enabled' : 'Voice Muted'}
          </Badge>
        </div>

        <div className="space-y-5">
          {/* Voice narration toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Read Questions Aloud (SpeechSynthesis)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Avatar automatically speaks new questions when they appear during mock interviews.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('voiceEnabled')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.voiceEnabled ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.voiceEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Voice rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Speaking Rate (Speed)
              </label>
              <select
                value={settings.speechRate}
                onChange={(e) => handleChange('speechRate', parseFloat(e.target.value))}
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
                value={settings.speechPitch}
                onChange={(e) => handleChange('speechPitch', parseFloat(e.target.value))}
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

      {/* Section 2: Mock Interview Session Defaults */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Default Interview Parameters</h3>
            <p className="text-xs text-slate-500">Pre-fill the Interview Setup form with your preferred options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Track
            </label>
            <select
              value={settings.defaultTrack}
              onChange={(e) => handleChange('defaultTrack', e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Technical">Technical</option>
              <option value="HR / General">HR / General</option>
              <option value="Behavioral">Behavioral (STAR)</option>
              <option value="Mixed">Mixed Comprehensive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Difficulty
            </label>
            <select
              value={settings.defaultDifficulty}
              onChange={(e) => handleChange('defaultDifficulty', e.target.value)}
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
              value={settings.defaultQuestionCount}
              onChange={(e) => handleChange('defaultQuestionCount', parseInt(e.target.value))}
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
                Display warning banners when switching browser tabs during an active mock interview.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('proctoringAlerts')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.proctoringAlerts ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                settings.proctoringAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Section 3: Data, Storage & Demo Controls */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Data Storage & Demo Controls</h3>
              <p className="text-xs text-slate-500">Local browser storage management for college presentation</p>
            </div>
          </div>
          <Badge variant="slate" size="sm">
            {historyCount} Records Saved
          </Badge>
        </div>

        <p className="text-sm text-slate-600">
          InterviewAce operates completely client-side without storing personal data on external servers. All evaluation scores, speech transcripts, and profile customizations reside inside your browser’s localStorage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleExportAllData}>
            <Download className="w-4 h-4 mr-1.5 text-slate-600" />
            Export Backup (JSON)
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowClearHistoryModal(true)}>
            <Trash2 className="w-4 h-4 mr-1.5 text-amber-600" />
            Clear History Only
          </Button>

          <Button variant="danger" size="sm" onClick={() => setShowResetAppModal(true)}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset Entire Demo Data
          </Button>
        </div>
      </Card>

      {/* Section 4: Current Account & Session */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-lg">
              {(user?.name || 'Candidate')[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{user?.name || 'Alex Johnson'}</p>
                <Badge variant="emerald" size="sm">
                  {user?.targetRole || 'Frontend Developer'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'alex.johnson@example.com'}</p>
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
        description="Are you sure you want to remove all saved interview records and scores? Your profile details and default preferences will remain intact."
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
        title="Reset All Application Data"
        description="This will clear all localStorage keys including interview records, profile settings, and custom configurations. The app will return to a pristine fresh demo state."
      >
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setShowResetAppModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetEntireApp}>
            Reset Everything
          </Button>
        </div>
      </Modal>

      {/* Modal: Logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Sign Out"
        description="Are you sure you want to log out of your current session? You can easily sign back in using 1-Click Demo Login on the login screen."
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
