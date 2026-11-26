import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  PlayCircle,
  Award,
  Clock,
  CheckCircle2,
  Code2,
  Users,
  Target,
  Briefcase,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import { getPastInterviews } from '../services/interviewService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';
import { formatDate, getScoreBadgeColor, formatDuration } from '../utils/formatters';

/**
 * Modern Student Dashboard Page (White & Emerald Light Theme)
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load interviews from localStorage or mock service
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const local = localStorage.getItem('interviewace-history');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (isMounted) {
              setInterviews(parsed);
              setLoading(false);
              return;
            }
          }
        }

        const data = await getPastInterviews();
        if (isMounted) {
          setInterviews(data);
          // Seed localStorage so persistence is established
          localStorage.setItem('interviewace-history', JSON.stringify(data));
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live statistics
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter((i) => i.status === 'COMPLETED').length;
  const averageScore = totalInterviews > 0
    ? Math.round(interviews.reduce((acc, curr) => acc + (Number(curr.overallScore) || 0), 0) / totalInterviews)
    : 0;
  const totalPracticeMinutes = interviews.reduce(
    (acc, curr) => acc + (Number(curr.durationMinutes) || 20),
    0
  );

  // Prepare chart data for performance trend
  const chartData = interviews.map((item, index) => ({
    name: `Session ${index + 1}`,
    score: item.overallScore,
    role: item.role,
  }));

  const quickTracks = [
    {
      type: 'Technical',
      title: 'Technical Interview',
      desc: 'Coding concepts, DSA, APIs & System Design',
      icon: Code2,
    },
    {
      type: 'HR',
      title: 'HR Interview',
      desc: 'Culture fit, introductions & communication',
      icon: Users,
    },
    {
      type: 'Behavioral',
      title: 'Behavioral (STAR)',
      desc: 'Teamwork, conflict resolution & project stories',
      icon: Briefcase,
    },
    {
      type: 'Mixed',
      title: 'Mixed Comprehensive',
      desc: 'Full recruitment simulation (Tech + HR)',
      icon: Target,
    },
  ];

  const handleLaunchTrack = (trackType) => {
    navigate('/setup', { state: { preselectedTrack: trackType } });
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 inline-block">
            Student Preparation Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Ready to sharpen your skills? Pick an interview track, configure your question count,
            and practice with AI interviewer Ace.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Button
            variant="outline"
            size="md"
            className="bg-white text-emerald-700 hover:bg-emerald-50 border-white shadow-sm font-bold"
            onClick={() => navigate('/setup')}
            icon={<PlayCircle className="w-4 h-4" />}
          >
            Start New Interview
          </Button>
        </div>
      </div>

      {/* 2. Key Statistics Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Interviews</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalInterviews}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Average Score</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {averageScore > 0 ? `${averageScore}%` : 'N/A'}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Completed</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{completedInterviews}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Practice Time</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {totalPracticeMinutes} mins
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Quick Interview Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Quick Interview Launch
            </h2>
            <p className="text-xs text-slate-500">
              Select a specialized track to jump right into interview setup.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.type}
                onClick={() => handleLaunchTrack(track.type)}
                className="bg-white border border-slate-200/80 hover:border-emerald-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{track.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{track.desc}</p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Configure Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Performance Trend Chart (Recharts) */}
      {chartData.length > 1 && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Performance Progression Trend
              </h2>
              <p className="text-xs text-slate-500">Scores across completed mock interviews</p>
            </div>
            <Badge variant="emerald">Live Local Data</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val) => [`${val}%`, 'Overall Score']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* 5. Recent Interviews List */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Interview Sessions</h2>
            <p className="text-xs text-slate-500">View past recordings, answers, and scores</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading your interview records..." />
        ) : interviews.length === 0 ? (
          <EmptyState
            title="No Interviews Yet"
            description="You have not completed any mock sessions yet. Start your first session to receive your evaluation."
            actionLabel="Start Your First Interview"
            onAction={() => navigate('/setup')}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {interviews.slice(0, 4).map((session) => (
              <div
                key={session.sessionId}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{session.role}</span>
                    <Badge variant="emerald">{session.interviewType}</Badge>
                    <Badge variant="slate">{session.difficulty}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatDate(session.date)} • {session.durationMinutes || 24} mins •{' '}
                    {session.totalQuestions || 5} Questions
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${getScoreBadgeColor(
                      session.overallScore
                    )}`}
                  >
                    {session.overallScore}% Score
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/report/${session.sessionId}`)}
                  >
                    View Result
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
