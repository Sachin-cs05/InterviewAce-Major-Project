import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sliders, Upload, ArrowRight, Check } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { createInterviewSession } from '../services/interviewService';

/**
 * Placeholder component for Interview Configuration & Setup.
 * Assigned to: Member 3
 */
export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const { sessionConfig, setSessionConfig, startInterview } = useInterviewStore();
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(sessionConfig.role || 'SDE-1');
  const [difficulty, setDifficulty] = useState(sessionConfig.difficulty || 'Medium');
  const [interviewType, setInterviewType] = useState(sessionConfig.interviewType || 'Technical');
  const [resumeFileName, setResumeFileName] = useState(sessionConfig.resumeFileName || 'Resume.pdf');

  const handleProceed = async () => {
    setLoading(true);
    const updatedConfig = {
      role,
      difficulty,
      interviewType,
      techStack: ['JavaScript', 'React', 'Tailwind CSS', 'Node.js'],
      resumeFileName,
      totalQuestions: 5,
    };

    setSessionConfig(updatedConfig);

    try {
      // Call mock interview service contract
      const sessionData = await createInterviewSession(updatedConfig);
      startInterview(sessionData);
      navigate('/device-check');
    } catch (err) {
      console.error('Session creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
          <Bot className="w-3.5 h-3.5" />
          <span>Assigned: Member 3 (Setup & Configuration)</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Configure Your Mock Interview</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize role parameters, difficulty, and upload your resume for tailored technical questions.
        </p>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Target Job Role</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['SDE-1', 'Frontend Engineer', 'Full Stack Engineer'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 px-4 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all cursor-pointer ${
                  role === r
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{r}</span>
                {role === r && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty Tier</label>
          <div className="grid grid-cols-3 gap-3">
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`py-2.5 px-4 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  difficulty === diff
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Interview Track</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Technical', 'Behavioral', 'System Design'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInterviewType(type)}
                className={`py-2.5 px-4 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  interviewType === type
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Resume Upload Simulation */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Resume Upload (PDF)</label>
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center bg-slate-950/50 transition-colors">
            <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-medium">{resumeFileName}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Parsed skills: React, TypeScript, Node.js, Express, Tailwind CSS
            </p>
          </div>
        </div>

        {/* Action Button to Next Step */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleProceed}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Initializing Session...' : 'Proceed to Device Readiness Check'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
