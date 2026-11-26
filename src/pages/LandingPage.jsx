import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  ArrowRight,
  Mic,
  Video,
  VideoOff,
  Award,
  CheckCircle2,
  ChevronDown,
  Volume2,
  Brain,
  ShieldCheck,
  History,
  Sliders,
  PlayCircle,
  FileQuestion,
  Users,
  Target,
  Code2,
  Briefcase,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

/**
 * Modern White & Emerald Landing Page Component
 * Showcases the InterviewAce platform with a live interactive React/CSS hero mockup preview.
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, demoLogin, isLoading } = useAuthStore();
  const [activeFaq, setActiveFaq] = useState(null);

  // FAQ Items
  const faqs = [
    {
      q: 'Does InterviewAce require a backend server or paid API keys?',
      a: 'No. InterviewAce is built as an entirely self-contained browser application. All simulated AI interviews, question generation, and performance grading run locally using Web APIs and structured local question banks.',
    },
    {
      q: 'Can I practice with both speech and text answers?',
      a: 'Yes! InterviewAce supports voice-based speech recognition where supported by your browser, while also providing a reliable text editor fallback so you can practice seamlessly on any device.',
    },
    {
      q: 'How does camera and microphone access work?',
      a: 'Camera and microphone streams are processed purely within your browser via navigator.mediaDevices.getUserMedia(). Video feeds are never stored or uploaded externally.',
    },
    {
      q: 'What roles and interview tracks are supported?',
      a: 'InterviewAce supports Technical, HR, Behavioral, and Mixed interview tracks across roles such as Frontend Developer, Backend Developer, Full Stack MERN, Java, Python, and Data Analyst.',
    },
    {
      q: 'How are the interview reports scored?',
      a: 'Scoring uses deterministic local evaluation rules analyzing answer completeness, relevant technical keywords, and rubric benchmarks across five key competency dimensions.',
    },
  ];

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI-Powered Interview Preparation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Practice Smarter.{' '}
                <span className="text-emerald-600 block sm:inline">
                  Interview Better.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Master your next technical, HR, and behavioral interview with realistic simulated
                voice sessions, immediate rubric scoring, and structured feedback — tailored specifically
                for college students and fresh graduates.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={handleStart}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Start Mock Interview
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDemo}
                  isLoading={isLoading}
                >
                  Quick Demo Login
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free & Local</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No API Keys Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Camera & Voice Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Mockup Component Preview */}
            <div className="lg:col-span-5 relative">
              {/* Subtle emerald ambient backdrop */}
              <div className="absolute -inset-4 bg-emerald-100/50 rounded-3xl blur-2xl pointer-events-none -z-10" />

              {/* Mock Video Meeting Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-200/60">
                {/* Meeting Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-semibold text-slate-800">Live Interview Session</span>
                  </div>
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-semibold">
                    05:42
                  </span>
                </div>

                {/* Video Splits */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* AI Interviewer Avatar Card */}
                  <div className="relative bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center min-h-[150px] text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100 animate-pulse-slow">
                      <Bot className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-2">Ace</span>
                    <span className="text-[10px] text-emerald-700 font-medium">AI Interviewer</span>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="w-1 h-3 bg-emerald-500 rounded-full animate-wave-bar" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-5 bg-emerald-600 rounded-full animate-wave-bar" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-wave-bar" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>

                  {/* Candidate Feed Placeholder */}
                  <div className="relative bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center min-h-[150px] text-center text-white">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm mb-1">
                      You
                    </div>
                    <span className="text-xs font-semibold">Candidate (Live)</span>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 text-[10px] text-emerald-400 font-mono">
                      <Mic className="w-3 h-3 text-emerald-400" /> Active
                    </div>
                  </div>
                </div>

                {/* Simulated Question Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-3 text-left">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Question 1 of 5</span>
                    <span className="text-emerald-700 font-mono">Technical Core</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 line-clamp-2">
                    "How does the JavaScript event loop handle asynchronous tasks, and how do microtasks prioritize over macrotasks?"
                  </p>
                </div>

                {/* Quick Controls Bar */}
                <div className="flex items-center justify-between pt-1 text-slate-600 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Mic className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                    <span className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                    <span className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs">
                    Next Question
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="emerald" className="mb-3">
            Key Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Nail Your Interview
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Designed to simulate realistic campus placement and off-campus recruitment scenarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
            {/* Feature 1 */}
            <Card hover className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Mock Interviews</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Interactive real-time interview simulations with audio playback and an animated AI
                interviewer responding to your pace.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hover className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <FileQuestion className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Personalized Questions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Questions customized to your target job role, experience level, tech stack, and difficulty
                preferences from a curated question bank.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hover className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Voice & Speech Support</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Practice answering verbally using browser speech recognition, or effortlessly switch to
                text answers whenever preferred.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hover className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Camera & Device Diagnostics</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pre-flight checklist verifying webcam visibility, audio input sensitivity, and browser
                compatibility before your session starts.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card hover className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Detailed Performance Feedback</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Comprehensive scorecards broken down by technical accuracy, problem solving, answer
                relevance, and actionable tips.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card hover className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interview History & Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review past transcripts, score progression charts, and previous answer reviews stored
                safely in your local browser storage.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="emerald" className="mb-3">
            Simple 4-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How InterviewAce Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Go from zero to interview-ready in minutes with zero setup friction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                1
              </span>
              <h4 className="text-base font-bold text-slate-900">Create Your Profile</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign in with demo credentials or register your candidate profile with target job roles.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                2
              </span>
              <h4 className="text-base font-bold text-slate-900">Configure Interview</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your track (Technical, HR, Behavioral), difficulty level, and number of questions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                3
              </span>
              <h4 className="text-base font-bold text-slate-900">Practice Live Session</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Listen to Ace read questions aloud, speak or type your answers, and manage media controls.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                4
              </span>
              <h4 className="text-base font-bold text-slate-900">Review Feedback</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Examine score breakdowns, benchmark answers, question reviews, and print reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRACKS SECTION --- */}
      <section id="tracks" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="emerald" className="mb-3">
            Comprehensive Coverage
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Interview Tracks
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Target the exact style of assessment you will face in campus and company rounds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
            <Card hover className="border-t-4 border-t-emerald-600">
              <Code2 className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-base">Technical Interview</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Core engineering concepts, JavaScript, React, Java, Python, SQL, OOP, and system design.
              </p>
            </Card>

            <Card hover className="border-t-4 border-t-emerald-600">
              <Users className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-base">HR & Culture Fit</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Introduction, motivation, career ambitions, strengths, and interpersonal self-assessment.
              </p>
            </Card>

            <Card hover className="border-t-4 border-t-emerald-600">
              <Briefcase className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-base">Behavioral (STAR)</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Conflict resolution, leadership under pressure, deadline ownership, and teamwork stories.
              </p>
            </Card>

            <Card hover className="border-t-4 border-t-emerald-600">
              <Target className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-base">Mixed Track</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                A blended interview combining coding logic, CS theory, and behavioral communication tests.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="emerald" className="mb-3">
            Questions & Answers
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm mt-3 mb-10">
            Everything you need to know about InterviewAce major project demonstration.
          </p>

          <div className="space-y-3 text-left">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 text-left font-semibold text-slate-800 text-sm cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-16 bg-emerald-50 border-t border-emerald-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Ready to Ace Your Next College Interview?
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Join hundreds of fellow students practicing with InterviewAce. Zero setup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={handleStart}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
            >
              Meet the Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
