import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Target,
  Code2,
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { createInterviewSession } from '../services/interviewService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Toast from '../components/common/Toast';
import Loader from '../components/common/Loader';

/**
 * InterviewSetup Page - Step-by-step configuration wizard for mock interview parameters.
 * Assigned to: Member 3
 * 
 * Features:
 * - Target Role selection (predefined or custom)
 * - Interview Type cards (Technical, Behavioral, System Design, DSA)
 * - Difficulty & Question Count selectors
 * - Interactive Tech Stack tag input with suggestions
 * - Drag-and-drop Resume uploader with validation
 * - Saves config to Zustand store and navigates to Device Check
 */
export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const { setSessionConfig, startInterview } = useInterviewStore();

  // Form State
  const [role, setRole] = useState('SDE-1');
  const [customRole, setCustomRole] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [techStack, setTechStack] = useState(['JavaScript', 'React']);
  const [techInput, setTechInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const fileInputRef = useRef(null);

  // Predefined role options
  const roleOptions = [
    'SDE-1',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack MERN',
    'Data Analyst',
    'Custom Role',
  ];

  // Interview type cards
  const interviewTypes = [
    { value: 'Technical', icon: Code2, label: 'Technical', desc: 'Coding & system architecture' },
    { value: 'Behavioral', icon: Briefcase, label: 'Behavioral / HR', desc: 'Culture fit & soft skills' },
    { value: 'System Design', icon: Target, label: 'System Design', desc: 'Scalable architecture design' },
    { value: 'DSA', icon: Sparkles, label: 'DSA & Problem Solving', desc: 'Algorithms & data structures' },
  ];

  // Difficulty levels
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  // Question count options
  const questionCounts = [3, 5, 8];

  // Suggested tech stack tags
  const suggestedTechs = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Express',
    'MongoDB',
    'SQL',
    'Python',
    'Java',
    'AWS',
    'Docker',
    'Git',
  ];

  /**
   * Add a tech tag to the stack (avoid duplicates)
   */
  const addTechTag = (tech) => {
    const trimmed = tech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setTechInput('');
    }
  };

  /**
   * Remove a tech tag from the stack
   */
  const removeTechTag = (tech) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  /**
   * Handle Enter key press in tech input
   */
  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      addTechTag(techInput);
    }
  };

  /**
   * Validate resume file (PDF only, max 5MB)
   */
  const validateResumeFile = (file) => {
    if (!file) return { valid: false, error: 'No file selected' };

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF files are allowed' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    return { valid: true };
  };

  /**
   * Handle file selection via input or drag-and-drop
   */
  const handleFileSelect = (file) => {
    const validation = validateResumeFile(file);

    if (!validation.valid) {
      setToast({ message: validation.error, type: 'error' });
      return;
    }

    setResumeFile(file);
    setToast({ message: 'Resume uploaded successfully!', type: 'success' });
  };

  /**
   * Drag-and-drop handlers
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Remove uploaded resume
   */
  const removeResume = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Form validation before submission
   */
  const validateForm = () => {
    const finalRole = role === 'Custom Role' ? customRole.trim() : role;

    if (!finalRole) {
      setToast({ message: 'Please select or enter a target role', type: 'error' });
      return false;
    }

    if (techStack.length === 0) {
      setToast({ message: 'Please add at least one technology to your tech stack', type: 'error' });
      return false;
    }

    return true;
  };

  /**
   * Submit form and navigate to Device Check
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const finalRole = role === 'Custom Role' ? customRole.trim() : role;

      // Build configuration object
      const config = {
        role: finalRole,
        difficulty,
        interviewType,
        techStack,
        resumeFileName: resumeFile?.name || '',
        totalQuestions,
      };

      // Save to Zustand store
      setSessionConfig(config);

      // Create interview session via API
      const sessionData = await createInterviewSession(config, resumeFile);

      // Initialize interview state
      startInterview(sessionData);

      setToast({ message: 'Interview setup complete! Redirecting...', type: 'success' });

      // Navigate to device check after a short delay
      setTimeout(() => {
        navigate('/device-check');
      }, 1000);
    } catch (error) {
      console.error('[InterviewSetup] Session creation failed:', error);
      setToast({ message: 'Failed to create interview session. Please try again.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notifications */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'info' })}
        />
      )}

      {/* Loading Overlay */}
      {isSubmitting && <Loader fullScreen text="Setting up your interview..." />}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interview Setup Wizard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Configure Your Mock Interview
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Customize your AI interview experience by selecting your target role, difficulty, and tech stack.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
          {/* Target Role */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Target Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {roleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    role === option
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {role === 'Custom Role' && (
              <Input
                placeholder="Enter your target role (e.g., DevOps Engineer)"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="mt-3"
              />
            )}
          </div>

          {/* Interview Type */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Target className="w-4 h-4 text-indigo-400" />
              Interview Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interviewTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setInterviewType(type.value)}
                  className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all border ${
                    interviewType === type.value
                      ? 'bg-indigo-600/20 border-indigo-500'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <type.icon
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      interviewType === type.value ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        interviewType === type.value ? 'text-indigo-300' : 'text-slate-200'
                      }`}
                    >
                      {type.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{type.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Target className="w-4 h-4 text-indigo-400" />
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {difficultyLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      difficulty === level
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Number of Questions
              </label>
              <div className="flex gap-2">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTotalQuestions(count)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      totalQuestions === count
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Tech Stack
            </label>

            {/* Selected Tags */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechTag(tech)}
                      className="hover:text-indigo-100 transition-colors"
                      aria-label={`Remove ${tech}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tech Input */}
            <Input
              placeholder="Type a technology and press Enter..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleTechInputKeyDown}
              icon={<Plus className="w-4 h-4" />}
            />

            {/* Suggested Tags */}
            <div className="flex flex-wrap gap-2">
              {suggestedTechs
                .filter((tech) => !techStack.includes(tech))
                .slice(0, 8)
                .map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addTechTag(tech)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-400 text-xs font-medium hover:border-indigo-500/50 hover:text-indigo-300 transition-all"
                  >
                    + {tech}
                  </button>
                ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <FileText className="w-4 h-4 text-indigo-400" />
              Upload Resume (Optional)
            </label>

            {!resumeFile ? (
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-medium text-slate-300 mb-1">
                  Drag & drop your resume here, or click to browse
                </p>
                <p className="text-xs text-slate-500">PDF only, max 5MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-600/20">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{resumeFile.name}</p>
                    <p className="text-xs text-slate-400">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeResume}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  aria-label="Remove resume"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              fullWidth
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Continue to Device Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
