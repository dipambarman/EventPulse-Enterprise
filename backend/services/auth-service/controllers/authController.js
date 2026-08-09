const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';
const RESET_TOKEN_EXPIRY_MINUTES = 15;

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await db.query(
      'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role || 'client' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role || 'client' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Forgot Password — Secure Token Generation
 * 
 * Security measures:
 * 1. Generate 32-byte cryptographically random token
 * 2. Store SHA-256 hash of token in DB (never store plaintext)
 * 3. Token expires in 15 minutes
 * 4. Anti-enumeration: always return same response regardless of email existence
 * 5. In dev mode, return the reset URL directly for testing
 */
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  const genericResponse = { message: 'If an account with that email exists, a password reset link has been sent.' };

  try {
    // Look up user — but always return same response (anti-enumeration)
    const [users] = await db.query('SELECT id, email, username FROM users WHERE email = ?', [email]);

    if (!users || users.length === 0) {
      // Anti-enumeration: respond identically even if user doesn't exist
      return res.status(200).json(genericResponse);
    }

    const user = users[0];

    // Generate cryptographically secure random token (32 bytes → 64-char hex)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // SHA-256 hash the token before storing (never store plaintext tokens)
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Set expiry: 15 minutes from now
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    // Store hashed token in password_resets table
    const resetId = uuidv4();
    await db.query(
      'INSERT INTO password_resets (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
      [resetId, user.id, tokenHash, expiresAt.toISOString()]
    );

    // Dispatch password reset email via Notification Service
    try {
      await fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'password_reset',
          recipientEmail: user.email,
          customerName: user.username,
          resetToken: rawToken // Send plaintext token in email (user clicks link)
        })
      });
      console.log(`[Auth Service] Password reset email dispatched for ${user.email}`);
    } catch (emailErr) {
      console.warn('[Auth Service] Notification service unreachable, email not sent:', emailErr.message);
    }

    // Build response — include dev test link in development mode
    const response = { ...genericResponse };
    if (process.env.NODE_ENV !== 'production') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      response.devResetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
      console.log(`[Auth Service] DEV reset link: ${response.devResetUrl}`);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reset Password — Secure Token Verification
 * 
 * Security measures:
 * 1. SHA-256 hash the incoming token to compare against stored hash
 * 2. Verify token hasn't expired (15-min window)
 * 3. Verify token hasn't been used before
 * 4. Bcrypt hash the new password before storing
 * 5. Mark token as used after successful reset
 */
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, newPassword } = req.body;

  try {
    // SHA-256 hash the incoming token to match against DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Query for valid, unexpired, unused token
    const [resets] = await db.query(
      'SELECT id, user_id FROM password_resets WHERE token_hash = ? AND expires_at > NOW() AND used = FALSE',
      [tokenHash]
    );

    if (!resets || resets.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' });
    }

    const resetRecord = resets[0];

    // Bcrypt hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await db.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, resetRecord.user_id]
    );

    // Mark the reset token as used (one-time use)
    await db.query(
      'UPDATE password_resets SET used = TRUE WHERE id = ?',
      [resetRecord.id]
    );

    console.log(`[Auth Service] Password reset successful for user ${resetRecord.user_id}`);
    res.status(200).json({ message: 'Password has been reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

