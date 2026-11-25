import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  Sparkles,
  FileText,
  Code2,
} from 'lucide-react';

// Store & services
import { useInterviewStore } from '../store/useInterviewStore';
import { submitUserAnswer } from '../services/interviewService';

// Hooks
import useMediaStream from '../hooks/useMediaStream';
import useAudioRecorder from '../hooks/useAudioRecorder';

// Interview-room sub-components
import AiAvatar from '../components/interview/AiAvatar';
import VideoFeed from '../components/interview/VideoFeed';
import LiveTranscript from '../components/interview/LiveTranscript';
import CodePad from '../components/interview/CodePad';

// Common components
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';

// ─── Utility: speak text via SpeechSynthesis ─────────────────────────────────
function speakText(text, onEnd) {
  if (!window.speechSynthesis) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

// ─── Utility: format seconds → MM:SS ─────────────────────────────────────────
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewRoom() {
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();

  // ── Store ──
  const {
    status,
    sessionId,
    sessionConfig,
    currentQuestionIndex,
    transcript,
    isMicOn,
    isCamOn,
    setStatus,
    addTranscriptMessage,
    toggleMic,
    toggleCam,
    resetInterview,
  } = useInterviewStore();

  const activeSessionId = routeSessionId || sessionId || 'demo-session';

  // ── Media stream ──
  const {
    stream,
    videoRef,
    audioLevel,
    isMicActive,
    isCamActive,
    startStream,
    stopStream,
    toggleAudio,
    toggleVideo,
  } = useMediaStream();

  // ── Audio recorder ──
  const { isRecording, recordingDuration, startRecording, stopRecording } =
    useAudioRecorder(stream);

  // ── Local state ──
  const [codeSnippet, setCodeSnippet] = useState('');
  const [activeTab, setActiveTab] = useState('transcript'); // 'transcript' | 'code'
  const [showEndModal, setShowEndModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const elapsedTimerRef = useRef(null);
  const mountedRef = useRef(true);

  // ── Derive current question from transcript ──
  useEffect(() => {
    const aiMessages = transcript.filter((m) => m.sender === 'AI');
    if (aiMessages.length > 0) {
      setCurrentQuestion(aiMessages[aiMessages.length - 1].text);
    }
  }, [transcript]);

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    elapsedTimerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(elapsedTimerRef.current);
  }, []);

  // ── Show toast helper ─────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // ── Speak AI question then start recording ────────────────────────────────
  const speakAndRecord = useCallback(
    (questionText) => {
      setStatus('AI_SPEAKING');
      speakText(questionText, () => {
        if (!mountedRef.current) return;
        setStatus('USER_LISTENING');
        startRecording();
      });
    },
    [setStatus, startRecording]
  );

  // ── On mount: start stream, speak first question ──────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      await startStream();

      // Seed a first question if the transcript is empty (standalone navigation)
      let firstQuestion = '';
      if (transcript.length === 0) {
        firstQuestion = `Welcome to your ${sessionConfig.role} interview. Let's start: Could you explain how the JavaScript event loop operates, contrasting microtasks with macrotasks?`;
        addTranscriptMessage('AI', firstQuestion);
      } else {
        const aiMsgs = transcript.filter((m) => m.sender === 'AI');
        firstQuestion = aiMsgs[aiMsgs.length - 1]?.text || '';
      }

      speakAndRecord(firstQuestion);
    };

    init();

    return () => {
      mountedRef.current = false;
      stopStream();
      window.speechSynthesis?.cancel();
      clearInterval(elapsedTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mic toggle: sync store + media track ─────────────────────────────────
  const handleToggleMic = useCallback(() => {
    toggleMic();
    toggleAudio();
  }, [toggleMic, toggleAudio]);

  // ── Camera toggle: sync store + media track ───────────────────────────────
  const handleToggleCam = useCallback(() => {
    toggleCam();
    toggleVideo();
  }, [toggleCam, toggleVideo]);

  // ── Submit answer ─────────────────────────────────────────────────────────
  const handleSubmitAnswer = useCallback(async () => {
    if (isSubmitting || status === 'PROCESSING') return;

    try {
      setIsSubmitting(true);
      setStatus('PROCESSING');
      window.speechSynthesis?.cancel();

      const audioBlob = await stopRecording();

      const result = await submitUserAnswer(activeSessionId, audioBlob, codeSnippet || null);

      if (!mountedRef.current) return;

      // Add user's transcribed answer
      const userText =
        result?.evaluation?.transcription ||
        '(Audio response submitted — transcription processing)';
      addTranscriptMessage('USER', userText);

      // Handle interview completion
      if (result?.isLastQuestion) {
        setStatus('COMPLETED');
        showToast('Interview complete! Generating your report…', 'success');
        setTimeout(() => {
          navigate(`/report/${activeSessionId}`);
        }, 1500);
        return;
      }

      // Queue next AI question
      const nextQuestion =
        result?.nextQuestion?.question ||
        'Great answer! Could you walk me through a challenging debugging experience and how you resolved it?';

      addTranscriptMessage('AI', nextQuestion);
      speakAndRecord(nextQuestion);
      setCodeSnippet('');
    } catch (err) {
      console.error('[InterviewRoom] submitUserAnswer failed:', err);
      showToast('Something went wrong submitting your answer. Please try again.', 'error');
      setStatus('USER_LISTENING');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    status,
    setStatus,
    stopRecording,
    activeSessionId,
    codeSnippet,
    addTranscriptMessage,
    speakAndRecord,
    showToast,
    navigate,
  ]);

  // ── End interview ─────────────────────────────────────────────────────────
  const handleEndInterview = useCallback(() => {
    window.speechSynthesis?.cancel();
    stopStream();
    clearInterval(elapsedTimerRef.current);
    resetInterview();
    navigate(`/report/${activeSessionId}`);
  }, [stopStream, resetInterview, navigate, activeSessionId]);

  // ── Derived display values ────────────────────────────────────────────────
  const totalQuestions = sessionConfig?.totalQuestions || 5;
  const micOn = isMicOn && isMicActive;
  const camOn = isCamOn && isCamActive;

  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-100 flex flex-col overflow-hidden">

      {/* ══════════════════════ TOP BAR ══════════════════════════════════════ */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-sm z-10">
        {/* Left: branding + session info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white leading-none">
                {sessionConfig?.role || 'SDE-1'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono uppercase">
                {sessionConfig?.difficulty || 'Medium'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              {sessionConfig?.interviewType || 'Technical'} · {activeSessionId}
            </p>
          </div>
        </div>

        {/* Center: question progress pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
          <span className="text-xs font-semibold text-slate-200">
            Question{' '}
            <span className="text-indigo-400">{currentQuestionIndex}</span>
            {' '}of{' '}
            <span className="text-slate-400">{totalQuestions}</span>
          </span>
          {/* Mini progress bar */}
          <div className="w-16 h-1 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: live timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-slate-200 tabular-nums">
            {formatTime(elapsedSeconds)}
          </span>
          {isRecording && (
            <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wide">
              REC {formatTime(recordingDuration)}
            </span>
          )}
        </div>
      </header>

      {/* ══════════════════════ MAIN WORKSPACE ═══════════════════════════════ */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-hidden">

        {/* ── Left/Center Stage (lg:col-span-8) ── */}
        <section className="lg:col-span-8 flex flex-col gap-4 min-h-0">

          {/* AI Avatar card */}
          <div className="flex-1 relative bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden min-h-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)]" />
            <div className="relative h-full p-6 flex items-center justify-center">
              <AiAvatar status={status} currentQuestion={currentQuestion} />
            </div>
          </div>

          {/* VideoFeed PiP card */}
          <div className="h-44 shrink-0">
            <VideoFeed
              videoRef={videoRef}
              isCamOn={camOn}
              isMicOn={micOn}
              audioLevel={audioLevel}
              candidateName="You"
              candidateRole={sessionConfig?.role || 'Candidate'}
            />
          </div>
        </section>

        {/* ── Right Panel (lg:col-span-4) ── */}
        <section className="lg:col-span-4 flex flex-col min-h-0 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="shrink-0 flex border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
                activeTab === 'transcript'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Transcript
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
                activeTab === 'code'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code Editor
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 p-4 overflow-hidden min-h-0">
            {activeTab === 'transcript' ? (
              <LiveTranscript transcript={transcript} />
            ) : (
              <CodePad code={codeSnippet} onChange={setCodeSnippet} />
            )}
          </div>
        </section>
      </main>

      {/* ══════════════════════ BOTTOM CONTROL BAR ═══════════════════════════ */}
      <footer className="shrink-0 flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-sm">

        {/* Left: Mic + Camera toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMic}
            title={micOn ? 'Mute microphone' : 'Unmute microphone'}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              micOn
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{micOn ? 'Mute' : 'Unmute'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleCam}
            title={camOn ? 'Turn off camera' : 'Turn on camera'}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              camOn
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{camOn ? 'Camera' : 'Cam Off'}</span>
          </button>
        </div>

        {/* Center: Submit Answer */}
        <Button
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={status === 'AI_SPEAKING' || status === 'PROCESSING' || status === 'COMPLETED'}
          onClick={handleSubmitAnswer}
          icon={<Send className="w-4 h-4" />}
          iconPosition="left"
        >
          Submit Answer
        </Button>

        {/* Right: End Interview */}
        <Button
          variant="danger"
          size="md"
          onClick={() => setShowEndModal(true)}
          icon={<PhoneOff className="w-4 h-4" />}
          iconPosition="left"
        >
          End Interview
        </Button>
      </footer>

      {/* ══════════════════════ END INTERVIEW MODAL ══════════════════════════ */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End Interview?"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          Are you sure you want to end the interview early? Your progress will be saved and you'll be taken to the feedback report.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => setShowEndModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={() => {
              setShowEndModal(false);
              handleEndInterview();
            }}
            icon={<PhoneOff className="w-4 h-4" />}
          >
            End & View Report
          </Button>
        </div>
      </Modal>

      {/* ══════════════════════ TOAST ════════════════════════════════════════ */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
