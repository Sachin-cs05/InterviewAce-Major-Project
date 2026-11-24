import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Mic, MicOff, Video, VideoOff, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';

/**
 * Placeholder component for Hardware & Device Readiness Verification.
 * Assigned to: Member 4
 */
export default function DeviceCheckPage() {
  const navigate = useNavigate();
  const { isMicOn, isCamOn, toggleMic, toggleCam, sessionId } = useInterviewStore();

  const activeSessionId = sessionId || 'sess_101';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
          <Bot className="w-3.5 h-3.5" />
          <span>Assigned: Member 4 (Media Diagnostics & Device Check)</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Device Readiness Check</h1>
        <p className="text-sm text-slate-400 mt-1">
          Verify your microphone, webcam, and browser permissions before entering the live interview room.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Preview Simulator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center relative overflow-hidden">
          {isCamOn ? (
            <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-400">
              <Video className="w-8 h-8 text-indigo-400 mb-2" />
              <span className="text-xs font-medium text-slate-300">Camera Feed Active (Simulated)</span>
              <span className="text-[10px] text-emerald-400 font-mono mt-1">720p HD @ 30fps</span>
            </div>
          ) : (
            <div className="w-full h-44 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-400">
              <VideoOff className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs">Webcam Disabled</span>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={toggleCam}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isCamOn
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {isCamOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              <span>{isCamOn ? 'Mute Video' : 'Enable Video'}</span>
            </button>

            <button
              onClick={toggleMic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isMicOn
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
              <span>{isMicOn ? 'Mic Active' : 'Unmute Mic'}</span>
            </button>
          </div>
        </div>

        {/* Readiness Checklist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Pre-Flight System Status
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                <span className="text-slate-300">Microphone Input Signal</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                <span className="text-slate-300">Webcam Permission</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                <span className="text-slate-300">Network Latency</span>
                <span className="text-emerald-400 font-mono">24 ms (Excellent)</span>
              </div>

              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-slate-300">Audio Output (Speaker)</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>
            </div>
          </div>

          {/* Action Button to Next Step */}
          <div className="pt-6">
            <button
              onClick={() => navigate(`/interview/${activeSessionId}`)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Enter Live Interview Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
