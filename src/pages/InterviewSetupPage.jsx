import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Code2,
  Users,
  Target,
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { createInterviewSession } from '../services/interviewService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Badge from '../components/common/Badge';

/**
 * Modern Create Interview Configuration Wizard (White & Emerald Theme)
 */
export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionConfig, setSessionConfig, startInterview } = useInterviewStore();

  // Preselected track if routed from dashboard quick actions
  const preselectedTrack = location.state?.preselectedTrack;

  // Form State
  const [role, setRole] = useState(sessionConfig.role || 'Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [interviewType, setInterviewType] = useState(preselectedTrack || sessionConfig.interviewType || 'Technical');
  const [difficulty, setDifficulty] = useState(sessionConfig.difficulty || 'Medium');
  const [totalQuestions, setTotalQuestions] = useState(sessionConfig.totalQuestions || 5);
  const [techStack, setTechStack] = useState(sessionConfig.techStack?.length ? sessionConfig.techStack : ['JavaScript', 'React']);
  const [newTechInput, setNewTechInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  const roleOptions = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack MERN',
    'Java Developer',
    'Python Developer',
    'Data Analyst',
    'General / HR',
    'Custom Role',
  ];

  const experienceOptions = ['Fresher', '0–1 Years', '1–3 Years', '3+ Years'];

  const interviewTracks = [
    { type: 'Technical', icon: Code2, label: 'Technical', desc: 'Coding, CS fundamentals & architecture' },
    { type: 'HR', icon: Users, label: 'HR / Culture', desc: 'Introductions, soft skills & alignment' },
    { type: 'Behavioral', icon: Briefcase, label: 'Behavioral', desc: 'STAR situational problem-solving' },
    { type: 'Mixed', icon: Target, label: 'Mixed', desc: 'Blended technical and HR evaluation' },
  ];

  const suggestedSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
    'HTML/CSS', 'TypeScript', 'MongoDB', 'Docker', 'Git',
  ];

  const handleAddTech = (tech) => {
    const item = (tech || newTechInput).trim();
    if (item && !techStack.includes(item)) {
      setTechStack((prev) => [...prev, item]);
      setNewTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setTechStack((prev) => prev.filter((t) => t !== techToRemove));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Resume file size must be less than 5MB.');
        return;
      }
      setResumeFile(file);
      setErrorMsg('');
    }
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const activeRole = role === 'Custom Role' ? customRole.trim() : role;
    if (!activeRole) {
      setErrorMsg('Please specify your target job role.');
      return;
    }

    setIsSubmitting(true);

    const configPayload = {
      role: activeRole,
      experienceLevel,
      interviewType,
      difficulty,
      totalQuestions: Number(totalQuestions),
      techStack,
      jobDescription,
      resumeFileName: resumeFile?.name || '',
    };

    setSessionConfig(configPayload);

    try {
      // Mock create interview session
      const sessionData = await createInterviewSession(configPayload, resumeFile);
      startInterview(sessionData);
      navigate('/device-check');
    } catch (err) {
      setErrorMsg('Failed to initialize session. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interview Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Customize Your Mock Interview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure your targeted role, interview track, and questions to simulate a realistic interview.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Target Role & Experience */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              1. Job Role & Experience Level
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Target Job Role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={roleOptions}
                required
              />

              <Select
                label="Experience Level"
                name="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                options={experienceOptions}
              />
            </div>

            {role === 'Custom Role' && (
              <Input
                label="Enter Custom Role Title"
                placeholder="e.g. Cloud DevOps Engineer"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                required
              />
            )}
          </Card>

          {/* Section 2: Interview Track & Difficulty */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              2. Interview Track & Difficulty
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Interview Track
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interviewTracks.map((trk) => {
                  const Icon = trk.icon;
                  const isSelected = interviewType === trk.type;
                  return (
                    <button
                      type="button"
                      key={trk.type}
                      onClick={() => setInterviewType(trk.type)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mb-2 ${
                          isSelected ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{trk.label}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{trk.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Difficulty Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        difficulty === diff
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((count) => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setTotalQuestions(count)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        totalQuestions === count
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Skills & Tech Stack Chips */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              3. Target Skills & Technologies
            </h3>

            <div className="flex gap-2">
              <Input
                placeholder="Add skill or tech (e.g., React, SQL, Docker)"
                value={newTechInput}
                onChange={(e) => setNewTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddTech()}
                icon={<Plus className="w-4 h-4" />}
              >
                Add
              </Button>
            </div>

            {/* Active Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-emerald-950 p-0.5 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Suggested Tags */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase">
                Quick Suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddTech(skill)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Section 4: Optional Job Description & Resume Upload */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              4. Optional Context & Resume
            </h3>

            <Textarea
              label="Job Description / Specific Topic Focus (Optional)"
              placeholder="Paste key responsibilities or target topics you would like the interviewer to emphasize..."
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attach Resume (Simulated local file selection)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              {resumeFile ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold truncate">
                    <FileText className="w-4 h-4 shrink-0 text-emerald-700" />
                    <span className="truncate">{resumeFile.name}</span>
                    <span className="text-[10px] text-emerald-700 font-normal">
                      ({Math.round(resumeFile.size / 1024)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50"
                >
                  <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-800">Click to upload your resume (PDF/DOC)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size 5MB • Used for demo context</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Configuration Summary Card */}
        <div className="lg:col-span-4 sticky top-20">
          <Card className="space-y-5 border-emerald-200 bg-gradient-to-b from-white to-slate-50 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Session Summary</h3>
              <Badge variant="emerald">Live Preview</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-bold text-slate-900">
                  {role === 'Custom Role' ? customRole || 'Custom' : role}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Experience:</span>
                <span className="font-semibold text-slate-800">{experienceLevel}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Track:</span>
                <Badge variant="emerald">{interviewType}</Badge>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Difficulty:</span>
                <span className="font-semibold text-slate-800">{difficulty}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-bold text-slate-900">{totalQuestions} Questions</span>
              </div>

              <div className="py-1.5">
                <span className="text-slate-500 block mb-1">Focus Skills ({techStack.length}):</span>
                <div className="flex flex-wrap gap-1">
                  {techStack.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                  {techStack.length > 5 && (
                    <span className="text-[10px] text-slate-400">+{techStack.length - 5} more</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 space-y-2.5">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue to Device Check
              </Button>

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => navigate('/dashboard')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
