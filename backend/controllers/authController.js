const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// User registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    // Check if user exists
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email or username already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    // Insert user
    await pool.execute(
      'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User logout
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// Forgot Password - Initiate reset flow safely (Anti-User Enumeration)
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  const genericResponse = {
    message: 'If an account with that email exists, password reset instructions have been generated.'
  };

  try {
    const [users] = await pool.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    
    // Anti-user enumeration: Always return the exact same generic message regardless of email existence
    if (!users || users.length === 0) {
      return res.status(200).json(genericResponse);
    }

    const user = users[0];

    // Generate cryptographically secure token & hash it before DB storage
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const resetId = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15-minute validity

    // Invalidate active previous reset tokens for this user
    await pool.execute('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0', [user.id]);

    // Store hashed token in DB
    await pool.execute(
      'INSERT INTO password_resets (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
      [resetId, user.id, tokenHash, expiresAt]
    );

    const clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientBaseUrl}/reset-password?token=${rawToken}`;

    console.log(`[SECURITY AUDIT] Password Reset Requested for ${email}. Reset Link: ${resetLink}`);

    // In non-production or dev environments, include devResetUrl for local testing
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        ...genericResponse,
        devResetUrl: resetLink
      });
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password - Verify token & update password
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, newPassword } = req.body;

  try {
    // Hash incoming token to match DB SHA-256 hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const [resets] = await pool.execute(
      'SELECT id, user_id, expires_at, used FROM password_resets WHERE token_hash = ?',
      [tokenHash]
    );

    if (!resets || resets.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    const resetRecord = resets[0];

    // Check expiration and single-use constraint
    if (resetRecord.used || new Date(resetRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Password reset link is invalid or has expired.' });
    }

    // Hash new password securely
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, resetRecord.user_id]);

    // Mark reset token as used immediately
    await pool.execute('UPDATE password_resets SET used = 1 WHERE id = ?', [resetRecord.id]);

    res.status(200).json({ message: 'Password has been reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
