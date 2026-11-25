import React from 'react';
import { AlertOctagon, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Class-based Error Boundary that catches runtime JavaScript errors in child component trees.
 * Renders a sleek dark-slate recovery view (bg-slate-950, border-slate-800) with diagnostic info
 * and recovery actions (Reload or Return to Dashboard).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log technical diagnostics for debugging
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoDashboard = () => {
    window.location.href = '/dashboard';
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected application error occurred.';
      const componentStack = this.state.errorInfo?.componentStack;

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Recovery Card */}
          <div className="relative z-10 max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Alert Icon & Heading */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-2">
                Runtime Error Caught
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
                An unexpected issue interrupted this view. Your interview progress and configuration
                have been safely preserved in session storage.
              </p>
            </div>

            {/* Error Message Summary Box */}
            <div className="my-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Error Message
              </span>
              <p className="text-xs font-mono text-rose-300 break-words">{errorMessage}</p>
            </div>

            {/* Collapsible Technical Stack Diagnostics */}
            {componentStack && (
              <div className="mb-6 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer mb-2"
                >
                  {this.state.showDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                  <span>{this.state.showDetails ? 'Hide' : 'Show'} Component Stack</span>
                </button>

                {this.state.showDetails && (
                  <pre className="max-h-48 overflow-y-auto p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
                    {componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoDashboard}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
