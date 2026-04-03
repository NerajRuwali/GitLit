import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    fetch('http://localhost:4444/', { method: 'POST', body: error.stack || String(error) }).catch(e=>console.log(e));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
          <div className="max-w-md w-full glass-card p-10 border-red-500/20 bg-red-500/5 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black mb-4 tracking-tighter">Something went wrong</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We encountered an unexpected error while rendering this page. This could be due to invalid data or a temporary service issue.
            </p>
            <pre className="text-left text-xs bg-black/50 p-4 rounded overflow-auto mb-8 text-red-300">
              {this.state.error && this.state.error.toString()}
              {'\n'}
              {this.state.error && this.state.error.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-yellow-500 text-slate-900 rounded-xl font-bold tracking-widest uppercase text-xs transition-all hover:bg-yellow-400 active:scale-95 shadow-glow"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
