import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

/**
 * Public Footer Component (White & Emerald Theme)
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">
                Interview<span className="text-emerald-600">Ace</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              An intelligent, browser-based mock interview simulator built for college students to
              practice technical, HR, and behavioral interviews with real-time feedback.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
              <span>Final-Year Major Project Demo</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-800 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/setup" className="hover:text-emerald-600 transition-colors">
                  Create Interview
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-emerald-600 transition-colors">
                  Interview History
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-600 transition-colors">
                  About Team & Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-800 mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-emerald-600 transition-colors">
                  Interview Tracks
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-600 transition-colors">
                  FAQ & Instructions
                </a>
              </li>
              <li>
                <Link to="/settings" className="hover:text-emerald-600 transition-colors">
                  Preferences & Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 InterviewAce • Developed by 5 Final-Year Major Project Students</p>
          <p className="flex items-center gap-1">
            Built with React, Vite & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
