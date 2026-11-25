import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  TrendingUp,
  Award,
  Target,
  Clock,
  Filter,
  Calendar,
  Code2,
  MessageSquare,
  Brain,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getPastInterviews } from '../services/interviewService';
import { formatDate, getScoreBadgeColor } from '../utils/formatters';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

/**
 * Dashboard.jsx — Candidate Dashboard & Past Interview History
 * Member 5 — Production-Ready ES6+ JavaScript (.jsx)
 * 
 * Features:
 * - Welcome header with user name and target role
 * - Top 3 KPI summary cards (Total Interviews, Average Score, Latest Target Role)
 * - Past interviews history with filter pills (All, Technical, Behavioral, DSA)
 * - Responsive interview cards showing Role, Difficulty, Date, Score, and "View Full Report" CTA
 * - Loading and empty states
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [pastInterviews, setPastInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter categories
  const filterCategories = ['All', 'Technical', 'Behavioral', 'DSA', 'System Design'];

  // Fetch past interviews on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchInterviews = async () => {
      try {
        const data = await getPastInterviews();
        if (isMounted) {
          setPastInterviews(data);
          setFilteredInterviews(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch past interviews:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInterviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Apply filter logic
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredInterviews(pastInterviews);
    } else {
      const filtered = pastInterviews.filter(
        (interview) =>
          interview.interviewType.toLowerCase().includes(activeFilter.toLowerCase())
      );
      setFilteredInterviews(filtered);
    }
  }, [activeFilter, pastInterviews]);

  // Calculate KPIs
  const totalInterviews = pastInterviews.length;
  const averageScore = totalInterviews > 0
    ? Math.round(
        pastInterviews.reduce((sum, interview) => sum + interview.overallScore, 0) / totalInterviews
      )
    : 0;
  const latestTargetRole = user?.targetRole || 'Not Set';
  const completedCount = pastInterviews.filter((i) => i.status === 'COMPLETED').length;

  // Handle filter click
  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Welcome back, {user?.name || 'Candidate'}! 👋
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-400">Your Current Target Role:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-semibold">
                <Target className="w-4 h-4" />
                {latestTargetRole}
              </span>
            </div>
          </div>

          {/* Start New Mock Interview CTA */}
          <Button
            variant="primary"
            size="lg"
            icon={<PlayCircle className="w-5 h-5" />}
            onClick={() => navigate('/setup')}
            className="self-start lg:self-auto shadow-2xl shadow-indigo-500/30"
          >
            Start New Mock Interview
          </Button>
        </div>

        {/* Top KPI Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Interviews Completed */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/50 border border-slate-800 shadow-lg hover:shadow-indigo-500/10 transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Total Completed</span>
                </div>
                <p className="text-4xl font-extrabold text-white mt-1">
                  {loading ? '—' : totalInterviews}
                </p>
                <p className="text-xs text-slate-500 mt-2">Mock Interview Sessions</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Award className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Average Readiness Score */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/50 border border-slate-800 shadow-lg hover:shadow-emerald-500/10 transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Avg Readiness</span>
                </div>
                <p className="text-4xl font-extrabold text-white mt-1">
                  {loading ? '—' : `${averageScore}%`}
                </p>
                <p className="text-xs text-slate-500 mt-2">Interview Performance Score</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Latest Target Role & Status */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/50 border border-slate-800 shadow-lg hover:shadow-violet-500/10 transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                  <Target className="w-4 h-4" />
                  <span>Career Focus</span>
                </div>
                <p className="text-xl font-bold text-white mt-1 leading-tight">
                  {loading ? '—' : latestTargetRole}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {completedCount} sessions completed
                </p>
              </div>
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Brain className="w-6 h-6 text-violet-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Past Interviews History Section */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 lg:p-8 shadow-xl">
          {/* Section Header & Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-400" />
              Past Interview History
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {filterCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterClick(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    activeFilter === category
                      ? 'bg-indigo-600 text-white border border-indigo-500 shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Cards */}
          {loading ? (
            <Loader text="Loading your interview history..." size="lg" />
          ) : filteredInterviews.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700 mb-4">
                <MessageSquare className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-slate-300 mb-2">
                No interviews yet
              </p>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Start your first mock interview to unlock AI-powered feedback and performance analytics.
              </p>
              <Button
                variant="primary"
                size="md"
                icon={<PlayCircle className="w-4 h-4" />}
                onClick={() => navigate('/setup')}
              >
                Start Your First Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInterviews.map((interview) => {
                const difficultyBadgeColors = {
                  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                };

                const typeBadgeColors = {
                  Technical: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                  Behavioral: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                  DSA: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                  'System Design': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
                };

                return (
                  <div
                    key={interview.sessionId}
                    className="group relative overflow-hidden p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
                  >
                    {/* Background Gradient Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Interview Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-200 leading-tight">
                            {interview.role}
                          </h3>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide border ${
                              difficultyBadgeColors[interview.difficulty] ||
                              'bg-slate-700/50 text-slate-400 border-slate-600'
                            }`}
                          >
                            {interview.difficulty}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide border ${
                              typeBadgeColors[interview.interviewType] ||
                              'bg-slate-700/50 text-slate-400 border-slate-600'
                            }`}
                          >
                            {interview.interviewType}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(interview.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {interview.durationMinutes || 0} mins
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5" />
                            {interview.totalQuestions || 0} questions
                          </span>
                        </div>
                      </div>

                      {/* Right: Score & CTA */}
                      <div className="flex items-center gap-4">
                        {/* Score Badge */}
                        <div className="text-right">
                          <div
                            className={`text-2xl font-extrabold ${
                              interview.overallScore >= 80
                                ? 'text-emerald-400'
                                : interview.overallScore >= 60
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {interview.overallScore}%
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">
                            Overall Score
                          </div>
                        </div>

                        {/* View Full Report Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<ChevronRight className="w-4 h-4" />}
                          iconPosition="right"
                          onClick={() => navigate(`/report/${interview.sessionId}`)}
                        >
                          View Report
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
