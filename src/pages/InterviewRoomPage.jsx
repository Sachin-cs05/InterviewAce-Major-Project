import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bot,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  Sparkles,
  Send,
  ArrowRight,
} from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';

/**
 * Placeholder component for the Live AI Interview Room.
 * Note: MainLayout automatically hides the top navigation bar when on this route!
 * Assigned to: Member 4
 */
export default function InterviewRoomPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const {
    status,
    setStatus,
    isMicOn,
    isCamOn,
    toggleMic,
    toggleCam,
    transcript,
    addTranscriptMessage,
    sessionConfig,
  } = useInterviewStore();

  const activeSessionId = sessionId || 'sess_101';

  // Seed initial question if transcript is empty
  useEffect(() => {
    if (transcript.length === 0) {
      addTranscriptMessage(
        'AI',
        `Hello! Welcome to your ${sessionConfig.role} technical interview. Could you start by introducing yourself and walking me through a complex React project you architected?`
      );
    }
  }, [transcript.length, addTranscriptMessage, sessionConfig.role]);

  const handleSimulateAnswer = () => {
    setStatus('PROCESSING');
    addTranscriptMessage(
      'USER',
      'I built a real-time collaborative dashboard using React, Vite, and Zustand. We handled microtask performance optimizations by deferring state updates with startTransition.'
    );

    setTimeout(() => {
      setStatus('AI_SPEAKING');
      addTranscriptMessage(
        'AI',
        'Excellent points on React concurrent features. How did you structure your API caching and handle state persistence across page reloads?'
      );
    }, 1200);
  };

  return (
    <div className="h-full min-h-[calc(100vh-2rem)] flex flex-col justify-between bg-slate-950 text-slate-100 p-4 sm:p-6">
      {/* Top Session Bar (Distraction-free, room specific) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">{sessionConfig.role} Interview</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Session ID: {activeSessionId}</p>
          </div>
        </div>

        {/* Ownership Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <Bot className="w-3.5 h-3.5" />
          <span>Assigned: Member 4 (Live Room & Media)</span>
        </div>

        {/* Working Finish & Report Navigation */}
        <button
          onClick={() => {
            setStatus('COMPLETED');
            navigate(`/report/${activeSessionId}`);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>Finish & View Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Room Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 flex-1">
        {/* Left: AI Avatar & Candidate Video Feeds */}
        <div className="lg:col-span-2 flex flex-col gap-4 justify-between">
          {/* AI Avatar Display */}
          <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  status === 'AI_SPEAKING'
                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 ring-8 ring-indigo-500/20 animate-pulse'
                    : 'bg-slate-800 ring-4 ring-slate-700'
                }`}
              >
                <Bot className="w-16 h-16 text-white" />
              </div>

              {status === 'AI_SPEAKING' && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-500 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-bounce" /> Speaking
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-base font-semibold text-white">AI Technical Interviewer</h3>
              <p className="text-xs text-slate-400 mt-1">
                Status:{' '}
                <span className="font-mono text-indigo-400 uppercase font-medium">{status}</span>
              </p>
            </div>

            {/* Quick Simulation Button for Testing */}
            <div className="mt-4">
              <button
                onClick={handleSimulateAnswer}
                className="text-xs px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Simulate Candidate Spoken Answer</span>
              </button>
            </div>
          </div>

          {/* User Video Simulator Thumb */}
          <div className="h-32 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                {isCamOn ? (
                  <Video className="w-6 h-6 text-indigo-400" />
                ) : (
                  <VideoOff className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">Candidate Feed</p>
                <p className="text-[10px] text-slate-400">
                  {isMicOn ? 'Mic Unmuted' : 'Mic Muted'} • {isCamOn ? 'Video Active' : 'Video Off'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isMicOn
                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleCam}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isCamOn
                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Transcript Viewport */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-800">
              Live Transcript & Feedback
            </h4>
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {transcript.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'AI'
                      ? 'bg-slate-950 border border-slate-800/80 text-slate-200'
                      : 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-200 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-indigo-400">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Audio stream active. Click finish to compute final score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
