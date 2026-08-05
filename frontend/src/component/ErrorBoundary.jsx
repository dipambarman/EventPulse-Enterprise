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
    console.error('Uncaught React Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: '500px',
          margin: '5rem auto',
          padding: '2.5rem',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          fontFamily: "'Segoe UI', Roboto, sans-serif"
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#2d3436', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#636e72', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            An unexpected visual application error occurred. You can reload the page to continue.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.8rem 1.8rem',
              background: 'linear-gradient(135deg, #6c5ce7, #a8e6cf)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(108,92,231,0.2)'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
