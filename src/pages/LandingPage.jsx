import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Placeholder component for the Public Landing Page.
 * Assigned to: Member 2
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleNext = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">AI Interviewer</span>
        </div>
        <button
          onClick={handleNext}
          className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
        </button>
      </header>

      {/* Main Hero Placeholder */}
      <main className="relative z-10 max-w-4xl w-full mx-auto text-center my-auto py-16">
        {/* Ownership Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8">
          <Bot className="w-3.5 h-3.5" />
          <span>Assigned: Member 2 (Landing Page & Marketing UI)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          Ace Your Next Technical Interview with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Powered Simulation
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Practice realistic technical and behavioral interviews with real-time speech interaction,
          instant scoring rubrics, and personalized feedback reports.
        </p>

        {/* Action Button to Next Step */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{isAuthenticated ? 'Enter Dashboard' : 'Start Practicing (Demo Sign In)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Zap className="w-5 h-5 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-white text-sm mb-1">Real-time Voice AI</h3>
            <p className="text-xs text-slate-400">Natural audio conversation with human-like interviewer latency.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <ShieldCheck className="w-5 h-5 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white text-sm mb-1">Tailored to Your Resume</h3>
            <p className="text-xs text-slate-400">Contextual questions mapped directly to your targeted tech stack.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Sparkles className="w-5 h-5 text-pink-400 mb-3" />
            <h3 className="font-semibold text-white text-sm mb-1">Granular Rubric Scoring</h3>
            <p className="text-xs text-slate-400">Actionable post-interview breakdown across 4 key dimensions.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-400 py-4 border-t border-slate-900">
        AI Mock Interview Agent • Member 1 Architecture Starter
      </footer>
    </div>
  );
}
