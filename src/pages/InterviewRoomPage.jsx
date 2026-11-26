import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PhoneOff,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { useAuthStore } from '../store/useAuthStore';
import { getUserInterviewHistory, saveUserInterviewHistory } from '../utils/userStorage';
import { getQuestionsForConfig } from '../data/questions';
import useSpeech from '../hooks/useSpeech';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';

/**
 * Live Interview Room Component (White & Emerald Theme)
 * Core interactive video meeting interface with AI Interviewer Ace,
 * browser speech synthesis/recognition, live proctoring alerts, and deterministic local scoring.
 */
export default function InterviewRoomPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const activeSessionId = sessionId || `sess_${Date.now()}`;

  const {
    sessionConfig,
    isMicOn,
    isCamOn,
    toggleMic,
    toggleCam,
    status,
    setStatus,
  } = useInterviewStore();

  // Speech Hook
  const {
    isSpeaking,
    isListening,
    transcriptText,
    setTranscriptText,
    clearTranscript,
    speakText,
    stopSpeaking,
    startListening,
    stopListening,
    speechSupported,
    recognitionSupported,
  } = useSpeech();

  // Questions & Flow State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [showExitModal, setShowExitModal] = useState(false);
  const [proctorWarning, setProctorWarning] = useState(null);
  const [proctorCount, setProctorCount] = useState(0);

  // Webcam stream
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);

  // Load questions based on sessionConfig
  useEffect(() => {
    const loadedQuestions = getQuestionsForConfig({
      interviewType: sessionConfig.interviewType || 'Technical',
      role: sessionConfig.role || 'Software Engineer',
      difficulty: sessionConfig.difficulty || 'Medium',
      totalQuestions: sessionConfig.totalQuestions || 5,
      techStack: sessionConfig.techStack || [],
    });
    setQuestions(loadedQuestions);
  }, [sessionConfig]);

  // Request webcam stream on entry
  useEffect(() => {
    let localStream = null;
    const startCam = async () => {
      try {
        if (navigator.mediaDevices?.getUserMedia && isCamOn) {
          const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStream = s;
          setWebcamStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        }
      } catch (err) {
        console.warn('[InterviewRoom] Camera stream error:', err);
      }
    };
    startCam();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCamOn]);

  // Elapsed interview timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync speech transcript text into the answer box
  useEffect(() => {
    if (transcriptText) {
      setCurrentAnswer(transcriptText);
    }
  }, [transcriptText]);

  // Read question aloud when current question changes
  useEffect(() => {
    if (questions.length > 0 && !isVoiceMuted) {
      const q = questions[currentIndex];
      if (q?.question) {
        setStatus('AI_SPEAKING');
        speakText(q.question, () => {
          setStatus('USER_LISTENING');
        });
      }
    }
  }, [currentIndex, questions, isVoiceMuted, speakText, setStatus]);

  // Local Proctoring: Listen for window blur / tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setProctorCount((prev) => {
          const next = prev + 1;
          setProctorWarning(
            `Tab switch detected. You navigated away from the interview room (${next} warning${next > 1 ? 's' : ''}). Please stay focused on the session.`
          );
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Format MM:SS
  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Replay Question Audio
  const handleReplayQuestion = () => {
    const q = questions[currentIndex];
    if (q?.question) {
      setStatus('AI_SPEAKING');
      speakText(q.question, () => {
        setStatus('USER_LISTENING');
      });
    }
  };

  // Voice recording toggle
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Submit Answer & Advance or Complete
  const handleSubmitAnswer = () => {
    stopSpeaking();
    stopListening();

    const activeQuestion = questions[currentIndex];
    const answerToRecord = currentAnswer.trim() || 'No answer submitted.';

    // Save answer locally
    const updatedAnswers = {
      ...userAnswers,
      [activeQuestion.id]: {
        questionId: activeQuestion.id,
        question: activeQuestion.question,
        category: activeQuestion.category,
        userAnswer: answerToRecord,
        sampleAnswer: activeQuestion.sampleAnswer,
        keywords: activeQuestion.keywords,
      },
    };
    setUserAnswers(updatedAnswers);

    // If more questions exist, proceed to next
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentAnswer('');
      clearTranscript();
    } else {
      // Completed all questions! Generate deterministic local report & redirect
      finishInterviewAndGenerateReport(updatedAnswers);
    }
  };

  // Generate deterministic report and persist in localStorage
  const finishInterviewAndGenerateReport = (finalAnswers) => {
    setStatus('COMPLETED');
    stopSpeaking();
    stopListening();

    // Clean up webcam
    if (webcamStream) {
      webcamStream.getTracks().forEach((t) => t.stop());
    }

    // Deterministic scoring calculation
    let totalScoreAcc = 0;
    const scoredQuestions = questions.map((q) => {
      const recorded = finalAnswers[q.id]?.userAnswer || '';
      let matchCount = 0;
      const lowerAnswer = recorded.toLowerCase();

      // Check keyword occurrences
      q.keywords?.forEach((kw) => {
        if (lowerAnswer.includes(kw.toLowerCase())) matchCount++;
      });

      // Score base calculation: length + matched keywords
      let qScore = 60;
      if (recorded.length > 50) qScore += 15;
      if (recorded.length > 150) qScore += 10;
      qScore += Math.min(15, matchCount * 5);
      qScore = Math.min(96, Math.max(50, qScore));

      totalScoreAcc += qScore;

      return {
        question: q.question,
        userAnswer: recorded,
        idealAnswer: q.sampleAnswer,
        score: qScore,
        category: q.category,
        tip: `Key concepts to emphasize: ${q.keywords.slice(0, 3).join(', ')}.`,
      };
    });

    const calculatedOverall = Math.round(totalScoreAcc / (questions.length || 1));
    const durationMinutes = Math.max(1, Math.round(timerSeconds / 60));

    const finalReport = {
      sessionId: activeSessionId,
      role: sessionConfig.role || 'Software Engineer',
      interviewType: sessionConfig.interviewType || 'Technical',
      difficulty: sessionConfig.difficulty || 'Medium',
      date: new Date().toISOString(),
      durationMinutes,
      totalQuestions: questions.length,
      overallScore: calculatedOverall,
      summaryFeedback: `Candidate completed all ${questions.length} questions in ${durationMinutes} minutes with an overall readiness score of ${calculatedOverall}%. Answers demonstrated reliable understanding with clear potential for senior-level placement.`,
      skillBreakdown: [
        { subject: 'Technical Accuracy', score: Math.min(100, calculatedOverall + 2), fullMark: 100 },
        { subject: 'Answer Relevance', score: Math.min(100, calculatedOverall - 1), fullMark: 100 },
        { subject: 'Communication', score: Math.min(100, calculatedOverall + 4), fullMark: 100 },
        { subject: 'Answer Completeness', score: Math.min(100, calculatedOverall - 3), fullMark: 100 },
        { subject: 'Problem Solving', score: Math.min(100, calculatedOverall + 1), fullMark: 100 },
      ],
      strengths: [
        'Methodical answer structure with clear introductory topic definitions.',
        'Good recall of core architectural principles and standard web workflows.',
        'Demonstrated calm focus under interview timing pressure.',
      ],
      improvements: [
        'Elaborate more on trade-offs and edge cases rather than only happy-path scenarios.',
        'Incorporate specific profiling numbers or real-world project anecdotes into answers.',
      ],
      recommendedTopics: [
        'Asynchronous event loop queue priorities',
        'System scaling and database indexing optimization',
        'STAR methodology for behavioral answers',
      ],
      questionFeedback: scoredQuestions,
      proctorAlertsCount: proctorCount,
    };

    // 1. Save last result and session-specific report in localStorage
    localStorage.setItem('interviewace-last-result', JSON.stringify(finalReport));
    localStorage.setItem(`interviewace-report-${activeSessionId}`, JSON.stringify(finalReport));

    // 2. Prepend to user-isolated interview history array
    try {
      const currentUserId = useAuthStore.getState().user?.id;
      const history = getUserInterviewHistory(currentUserId);
      const updatedHistory = [
        {
          sessionId: activeSessionId,
          role: finalReport.role,
          interviewType: finalReport.interviewType,
          difficulty: finalReport.difficulty,
          date: finalReport.date,
          overallScore: finalReport.overallScore,
          status: 'COMPLETED',
          durationMinutes,
          totalQuestions: questions.length,
        },
        ...history,
      ];
      saveUserInterviewHistory(currentUserId, updatedHistory);
    } catch (saveErr) {
      console.warn('History save error:', saveErr);
    }

    // Redirect to Result Page
    navigate(`/report/${activeSessionId}`);
  };

  const currentQ = questions[currentIndex] || {
    question: 'Loading question...',
    category: 'General',
  };

  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. TOP INTERVIEW HEADER */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">
                {sessionConfig.role || 'Software Engineer'}
              </span>
              <Badge variant="emerald">{sessionConfig.interviewType || 'Technical'}</Badge>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Timer & Progress */}
        <div className="hidden sm:flex items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            <span>Session:</span>
            <span className="text-emerald-700 font-bold">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: End Interview */}
        <div>
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Interview</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN VIEWPORT (Two-Column on Desktop) */}
      <div className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto min-h-0">
        
        {/* Left Column: AI Interviewer Card + Candidate Video */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* AI Interviewer Avatar Card */}
          <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
            {/* Ambient Speaking Ring */}
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? 'bg-emerald-50 ring-8 ring-emerald-200 animate-pulse-slow shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-100 ring-4 ring-slate-200'
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-10 h-10" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-bold text-slate-900 text-sm">Ace</h3>
              <p className="text-[11px] text-slate-500 font-medium">AI Mock Interviewer</p>
            </div>

            {/* Speaking Status Pill */}
            <div className="mt-2.5">
              {isSpeaking ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  <Volume2 className="w-3 h-3 animate-bounce" />
                  Speaking Question...
                </span>
              ) : isListening ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold">
                  <Mic className="w-3 h-3 animate-pulse" />
                  Listening to You...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                  Waiting for Response
                </span>
              )}
            </div>
          </div>

          {/* Candidate Webcam Feed Thumbnail */}
          <div className="h-40 bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-200/60 shadow-xs flex items-center justify-center">
            {isCamOn && webcamStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
                <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                <span>Webcam Feed Muted</span>
              </div>
            )}

            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                Candidate (You)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 text-[10px] font-mono">
                {isMicOn ? 'Mic On' : 'Mic Off'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Question Card & Answer Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
          
          {/* Question Card */}
          <Card className="border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="emerald">{currentQ.category || 'Core Question'}</Badge>
              <button
                type="button"
                onClick={handleReplayQuestion}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Voice</span>
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Question {currentIndex + 1}
              </p>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                "{currentQ.question}"
              </h2>
            </div>
          </Card>

          {/* Answer Workspace Box */}
          <Card className="flex-1 flex flex-col justify-between border-slate-200 shadow-xs p-4 sm:p-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">
                  Your Answer (Speak or Type):
                </label>
                {recognitionSupported && (
                  <span className="text-[11px] text-slate-400">
                    {isListening ? 'Speech Recognition Active' : 'Microphone Ready'}
                  </span>
                )}
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Click 'Start Speaking' to answer with your voice, or type your response directly into this box..."
                rows={6}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none resize-none transition-all"
              />
            </div>

            {/* Answer Controls Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {recognitionSupported && (
                  <Button
                    size="sm"
                    variant={isListening ? 'danger' : 'secondary'}
                    onClick={handleToggleListening}
                    icon={<Mic className="w-4 h-4" />}
                  >
                    {isListening ? 'Stop Speaking' : 'Start Speaking'}
                  </Button>
                )}

                {currentAnswer && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentAnswer('');
                      clearTranscript();
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 rounded-lg hover:bg-slate-100"
                    title="Clear response"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitAnswer}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                {currentIndex + 1 < questions.length ? 'Submit & Next Question' : 'Finish & View Report'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. BOTTOM CONTROL BAR (Video Meeting Style) */}
      <footer className="h-16 bg-white border-t border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-2">
          {/* Mic Toggle */}
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isMicOn
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleCam}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isCamOn
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
            title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isCamOn ? <Video className="w-4 h-4 text-emerald-600" /> : <VideoOff className="w-4 h-4" />}
          </button>

          {/* AI Voice Toggle */}
          <button
            onClick={() => {
              if (!isVoiceMuted) stopSpeaking();
              setIsVoiceMuted((prev) => !prev);
            }}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              !isVoiceMuted
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={isVoiceMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
          >
            {!isVoiceMuted ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowExitModal(true)}
            icon={<PhoneOff className="w-3.5 h-3.5" />}
          >
            End
          </Button>
        </div>
      </footer>

      {/* --- CONFIRMATION MODAL TO END INTERVIEW --- */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="End Mock Interview Session?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to exit? You have answered {Object.keys(userAnswers).length} of{' '}
            {questions.length} questions. You can generate a partial report or return to the dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <Button
              variant="danger"
              fullWidth
              onClick={() => finishInterviewAndGenerateReport(userAnswers)}
            >
              End & Generate Report
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowExitModal(false)}
            >
              Continue Practicing
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- PROCTORING WARNING MODAL --- */}
      {proctorWarning && (
        <Modal
          isOpen={!!proctorWarning}
          onClose={() => setProctorWarning(null)}
          title="Interview Proctoring Notice"
        >
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              {proctorWarning}
            </p>
            <Button variant="primary" fullWidth onClick={() => setProctorWarning(null)}>
              I Understand & Return to Interview
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
