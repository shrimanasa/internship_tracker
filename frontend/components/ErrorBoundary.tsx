'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-500 max-w-md mb-6">
            {this.props.fallbackMessage || 'An unexpected error occurred while rendering this component. Please try again.'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          {this.state.error && (
            <details className="mt-4 text-left max-w-lg w-full">
              <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Error Details</summary>
              <pre className="mt-2 p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 overflow-auto border border-slate-100">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
