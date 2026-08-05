import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import '../styles/Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setDevResetUrl('');
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
      if (res.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
      }
      setEmail('');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Forgot Password</h2>
      <p style={{ textAlign: 'center', color: '#636e72', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Enter your registered email address and we will generate instructions to safely reset your password.
      </p>

      {error && <div className="error-message">{error}</div>}

      {message && (
        <div style={{
          background: '#e3fafc',
          color: '#0c8599',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: 500,
          border: '1px solid #99e9f2'
        }}>
          {message}
        </div>
      )}

      {devResetUrl && (
        <div style={{
          background: '#fff9db',
          border: '1px solid #ffe066',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          wordBreak: 'break-all'
        }}>
          <strong>🛠️ Dev Test Link:</strong>
          <br />
          <a href={devResetUrl} style={{ color: '#d9480f', fontWeight: 600 }}>
            Click here to test password reset directly
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/login" style={{ color: '#6c5ce7', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
