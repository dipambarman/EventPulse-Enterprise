import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import '../styles/Login.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({ token, newPassword });
      setMessage(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <p style={{ textAlign: 'center', color: '#636e72', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Set a new secure password for your account.
      </p>

      {!token && (
        <div className="error-message">
          No valid reset token found in URL link. Please request a new password reset.
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {message && (
        <div style={{
          background: '#d3f9d8',
          color: '#2b8a3e',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: 500,
          border: '1px solid #b2f2bb'
        }}>
          {message}
          <br />
          <span style={{ fontSize: '0.85rem' }}>Redirecting to login in 3 seconds...</span>
        </div>
      )}

      {token && !message && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">New Password:</label>
            <input
              type="password"
              id="newPassword"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/login" style={{ color: '#6c5ce7', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
