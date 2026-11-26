import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Trash2,
  Download,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  RotateCcw,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { formatDate, formatDuration, getScoreBadgeColor, getScoreTextColor } from '../utils/formatters';
import { getPastInterviews } from '../services/interviewService';
import { useAuthStore } from '../store/useAuthStore';
import { getUserInterviewHistory, saveUserInterviewHistory } from '../utils/userStorage';

/**
 * Pre-seeded mock sessions if user has no saved history yet
 */
const INITIAL_MOCK_HISTORY = [
  {
    sessionId: 'sess_101',
    role: 'SDE-1 (Frontend Developer)',
    interviewType: 'Technical',
    difficulty: 'Medium',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    overallScore: 87,
    status: 'COMPLETED',
    durationMinutes: 26,
    totalQuestions: 5,
  },
  {
    sessionId: 'sess_102',
    role: 'Full Stack MERN',
    interviewType: 'System Design',
    difficulty: 'Hard',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    overallScore: 79,
    status: 'COMPLETED',
    durationMinutes: 32,
    totalQuestions: 5,
  },
  {
    sessionId: 'sess_103',
    role: 'Backend Developer (Node.js)',
    interviewType: 'Technical',
    difficulty: 'Hard',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
    overallScore: 92,
    status: 'COMPLETED',
    durationMinutes: 28,
    totalQuestions: 5,
  },
  {
    sessionId: 'sess_104',
    role: 'Data Analyst',
    interviewType: 'Behavioral / HR',
    difficulty: 'Medium',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    overallScore: 84,
    status: 'COMPLETED',
    durationMinutes: 22,
    totalQuestions: 4,
  },
];

/**
 * Interview History Page (White & Emerald Theme)
 */
