import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCcw,
  Award,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Calendar,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { getInterviewReport } from '../services/interviewService';
import { formatDate } from '../utils/formatters';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

/**
 * FeedbackReport.jsx — AI Performance & Evaluation Report with Rich Analytics
 * Member 5 — Production-Ready ES6+ JavaScript (.jsx)
 * 
 * Features:
 * - Session metadata header with Back to Dashboard and Practice Again CTAs
 * - Overall Score card with circular score badge and executive summary
 * - Skill Radar Chart (Recharts) plotting multi-dimensional skill breakdown
 * - Strengths vs Areas to Improve (green/amber accents)
 * - Question-by-Question Detailed Breakdown with expandable accordion cards
 */
export default function FeedbackReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  // Fetch interview report on mount
  useEffect(() => {
    let isMounted = true;

    const fetchReport = async () => {
      try {
        const data = await getInterviewReport(sessionId);
        if (isMounted) {
          setReport(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch interview report:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Toggle question accordion expansion
  const toggleQuestionExpansion = (index) => {
    setExpandedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Get score-based verdict label
  const getReadinessVerdict = (score) => {
    if (score >= 90) return { label: 'Outstanding', color: 'emerald' };
    if (score >= 80) return { label: 'Interview Ready', color: 'emerald' };
    if (score >= 70) return { label: 'Nearly Ready', color: 'amber' };
    if (score >= 60) return { label: 'Needs Practice', color: 'amber' };
    return { label: 'Requires Improvement', color: 'rose' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader text="Loading AI evaluation report..." size="xl" fullScreen />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-slate-800 mb-4">
            <MessageSquare className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white">Report Not Found</h2>
          <p className="text-sm text-slate-400 max-w-md">
            Unable to load the interview report for session <span className="font-mono text-indigo-400">{sessionId}</span>.
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const verdict = getReadinessVerdict(report.overallScore);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          {/* Session Metadata Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white"
              >
                Dashboard
              </Button>
              <span className="text-slate-600">/</span>
              <span className="text-sm text-slate-400">Interview Report</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              AI Performance Report
            </h1>

            <div className="flex items-center gap-4 flex-wrap text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                {report.role || 'Role N/A'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                {report.difficulty || 'Medium'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(report.date)}
              </span>
            </div>
          </div>

          {/* Practice Again CTA */}
          <Button
            variant="primary"
            size="lg"
            icon={<RefreshCcw className="w-5 h-5" />}
            onClick={() => navigate('/setup')}
            className="self-start lg:self-auto shadow-2xl shadow-indigo-500/30"
          >
            Practice Again
          </Button>
        </div>

        {/* Analytics Overview Grid (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card: Overall Score & Executive Summary */}
          <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              {/* Overall Score Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                    <Award className="w-4 h-4" />
                    Overall Score
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-extrabold text-white">
                      {report.overallScore}
                    </span>
                    <span className="text-2xl font-semibold text-slate-500">/100</span>
                  </div>
                </div>

                {/* Circular Score Visual */}
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30 border-4 border-slate-900">
                  <div className="text-center">
                    <div className="text-xl font-extrabold text-white">
                      {report.overallScore}
                    </div>
                    <div className="text-[10px] text-indigo-200 uppercase font-medium">
                      Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Readiness Verdict Tag */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-${verdict.color}-500/10 border border-${verdict.color}-500/30 text-${verdict.color}-400 text-sm font-semibold shadow-lg`}
              >
                <Sparkles className="w-4 h-4" />
                {verdict.label}
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Executive Summary
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {report.summaryFeedback || 'No summary available.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Skill Radar Chart */}
          <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-2xl">
            <div className="absolute top-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                Skill Breakdown Analysis
              </div>

              {/* Recharts Radar Chart with explicit parent height */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={report.skillBreakdown || []}>
                    <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '8px 12px',
                      }}
                      labelStyle={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}
                      itemStyle={{ color: '#6366f1', fontSize: 11 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Radar chart showing multi-dimensional skill performance analysis
              </p>
            </div>
          </div>
        </div>

        {/* Strengths vs Areas to Improve (2-Column Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-5">
              <CheckCircle2 className="w-5 h-5" />
              Key Strengths
            </h3>

            {report.strengths && report.strengths.length > 0 ? (
              <ul className="space-y-3">
                {report.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No strengths recorded.</p>
            )}
          </div>

          {/* Actionable Improvements */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-5">
              <Lightbulb className="w-5 h-5" />
              Actionable Improvements
            </h3>

            {report.improvements && report.improvements.length > 0 ? (
              <ul className="space-y-3">
                {report.improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-sm text-slate-300"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No improvements recorded.</p>
            )}
          </div>
        </div>

        {/* Question-by-Question Detailed Breakdown */}
        <div className="p-6 lg:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Question-by-Question Breakdown
          </h2>

          {report.questionFeedback && report.questionFeedback.length > 0 ? (
            <div className="space-y-4">
              {report.questionFeedback.map((questionData, index) => {
                const isExpanded = expandedQuestions.includes(index);
                const scoreColor =
                  questionData.score >= 80
                    ? 'text-emerald-400'
                    : questionData.score >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400';

                return (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-300"
                  >
                    {/* Question Header (Always Visible) */}
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleQuestionExpansion(index)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-200 leading-snug">
                          {questionData.question}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-extrabold ${scoreColor}`}>
                          {questionData.score}%
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4 pt-4 border-t border-slate-800">
                        {/* Your Answer */}
                        <div>
                          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Your Answer
                          </h5>
                          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                            {questionData.userAnswer || 'No answer provided.'}
                          </div>
                        </div>

                        {/* AI Ideal Answer */}
                        <div>
                          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            AI Ideal Answer
                          </h5>
                          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-sm text-slate-300 leading-relaxed">
                            {questionData.idealAnswer || 'No ideal answer available.'}
                          </div>
                        </div>

                        {/* Pro Tip Box */}
                        {questionData.tip && (
                          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                                Pro Tip
                              </h5>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {questionData.tip}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">
              No question feedback available for this session.
            </p>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-4 pb-8">
          <Button
            variant="primary"
            size="lg"
            icon={<RefreshCcw className="w-5 h-5" />}
            onClick={() => navigate('/setup')}
            className="shadow-2xl shadow-indigo-500/30"
          >
            Start Another Mock Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
