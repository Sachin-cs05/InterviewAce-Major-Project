import React, { useMemo } from 'react';

/**
 * AudioVisualizer — a multi-bar animated equalizer.
 *
 * @param {{
 *   audioLevel: number,   // 0–100 live level from useMediaStream
 *   isActive: boolean     // false = muted/idle → flat bars
 * }} props
 */
export default function AudioVisualizer({ audioLevel = 0, isActive = false }) {
  const BAR_COUNT = 7;

  // Precomputed multipliers give the classic equalizer shape (tall in the center)
  const multipliers = useMemo(() => [0.4, 0.6, 0.8, 1.0, 0.8, 0.6, 0.4], []);

  return (
    <div className="flex items-end justify-center gap-[3px] h-7" aria-hidden="true">
      {multipliers.map((mult, i) => {
        // Each bar's height: 2px minimum (idle) up to 28px max (fully active)
        const heightPercent = isActive ? Math.max(8, Math.min(100, audioLevel * mult)) : 8;
        const heightPx = Math.round((heightPercent / 100) * 28);

        return (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: 3,
              height: `${heightPx}px`,
              minHeight: 3,
              background: isActive
                ? `hsl(${142 - (heightPercent / 100) * 20}, 72%, ${45 + (heightPercent / 100) * 15}%)`
                : '#334155', // slate-700 when idle
              transitionProperty: 'height, background-color',
              transitionDuration: '80ms',
              transitionTimingFunction: 'ease-out',
            }}
          />
        );
      })}
    </div>
  );
}
