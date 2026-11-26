import React from 'react';
import { Bot, Volume2, Mic, Loader2 } from 'lucide-react';

/**
 * AiAvatar — displays the AI Interviewer stage card.
 * Animates based on the current interview status and shows the active question text.
 *
 * @param {{ status: string, currentQuestion: string }} props
 */
export default function AiAvatar({ status, currentQuestion }) {
  // ─── Ring animation config per status ───────────────────────────────────────
  const isAiSpeaking = status === 'AI_SPEAKING';
  const isUserTurn = status === 'USER_LISTENING';
  const isProcessing = status === 'PROCESSING';

  // Avatar gradient — indigo when AI speaks, emerald on user turn, muted otherwise
  const avatarGradient = isAiSpeaking
    ? 'from-indigo-600 via-violet-600 to-purple-600'
    : isUserTurn
    ? 'from-emerald-600 to-teal-500'
    : 'from-slate-700 to-slate-600';

  const avatarRing = isAiSpeaking
    ? 'ring-indigo-500/40'
    : isUserTurn
    ? 'ring-emerald-500/40'
    : 'ring-slate-700/60';

  // Status badge config
  const badge = isAiSpeaking
    ? { label: 'AI is speaking…', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: <Volume2 className="w-3 h-3" /> }
    : isUserTurn
    ? { label: 'Your turn to speak…', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: <Mic className="w-3 h-3" /> }
    : isProcessing
    ? { label: 'AI is evaluating your answer…', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: <Loader2 className="w-3 h-3 animate-spin" /> }
    : null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-6 select-none">
      {/* ── Concentric pulse rings (AI_SPEAKING only) ── */}
      {isAiSpeaking && (
        <>
          <span className="absolute w-56 h-56 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <span className="absolute w-44 h-44 rounded-full border border-violet-500/25 animate-ping" style={{ animationDuration: '2.5s' }} />
          <span className="absolute w-36 h-36 rounded-full border border-purple-500/30 animate-ping" style={{ animationDuration: '3s' }} />
        </>
      )}

      {/* ── Emerald border ring (USER_LISTENING only) ── */}
      {isUserTurn && (
        <span className="absolute w-44 h-44 rounded-full border-2 border-emerald-500/50 animate-pulse" />
      )}

      {/* ── Spinning ring (PROCESSING only) ── */}
      {isProcessing && (
        <span className="absolute w-44 h-44 rounded-full border-2 border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: '3s' }} />
      )}

      {/* ── Avatar circle ── */}
      <div
        className={`relative z-10 w-32 h-32 rounded-full bg-gradient-to-br ${avatarGradient} ring-8 ${avatarRing} flex items-center justify-center shadow-2xl transition-all duration-500`}
      >
        <Bot className="w-16 h-16 text-white drop-shadow-lg" />
      </div>

      {/* ── Label ── */}
      <div className="z-10 text-center space-y-1">
        <p className="text-base font-semibold text-slate-100 tracking-tight">AI Technical Interviewer</p>
        <p className="text-xs text-slate-400">Powered by InterviewAce AI</p>
      </div>

      {/* ── Status badge ── */}
      {badge && (
        <div
          className={`z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${badge.color} transition-all duration-300`}
        >
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      )}

      {/* ── Current question text overlay ── */}
      {currentQuestion && (
        <div className="z-10 mx-auto max-w-xl px-5 py-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 backdrop-blur-sm text-center">
          <p className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold mb-1.5">
            Current Question
          </p>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">{currentQuestion}</p>
        </div>
      )}
    </div>
  );
}
