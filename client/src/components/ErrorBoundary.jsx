import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          margin: '1rem',
          color: '#721c24',
        }}>
          <h2>Something went wrong</h2>
          <p>We encountered an unexpected error. Please try refreshing the page.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '1rem', textAlign: 'left', whiteSpace: 'pre-wrap' }}>
              <summary>Error details (dev only)</summary>
              <p>{this.state.error.toString()}</p>
              {this.state.errorInfo && <p>{this.state.errorInfo.componentStack}</p>}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
