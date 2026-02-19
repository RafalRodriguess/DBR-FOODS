import React, { Component, ErrorInfo, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-lg shadow-xl border border-gray-200">
            <h2 className="text-xl font-bold text-red-600 mb-4">Erro na aplicação</h2>
            <p className="text-gray-700 mb-4">{this.state.error.message}</p>
            <pre className="text-xs bg-gray-50 p-4 rounded-xl overflow-auto max-h-40 text-gray-600 mb-6">
              {this.state.error.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-950 text-white rounded-xl font-bold text-sm hover:bg-gold transition-colors"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
