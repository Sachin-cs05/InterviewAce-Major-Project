import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  ArrowRight,
  Play,
  FileText,
  Mic,
  Award,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Activity,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';

/**
 * Public Landing Page Component
 * Showcases the AI Mock Interview platform with interactive CTAs,
 * simulated live interview preview, and 3-step walkthrough.
 */
export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, demoLogin, isLoading } = useAuthStore();

  const handleDemoLaunch = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch {
      // Handled in store
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Background Ambience & Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-indigo-500/10 blur-[140px] pointer-events-none -z-10" />

      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/75 border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo with Icon */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="AI Interviewer Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/25 border border-indigo-400/30 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  AI Interviewer
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 rounded-full">
                  v1.0
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Major Project Prototype
              </span>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 flex flex-col items-center">
        {/* Project Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium shadow-inner shadow-indigo-500/10 mb-8 animate-fadeIn">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <span>Intelligent Mock Interviews with Instant Voice Feedback</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white text-center max-w-4xl leading-[1.1] mb-6">
          Master Your Next Tech Interview with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Real-Time AI
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-slate-400 text-center max-w-2xl leading-relaxed mb-10">
          Simulate high-stakes technical and behavioral rounds with realistic two-way voice AI.
          Get instant, rubric-backed scoring, resume-specific questioning, and personalized gap
          analysis.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
            onClick={() => navigate('/signup')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Start Free Mock Interview
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-6 border-slate-700 bg-slate-900 hover:bg-slate-800"
            isLoading={isLoading}
            onClick={handleDemoLaunch}
            icon={<Play className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />}
          >
            Try Live Demo
          </Button>
        </div>

        {/* Trust & Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl w-full mb-20 text-center">
          <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">500+</div>
            <div className="text-xs text-slate-400 mt-0.5">Role-Specific Questions</div>
          </div>
          <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-indigo-400 tracking-tight">&lt; 1.2s</div>
            <div className="text-xs text-slate-400 mt-0.5">Voice Response Latency</div>
          </div>
          <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">4-Point</div>
            <div className="text-xs text-slate-400 mt-0.5">Granular Rubric Scoring</div>
          </div>
          <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-violet-400 tracking-tight">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Student Viva Ready</div>
          </div>
        </div>

        {/* ==================== MOCK UI PREVIEW CARD ==================== */}
        <div className="w-full max-w-4xl relative group mb-28">
          {/* Subtle Outer Neon Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

          {/* Main Card Frame */}
          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Window Titlebar */}
            <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs text-slate-400 font-mono flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  ai-interview-session_sde1_react.log
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
                  Live Voice Simulation
                </span>
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header with AI Avatar & Waveform */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      AI Lead Technical Interviewer
                      <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 rounded font-normal">
                        Speaking
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Assessing: React Internals & Architecture</p>
                  </div>
                </div>

                {/* Simulated Audio Waveform */}
                <div className="flex items-center gap-1.5 h-8 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="w-1 bg-indigo-500 rounded-full h-3 animate-pulse" />
                  <span className="w-1 bg-indigo-400 rounded-full h-6 animate-pulse" />
                  <span className="w-1 bg-violet-400 rounded-full h-4 animate-pulse" />
                  <span className="w-1 bg-violet-500 rounded-full h-7 animate-pulse" />
                  <span className="w-1 bg-indigo-500 rounded-full h-5 animate-pulse" />
                  <span className="w-1 bg-indigo-300 rounded-full h-2 animate-pulse" />
                  <span className="w-1 bg-violet-400 rounded-full h-6 animate-pulse" />
                  <span className="w-1 bg-violet-600 rounded-full h-3 animate-pulse" />
                  <span className="text-[11px] font-mono text-indigo-300 ml-2">24.5 kHz</span>
                </div>
              </div>

              {/* Transcript Preview */}
              <div className="space-y-4 text-xs sm:text-sm">
                {/* AI Question */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl rounded-tl-sm text-slate-300 leading-relaxed max-w-2xl">
                    <span className="font-semibold text-indigo-400 block mb-1 text-xs">
                      AI Interviewer (02:14):
                    </span>
                    "Can you explain how React's reconciliation algorithm operates under the hood,
                    and how keys prevent unnecessary DOM re-renders during list modifications?"
                  </div>
                </div>

                {/* Candidate Answer */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-2xl rounded-tr-sm text-slate-200 leading-relaxed max-w-2xl">
                    <span className="font-semibold text-violet-300 block mb-1 text-xs">
                      Candidate — Alex Johnson (Voice Transcript):
                    </span>
                    "React uses the Fiber reconciler with a heuristic O(n) algorithm. It assumes
                    different component types produce different trees, and uses keys as unique
                    identifiers across renders to match children efficiently rather than mutating
                    every DOM node."
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-violet-300">AJ</span>
                  </div>
                </div>
              </div>

              {/* Real-time Metric & Score Badge */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Live Rubric Assessment</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>92% Technical Accuracy</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-semibold text-xs">
                    <Award className="w-3.5 h-3.5" />
                    <span>88% Communication Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3-STEP "HOW IT WORKS" GRID ==================== */}
        <section className="w-full max-w-6xl mb-24">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Streamlined Preparation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              How InterviewAce Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
              Three seamless steps designed to take you from initial preparation to interview
              mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                  01
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                1. Upload Resume & Select Role
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose your targeted track (SDE-1, Frontend, Backend, Full Stack) and upload your
                resume to generate personalized, contextual technical questions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                  02
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                2. Live Voice & Code AI Interview
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Engage in natural, low-latency audio dialogue with the AI. Solve coding challenges
                and answer follow-up technical probing questions in real time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                  03
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                3. Detailed Scorecard & Improvements
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive an instant rubric breakdown across Technical Accuracy, Communication, and
                Problem Solving, complete with actionable advice to close skill gaps.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <div className="w-full max-w-4xl p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-violet-900/40 border border-indigo-500/30 text-center flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-indigo-400 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Ace Your Next Technical Interview?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mb-6">
            Practice for free today or launch the instant demo to experience the AI mock interview
            session.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/signup')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Get Started Now
            </Button>
            <Button
              variant="secondary"
              size="md"
              isLoading={isLoading}
              onClick={handleDemoLaunch}
            >
              Launch Quick Demo
            </Button>
          </div>
        </div>
      </main>

      {/* ==================== MINIMAL FOOTER ==================== */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">AI Mock Interview Agent</span>
            <span>•</span>
            <span>Built for CS Major Project</span>
          </div>
          <div className="text-slate-400">
            Powered by React, Tailwind CSS, Web Speech API & Zustand
          </div>
        </div>
      </footer>
    </div>
  );
}
