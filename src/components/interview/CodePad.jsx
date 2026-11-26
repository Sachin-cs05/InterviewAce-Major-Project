import React, { useState, useRef, useCallback } from 'react';
import { Code2, Trash2, ChevronDown } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++'];

const PLACEHOLDERS = {
  JavaScript: '// Write your JavaScript solution here…\n\nfunction solution() {\n  \n}',
  Python:     '# Write your Python solution here…\n\ndef solution():\n    pass',
  Java:       '// Write your Java solution here…\n\npublic class Solution {\n    public void solve() {\n        \n    }\n}',
  'C++':      '// Write your C++ solution here…\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
};

/**
 * CodePad — dark-mode coding textarea with language selector,
 * simulated line numbers, Tab-key indentation, and a Clear button.
 *
 * @param {{ code: string, onChange: (code: string) => void }} props
 */
export default function CodePad({ code, onChange }) {
  const [language, setLanguage] = useState('JavaScript');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const textareaRef = useRef(null);

  // ── Tab key → 2 spaces (no focus loss) ───────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const el = textareaRef.current;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const indent = '  '; // 2 spaces

        const next = code.substring(0, start) + indent + code.substring(end);
        onChange(next);

        // Restore cursor after React re-render
        requestAnimationFrame(() => {
          el.selectionStart = start + indent.length;
          el.selectionEnd = start + indent.length;
        });
      }
    },
    [code, onChange]
  );

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
    // Only swap to new placeholder when the editor is effectively empty
    if (!code.trim()) {
      onChange(PLACEHOLDERS[lang]);
    }
  };

  const handleClear = () => {
    onChange(PLACEHOLDERS[language]);
    textareaRef.current?.focus();
  };

  // ── Line numbers ─────────────────────────────────────────────────────────
  const lineCount = (code || '').split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Code Editor
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* ── Language selector ── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium hover:border-slate-600 transition-colors"
            >
              {language}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-700 transition-colors ${
                      lang === language ? 'text-indigo-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Clear button ── */}
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs hover:text-rose-400 hover:border-rose-500/40 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      {/* ── Editor area ── */}
      <div className="flex-1 flex rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 font-mono text-xs min-h-0">
        {/* Line numbers gutter */}
        <div
          aria-hidden="true"
          className="select-none py-3 px-2 text-right bg-slate-900/60 border-r border-slate-800 text-slate-600 leading-5 overflow-hidden shrink-0"
          style={{ minWidth: '2.5rem' }}
        >
          {lineNumbers.map((n) => (
            <div key={n} className="leading-5">
              {n}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder={PLACEHOLDERS[language]}
          className="flex-1 resize-none bg-transparent text-slate-200 py-3 px-3 leading-5 focus:outline-none placeholder:text-slate-700 caret-indigo-400"
        />
      </div>
    </div>
  );
}
