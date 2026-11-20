import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bot,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Code,
} from 'lucide-react';
import { getInterviewReport } from '../services/interviewService';

/**
 * Placeholder component for the AI Performance & Evaluation Report.
 * Assigned to: Member 5
 */
export default function FeedbackReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getInterviewReport(sessionId)
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Assigned: Member 5 (Evaluation Analytics & Report)</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">AI Performance Report</h1>
          <p className="text-sm text-slate-400 mt-1">
            Session: <span className="font-mono text-indigo-400">{sessionId || 'sess_101'}</span> •{' '}
            {report?.role || 'SDE-1 (Frontend)'}
          </p>
        </div>

        {/* Working Return to Dashboard Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-400">Loading AI evaluation report...</div>
      ) : (
        <div className="space-y-6">
          {/* Overall Score Banner */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Evaluation Verdict
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Strong Technical Competency</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                Candidate met all primary architectural checkpoints with strong articulation of
                JavaScript concurrency and React optimization techniques.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-indigo-500/40 flex flex-col items-center justify-center text-center shadow-lg shadow-indigo-500/20">
                <span className="text-3xl font-extrabold text-white">{report.overallScore}</span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                  / 100
                </span>
              </div>
            </div>
          </div>

          {/* Dimension Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Technical Accuracy</span>
                <Brain className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {report.metrics.technicalAccuracy}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${report.metrics.technicalAccuracy}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Communication</span>
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {report.metrics.communicationClarity}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${report.metrics.communicationClarity}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Problem Solving</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {report.metrics.problemSolving}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${report.metrics.problemSolving}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Code Quality</span>
                <Code className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl font-bold text-white">{report.metrics.codeQuality}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-pink-500 h-full rounded-full"
                  style={{ width: `${report.metrics.codeQuality}%` }}
                />
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
              <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Key Demonstrated Strengths
              </h3>
              <ul className="space-y-2.5">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4" />
                Targeted Areas for Improvement
              </h3>
              <ul className="space-y-2.5">
                {report.areasForImprovement.map((area, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question Review Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-4">Question-by-Question Rubric Analysis</h3>
            <div className="space-y-4">
              {report.questionBreakdowns.map((q) => (
                <div key={q.questionNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-400">Question {q.questionNumber}</span>
                    <span className="text-xs font-bold text-emerald-400">{q.score}% Score</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 mb-2">{q.question}</p>
                  <p className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/60">
                    <strong className="text-slate-300">Feedback:</strong> {q.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
