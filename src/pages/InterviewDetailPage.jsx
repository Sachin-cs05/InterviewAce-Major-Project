import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ScoreRadial from '../components/common/ScoreRadial';
import Loader from '../components/common/Loader';
import { formatDate, formatDuration, getScoreBadgeColor, getScoreTextColor } from '../utils/formatters';
import { getInterviewReport } from '../services/interviewService';

/**
 * Interview Detail Page (White & Emerald Theme)
 * Inspects submitted answers, benchmark answers, and per-question score breakdown for a past session.
 */
export default function InterviewDetailPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      // 1. Check direct report stored in localStorage
      try {
        const storedReport = localStorage.getItem(`interviewace-report-${sessionId}`);
        if (storedReport) {
          const parsed = JSON.parse(storedReport);
          if (parsed && isMounted) {
            setSessionData(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Error reading session report:', err);
      }

      // 2. Check if it matches last result
      try {
        const lastResult = localStorage.getItem('interviewace-last-result');
        if (lastResult) {
          const parsed = JSON.parse(lastResult);
          if (parsed && (parsed.sessionId === sessionId || !sessionId || sessionId === 'sess_101')) {
            if (isMounted) {
              setSessionData(parsed);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Error reading last result:', err);
      }

      // 3. Fallback to mock service
      try {
        const fallback = await getInterviewReport(sessionId);
        if (isMounted) {
          setSessionData(fallback);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" text="Loading interview details..." />
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Session Not Found</h2>
        <p className="text-slate-500 text-sm">
          We couldn't locate the interview session with ID <span className="font-mono text-slate-700">{sessionId}</span>.
        </p>
        <Button variant="primary" onClick={() => navigate('/history')}>
          Back to History
        </Button>
      </div>
    );
  }

  // Extract questions list
  const questionsList =
    sessionData.questionFeedback ||
    sessionData.questions || [
      {
        question: 'Could you explain how the JavaScript event loop operates, specifically contrasting microtasks with macrotasks?',
        userAnswer:
          'JavaScript has a single-threaded runtime with an event loop. Synchronous code executes first on the call stack. When asynchronous operations finish, microtasks like Promises are put in the microtask queue, which has higher priority and executes completely before macrotasks like setTimeout.',
        idealAnswer:
          'The event loop continuously monitors the call stack and task queues. When the stack is empty, microtasks (Promise callbacks, MutationObserver) are drained completely before processing the next macrotask (setTimeout, setInterval, I/O). This priority prevents UI starvation for critical updates.',
        score: 90,
        category: 'Core JavaScript & Concurrency',
        tip: 'Clearly articulate microtask queue starvation and browser rendering steps.',
      },
      {
        question: 'In React, what are the primary causes of unnecessary re-renders, and how do React.memo and useCallback mitigate them?',
        userAnswer:
          'React re-renders a component whenever its parent re-renders or state changes. Passing new function references on every render causes child components to re-render even if props seem identical. useCallback caches function instances, and React.memo does shallow prop comparison.',
        idealAnswer:
          'React re-renders occur on state/prop updates or parent re-renders. Inline functions and object literals create new memory references on each render. useCallback preserves referential identity across renders, allowing React.memo to skip re-renders if props did not shallowly change.',
        score: 85,
        category: 'React Architecture',
        tip: 'Mention that over-memoization adds unnecessary memory overhead.',
      },
    ];

  const overallScore = sessionData.overallScore || 85;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interview History
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(`/report/${sessionId}`)}>
            <FileText className="w-4 h-4 mr-1.5 text-emerald-600" />
            Full AI Report
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/setup')}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Retake Interview
          </Button>
        </div>
      </div>

      {/* Hero Session Summary Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" size="sm">
                {sessionData.interviewType || 'Technical'}
              </Badge>
              <Badge
                variant={
                  sessionData.difficulty === 'Hard' ? 'rose' : sessionData.difficulty === 'Easy' ? 'emerald' : 'amber'
                }
                size="sm"
              >
                {sessionData.difficulty || 'Medium'} Difficulty
              </Badge>
              <span className="text-xs text-slate-400 font-mono">ID: {sessionId}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {sessionData.role || 'Software Engineer'}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formatDate(sessionData.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{sessionData.durationMinutes || sessionData.duration || 25} minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{questionsList.length} Questions Evaluated</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 max-w-2xl pt-2">
              {sessionData.summaryFeedback ||
                'Candidate performed with solid fundamentals and clear communication. Ready for technical on-site interviews with continued practice.'}
            </p>
          </div>

          {/* Radial score gauge */}
          <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 min-w-[180px]">
            <ScoreRadial score={overallScore} size={110} strokeWidth={9} />
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-2">
              {overallScore >= 80 ? 'Exceptional Readiness' : overallScore >= 60 ? 'Solid Performer' : 'Needs Practice'}
            </span>
          </div>
        </div>
      </Card>

      {/* Strengths & Improvements quick cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Key Strengths Demonstrated</h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            {(sessionData.strengths || [
              'Structured communication with clear topic definitions.',
              'Good recall of core asynchronous concurrency mechanics.',
              'Confident delivery under interview time limits.',
            ]).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-200/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Recommended Improvements</h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            {(sessionData.improvements || [
              'Elaborate more on distributed caching and edge failure cases.',
              'Support answers with specific metric improvements (e.g., latency reduction).',
              'Follow the STAR framework for behavioral scenarios.',
            ]).map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question by Question Detailed Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Question & Answer Breakdown</h2>
          <span className="text-xs text-slate-500">
            Showing all {questionsList.length} submitted responses
          </span>
        </div>

        <div className="space-y-4">
          {questionsList.map((q, idx) => {
            const isExpanded = expandedQuestions[idx] ?? true; // expanded by default
            const qScore = q.score || 85;

            return (
              <Card key={idx} className="overflow-hidden border-slate-200">
                {/* Header item */}
                <div
                  onClick={() => toggleQuestion(idx)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="slate" size="sm">
                          {q.category || 'General'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-base leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${getScoreBadgeColor(
                        qScore
                      )}`}
                    >
                      {qScore}%
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 text-sm">
                    {/* Candidate's submitted response */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Candidate's Transcribed Answer
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-800 leading-relaxed font-sans">
                        {q.userAnswer ? (
                          q.userAnswer
                        ) : (
                          <span className="italic text-slate-400">
                            No answer recorded or skipped by candidate.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Model benchmark answer */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          AI Model Benchmark Answer
                        </span>
                      </div>
                      <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-slate-800 leading-relaxed font-sans">
                        {q.idealAnswer ||
                          'A complete response starts with fundamental definition, contrasts architectural alternatives, mentions concrete memory/complexity trade-offs, and relates to real-world production reliability.'}
                      </div>
                    </div>

                    {/* Pro tip / Advice */}
                    {q.tip && (
                      <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60 flex items-start gap-2.5 text-xs text-slate-600">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800">Ace Tip: </strong>
                          {q.tip}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50/80 to-slate-50 border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Want to improve your score on this track?</h3>
          <p className="text-slate-500 text-sm mt-0.5">
            Launch a targeted session to test your knowledge on questions you found challenging.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/setup')}>
          Start New Practice
        </Button>
      </Card>
    </div>
  );
}
