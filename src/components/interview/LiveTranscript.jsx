import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

/**
 * LiveTranscript — auto-scrolling conversation log.
 *
 * @param {{ transcript: Array<{ id: string, sender: 'AI'|'USER', text: string, timestamp: string }> }} props
 */
export default function LiveTranscript({ transcript = [] }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message whenever transcript updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Live Transcript
        </span>
        <span className="ml-auto text-[10px] text-slate-500 font-mono">
          {transcript.length} message{transcript.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {transcript.length === 0 && (
          <div className="flex items-center justify-center h-24">
            <p className="text-xs text-slate-500 italic">Transcript will appear here…</p>
          </div>
        )}

        {transcript.map((msg) => {
          const isAI = msg.sender === 'AI';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isAI ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar icon */}
              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                  isAI
                    ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400'
                    : 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400'
                }`}
              >
                {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] px-3 py-2.5 rounded-xl text-xs leading-relaxed ${
                  isAI
                    ? 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none'
                    : 'bg-indigo-600/15 border border-indigo-500/25 text-indigo-100 rounded-tr-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      isAI ? 'text-indigo-400' : 'text-emerald-400'
                    }`}
                  >
                    {isAI ? 'Interviewer' : 'You'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {msg.timestamp}
                  </span>
                </div>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
