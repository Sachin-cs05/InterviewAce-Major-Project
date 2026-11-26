import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Target,
  Printer,
  ChevronDown,
  RotateCcw,
  BookOpen,
  Calendar,
  Clock,
  Briefcase,
} from 'lucide-react';
import { getInterviewReport } from '../services/interviewService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import ScoreRadial from '../components/common/ScoreRadial';
import ProgressBar from '../components/common/ProgressBar';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/formatters';

/**
 * Interview Performance & Feedback Report Page (White & Emerald Theme)
 */
export default function FeedbackReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // 1. Check if report is saved directly under session ID
    if (sessionId) {
      try {
        const directReport = localStorage.getItem(`interviewace-report-${sessionId}`);
        if (directReport) {
          const parsed = JSON.parse(directReport);
          if (parsed && isMounted) {
            setReport(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Error reading stored session report:', err);
      }
    }

    // 2. Check if report is saved in localStorage under 'interviewace-last-result'
    try {
      const stored = localStorage.getItem('interviewace-last-result');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (!sessionId || parsed.sessionId === sessionId || sessionId === 'sess_101')) {
          if (isMounted) {
            setReport(parsed);
            setLoading(false);
            return;
          }
        }
      }
    } catch {
      // continue to service fallback
    }

    // Fallback to service report
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loader fullScreen text="Compiling your interview performance scorecard..." />;
  }

  if (!report) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Report Not Found</h2>
        <p className="text-xs text-slate-500">The requested interview evaluation could not be loaded.</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const breakdownMetrics = report.skillBreakdown || [
    { subject: 'Technical Knowledge', score: 88, fullMark: 100 },
    { subject: 'Answer Relevance', score: 85, fullMark: 100 },
    { subject: 'Communication', score: 86, fullMark: 100 },
    { subject: 'Answer Completeness', score: 84, fullMark: 100 },
    { subject: 'Problem Solving', score: 90, fullMark: 100 },
  ];

  const questionsList = report.questionFeedback || report.questionBreakdowns || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 print:p-0 print:max-w-full">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:border-none print:shadow-none">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Session Assessment
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {report.sessionId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interview Evaluation Report
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              {report.role}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {formatDate(report.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {report.durationMinutes ? `${report.durationMinutes} mins` : report.duration || '25 mins'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/setup')}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retake Interview
          </Button>
        </div>
      </div>

      {/* 2. Overall Score & Category Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Radial Score Gauge */}
        <Card className="md:col-span-4 flex flex-col items-center justify-center p-6 text-center border-emerald-200 bg-gradient-to-b from-white to-emerald-50/20">
          <ScoreRadial
            score={report.overallScore}
            size={140}
            strokeWidth={11}
            label="Overall Score"
            subtext="Simulated Rubric Assessment"
          />
        </Card>

        {/* Performance Dimensions Breakdown */}
        <Card className="md:col-span-8 flex flex-col justify-between p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Performance Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate evaluation across 5 simulated interview competencies
            </p>
          </div>

          <div className="space-y-3.5">
            {breakdownMetrics.map((metric, idx) => (
              <ProgressBar
                key={idx}
                label={metric.subject}
                value={metric.score}
                max={metric.fullMark || 100}
                height="h-2.5"
              />
            ))}
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            Scores are evaluated based on answer completeness, conceptual keywords, and structure.
          </p>
        </Card>
      </div>

      {/* 3. Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <Card className="space-y-3 border-emerald-200 bg-emerald-50/20">
          <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Key Demonstrated Strengths
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {report.strengths?.map((str, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Areas for Improvement */}
        <Card className="space-y-3 border-amber-200 bg-amber-50/20">
          <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Areas for Targeted Improvement
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {(report.improvements || report.areasForImprovement)?.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-600 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 4. Question-by-Question Review Accordion */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Question-by-Question Review</h3>
            <p className="text-xs text-slate-500">
              Analyze your responses against benchmark ideal answers
            </p>
          </div>
          <Badge variant="slate">{questionsList.length} Questions</Badge>
        </div>

        <div className="space-y-3">
          {questionsList.map((item, idx) => {
            const isOpen = expandedQuestion === idx;
            const qScore = item.score || 85;

            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                  className="w-full p-4 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700">
                        Q{idx + 1}.
                      </span>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">
                        {item.question}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {qScore}%
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 pt-2 bg-slate-50/50 border-t border-slate-100 space-y-3 text-xs leading-relaxed">
                    {/* Candidate Answer */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Your Submitted Response:
                      </span>
                      <p className="text-slate-800 italic">
                        "{item.userAnswer || item.candidateSummary || 'No answer submitted.'}"
                      </p>
                    </div>

                    {/* Ideal Sample Answer */}
                    {item.idealAnswer && (
                      <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                          Benchmark Ideal Answer:
                        </span>
                        <p className="text-slate-800">{item.idealAnswer}</p>
                      </div>
                    )}

                    {/* Feedback / Tips */}
                    {(item.tip || item.feedback) && (
                      <div className="text-[11px] text-slate-600 pt-1">
                        <strong className="text-slate-800">Interviewer Tip:</strong>{' '}
                        {item.tip || item.feedback}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Navigation Return Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 print:hidden">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Return to Dashboard
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/history')}
          icon={<BookOpen className="w-4 h-4" />}
        >
          View Interview History
        </Button>
      </div>
    </div>
  );
}
