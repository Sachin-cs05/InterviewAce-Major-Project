import React from 'react';
import { UserCircle2 } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

/**
 * VideoFeed — candidate's live mirrored video preview.
 * Shows a placeholder avatar when the camera is off.
 *
 * @param {{
 *   videoRef: React.RefObject,
 *   isCamOn: boolean,
 *   isMicOn: boolean,
 *   audioLevel: number,
 *   candidateName?: string,
 *   candidateRole?: string,
 * }} props
 */
export default function VideoFeed({
  videoRef,
  isCamOn,
  isMicOn,
  audioLevel,
  candidateName = 'You',
  candidateRole = 'Candidate',
}) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
      {/* ── Live video element (always mounted so the ref stays attached) ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
          isCamOn ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* ── Camera-off placeholder ── */}
      {!isCamOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <UserCircle2 className="w-10 h-10 text-slate-500" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Camera is off</p>
        </div>
      )}

      {/* ── Gradient scrim so overlays stay readable ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

      {/* ── Bottom-left: name / role tag ── */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 backdrop-blur-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-100 leading-none">{candidateName}</span>
        <span className="text-[10px] text-slate-400 leading-none">· {candidateRole}</span>
      </div>

      {/* ── Bottom-right: audio visualizer ── */}
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 backdrop-blur-sm">
        <AudioVisualizer audioLevel={audioLevel} isActive={isMicOn} />
      </div>
    </div>
  );
}
