import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

/**
 * About & Team Page Component
 * Showcases the InterviewAce major project objective, architecture, technology stack,
 * and the 5-member student development team.
 */
export default function AboutPage() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Sachin (Member 1)',
      role: 'Project Lead & Frontend Architect',
      contribution: 'Core Architecture, Routing, Zustand State Stores & Mock Engine',
      initials: 'S1',
    },
    {
      name: 'Team Member 2',
      role: 'Frontend UI/UX Specialist',
      contribution: 'Landing Page Experience, Authentication & Marketing UI',
      initials: 'M2',
    },
    {
      name: 'Team Member 3',
      role: 'Full Stack Engineer',
      contribution: 'Candidate Dashboard, Interview Setup Wizard & Question Engine',
      initials: 'M3',
    },
    {
      name: 'Team Member 4',
      role: 'Media & Streaming Specialist',
      contribution: 'Device Pre-Flight Check, Webcam Feeds & Web Speech Integration',
      initials: 'M4',
    },
    {
      name: 'Team Member 5',
      role: 'Analytics & Reporting Engineer',
      contribution: 'Deterministic Scoring Rubrics, Radar Charts & Report Generation',
      initials: 'M5',
    },
  ];

  const technologies = [
    { name: 'React 19 & Vite', desc: 'Modern component-driven frontend architecture' },
    { name: 'Tailwind CSS v4', desc: 'Custom White & Emerald Light design system' },
    { name: 'React Router v7', desc: 'Declarative, guarded routing with full history support' },
    { name: 'Zustand + Persist', desc: 'Lightweight client state with localStorage & sessionStorage' },
    { name: 'Web Speech API', desc: 'Native browser speech synthesis and recognition' },
    { name: 'getUserMedia API', desc: 'Real-time webcam preview and microphone volume meter' },
    { name: 'Recharts', desc: 'Candidate performance radar charts and score trends' },
    { name: 'Lucide React', desc: 'Clean, accessible interface iconography' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      {/* --- PAGE HEADER --- */}
      <section className="bg-white border-b border-slate-200/80 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="emerald">Academic Project Portfolio</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Interview<span className="text-emerald-600">Ace</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An intelligent mock interview simulator developed by five final-year college students
            to help candidates practice technical and HR interviews with zero server dependencies.
          </p>
        </div>
      </section>

      {/* --- PROJECT OBJECTIVE --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <Badge variant="emerald">Project Objective</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bridging the College-to-Career Placement Gap
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Many final-year students face significant interview anxiety and lack access to timely,
              actionable feedback on technical communication. Traditional mock platforms often require
              expensive recurring subscriptions, complex backend servers, or external AI API keys.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              InterviewAce solves this by providing a completely self-contained, browser-first
              mock interview environment. Students can practice role-specific technical questions,
              refine their spoken delivery using browser speech synthesis and recognition, and review
              instant rubric feedback.
            </p>
            <div className="pt-2">
              <Button onClick={() => navigate('/setup')} icon={<ArrowRight className="w-4 h-4" />}>
                Try An Interview Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/40">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">100% Private & Local</h3>
              <p className="text-xs text-slate-600 mt-1">
                Zero data sent to external servers. Audio and video streams never leave the browser.
              </p>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/40">
              <Cpu className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">Web Speech Engine</h3>
              <p className="text-xs text-slate-600 mt-1">
                Interactive real-time question voice playback and optional speech-to-text input.
              </p>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/40">
              <Layers className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">Role-Specific Banks</h3>
              <p className="text-xs text-slate-600 mt-1">
                Structured questions across SDE-1, Frontend, Backend, MERN, and HR tracks.
              </p>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/40">
              <Award className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">Instant Scorecard</h3>
              <p className="text-xs text-slate-600 mt-1">
                Deterministic performance rubrics with strengths, weaknesses, and ideal answers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* --- 5 TEAM MEMBERS --- */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="emerald" className="mb-3">
            5-Member Engineering Team
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet the Builders Behind InterviewAce
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2 mb-12">
            Developed collaboratively as our final-year college major project.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
            {teamMembers.map((member, i) => (
              <Card key={i} hover className="flex flex-col justify-between p-5 space-y-4">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-lg mb-3 shadow-xs">
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {member.contribution}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] text-slate-400 font-mono">Major Project Contributor</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- TECHNOLOGIES USED --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="emerald" className="mb-3">
          Architecture
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Modern Web Technology Stack
        </h2>
        <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2 mb-10">
          Clean, modular frontend engineering without heavy backend dependencies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {technologies.map((tech, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-600" />
                {tech.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
