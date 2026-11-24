import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, PlayCircle, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getPastInterviews } from '../services/interviewService';

/**
 * Placeholder component for the Candidate Dashboard & Past Sessions.
 * Assigned to: Member 3
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPastInterviews()
      .then((data) => {
        if (isMounted) {
          setPastInterviews(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header with Ownership Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Assigned: Member 3 (Dashboard & Session Management)</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Target Role:{' '}
            <span className="text-indigo-400 font-mono font-medium">
              {user?.targetRole || 'SDE-1'}
            </span>
          </p>
        </div>

        {/* Working Navigation to Next Step */}
        <button
          onClick={() => navigate('/setup')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Start New Interview Setup</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Metrics Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Practice Sessions</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {loading ? '...' : pastInterviews.length}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Readiness Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {loading
              ? '...'
              : `${Math.round(
                  pastInterviews.reduce((acc, curr) => acc + curr.overallScore, 0) /
                    (pastInterviews.length || 1)
                )}%`}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Completed Technicals</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {loading ? '...' : pastInterviews.filter((i) => i.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Past Interviews List */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Recent Interview Sessions</h2>
          <span className="text-xs text-slate-400">Mock Data Contract Active</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-400">Loading sessions...</div>
        ) : (
          <div className="space-y-3">
            {pastInterviews.map((session) => (
              <div
                key={session.sessionId}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-200">{session.role}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                      {session.difficulty}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {session.interviewType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(session.date).toLocaleDateString()} • {session.durationMinutes} mins •{' '}
                    {session.totalQuestions} questions
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">{session.overallScore}%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Score</div>
                  </div>
                  <button
                    onClick={() => navigate(`/report/${session.sessionId}`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