export default function HistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load history from user-isolated storage or seed
  useEffect(() => {
    try {
      const stored = getUserInterviewHistory(user?.id);
      if (stored && stored.length > 0) {
        setHistory(stored);
        return;
      }
      // Seed with initial realistic mock history for demonstration
      saveUserInterviewHistory(user?.id, INITIAL_MOCK_HISTORY);
      setHistory(INITIAL_MOCK_HISTORY);
    } catch {
      setHistory(INITIAL_MOCK_HISTORY);
    }
  }, [user?.id]);

  // Filtered and sorted history
  const filteredHistory = useMemo(() => {
    let result = [...history];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.role?.toLowerCase().includes(q) ||
          item.interviewType?.toLowerCase().includes(q) ||
          item.difficulty?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (selectedType !== 'ALL') {
      result = result.filter((item) => {
        const itemType = (item.interviewType || '').toLowerCase();
        return itemType.includes(selectedType.toLowerCase());
      });
    }

    // Score tier filter
    if (selectedTier === 'EXCELLENT') {
      result = result.filter((item) => (item.overallScore || 0) >= 80);
    } else if (selectedTier === 'GOOD') {
      result = result.filter((item) => (item.overallScore || 0) >= 60 && (item.overallScore || 0) < 80);
    } else if (selectedTier === 'NEEDS_WORK') {
      result = result.filter((item) => (item.overallScore || 0) < 60);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortBy === 'OLDEST') return new Date(a.date || 0) - new Date(b.date || 0);
      if (sortBy === 'HIGHEST_SCORE') return (b.overallScore || 0) - (a.overallScore || 0);
      if (sortBy === 'LOWEST_SCORE') return (a.overallScore || 0) - (b.overallScore || 0);
      if (sortBy === 'DURATION') return (b.durationMinutes || 0) - (a.durationMinutes || 0);
      return 0;
    });

    return result;
  }, [history, searchTerm, selectedType, selectedTier, sortBy]);

  // Delete a specific interview record
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const updated = history.filter((item) => item.sessionId !== deleteTarget.sessionId);
    setHistory(updated);
    try {
      saveUserInterviewHistory(user?.id, updated);
    } catch (e) {
      console.warn('Failed to update user history:', e);
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  // Export history as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `interviewace-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Quick stats
  const averageScore = useMemo(() => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
    return Math.round(sum / history.length);
  }, [history]);

  const bestScore = useMemo(() => {
    if (history.length === 0) return 0;
    return Math.max(...history.map((h) => h.overallScore || 0));
  }, [history]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Interview History</h1>
            <Badge variant="emerald" size="sm">
              {history.length} {history.length === 1 ? 'Session' : 'Sessions'}
            </Badge>
          </div>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Track performance progression, review candidate responses, and inspect benchmark feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="w-4 h-4 mr-1.5 text-slate-500" />
              Export JSON
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => navigate('/setup')}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            New Interview
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{history.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <HistoryIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${getScoreTextColor(averageScore)}`}>
                {averageScore}%
              </span>
              <span className="text-xs text-slate-400">across all tracks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Performance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600">{bestScore}%</span>
              <span className="text-xs text-emerald-600 font-medium">Top Record</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search role or track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Tracks & Types</option>
              <option value="Technical">Technical</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral / HR</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Score Tier Filter */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Score Tiers</option>
              <option value="EXCELLENT">Excellent (80% - 100%)</option>
              <option value="GOOD">Good (60% - 79%)</option>
              <option value="NEEDS_WORK">Needs Practice (&lt;60%)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="NEWEST">Sort: Newest First</option>
              <option value="OLDEST">Sort: Oldest First</option>
              <option value="HIGHEST_SCORE">Sort: Highest Score</option>
              <option value="LOWEST_SCORE">Sort: Lowest Score</option>
              <option value="DURATION">Sort: Longest Duration</option>
            </select>
          </div>
        </div>

        {/* Active filter count & clear */}
        {(searchTerm || selectedType !== 'ALL' || selectedTier !== 'ALL') && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {filteredHistory.length} of {history.length} interviews
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('ALL');
                setSelectedTier('ALL');
              }}
              className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </Card>

      {/* History Content */}
      {filteredHistory.length === 0 ? (
        <Card className="py-12">
          <EmptyState
            icon={HistoryIcon}
            title={history.length === 0 ? 'No Interviews Completed Yet' : 'No Matching Interviews'}
            description={
              history.length === 0
                ? 'Launch your first mock interview with the AI avatar to start receiving performance scores, speech transcripts, and personalized feedback.'
                : 'Try clearing your search terms or filters to view your other saved mock sessions.'
            }
            actionLabel={history.length === 0 ? 'Start Mock Interview' : 'Reset Filters'}
            onAction={
              history.length === 0
                ? () => navigate('/setup')
                : () => {
                    setSearchTerm('');
                    setSelectedType('ALL');
                    setSelectedTier('ALL');
                  }
            }
          />
        </Card>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5">Target Role & Track</th>
                  <th className="py-3.5 px-4 text-center">Difficulty</th>
                  <th className="py-3.5 px-4 text-center">Duration</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredHistory.map((item) => (
                  <tr key={item.sessionId} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Date */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{formatDate(item.date)}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Track */}
                    <td className="py-4 px-5">
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {item.role || 'Software Engineer'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.interviewType || 'Technical'} • {item.totalQuestions || 5} questions
                        </p>
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="py-4 px-4 text-center">
                      <Badge
                        variant={
                          item.difficulty === 'Hard' ? 'rose' : item.difficulty === 'Easy' ? 'emerald' : 'amber'
                        }
                        size="sm"
                      >
                        {item.difficulty || 'Medium'}
                      </Badge>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 text-center text-slate-600">
                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.durationMinutes ? `${item.durationMinutes}m` : '20m'}</span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${getScoreBadgeColor(
                          item.overallScore
                        )}`}
                      >
                        {item.overallScore}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/history/${item.sessionId}`}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                          title="View submitted questions and answers"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </Link>

                        <Link
                          to={`/report/${item.sessionId}`}
                          className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                          title="View full AI evaluation report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Report
                        </Link>

                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Shown on screens < md) */}
          <div className="md:hidden space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.sessionId} className="p-4 hover:border-emerald-200 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.role}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.interviewType} • {item.totalQuestions || 5} questions
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${getScoreBadgeColor(
                      item.overallScore
                    )}`}
                  >
                    {item.overallScore}%
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.durationMinutes}m</span>
                  </div>
                  <Badge
                    variant={item.difficulty === 'Hard' ? 'rose' : item.difficulty === 'Easy' ? 'emerald' : 'amber'}
                    size="sm"
                  >
                    {item.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/history/${item.sessionId}`}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/report/${item.sessionId}`}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg flex items-center gap-1"
                    >
                      Report
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Interview Record"
        description="Are you sure you want to remove this interview session? This action removes the score and answer history from your browser."
      >
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
          <p className="font-semibold text-slate-900">{deleteTarget?.role}</p>
          <p className="text-xs text-slate-500 mt-1">
            Completed on {formatDate(deleteTarget?.date)} • Score: {deleteTarget?.overallScore}%
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteConfirm} isLoading={isDeleting}>
            Delete Record
          </Button>
        </div>
      </Modal>
    </div>
  );
}
