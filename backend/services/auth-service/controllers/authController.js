const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const auditService = require('../services/auditService');

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
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    await prisma.user.create({
      data: {
        id,
        username,
        email,
        password_hash: hashedPassword,
        role: 'client'
      }
    });

    await auditService.logAction(id, 'USER_REGISTER', 'users', id, { email, username });

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
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role || 'client' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    await auditService.logAction(user.id, 'USER_LOGIN', 'users', user.id, { ip: req.ip });

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

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  const genericResponse = { message: 'If an account with that email exists, a password reset link has been sent.' };

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true }
    });

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    const resetId = uuidv4();
    await prisma.passwordReset.create({
      data: {
        id: resetId,
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt
      }
    });

    const { publishEvent } = require('../shared/rabbitmq');
    publishEvent('password.reset_requested', {
      recipientEmail: user.email,
      customerName: user.username,
      resetToken: rawToken
    });
    console.log(`[Auth Service] Password reset event published for ${user.email}`);

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

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, newPassword } = req.body;

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        token_hash: tokenHash,
        expires_at: { gt: new Date() },
        used: false
      }
    });

    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: resetRecord.user_id },
      data: { password_hash: hashedPassword }
    });

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true }
    });

    console.log(`[Auth Service] Password reset successful for user ${resetRecord.user_id}`);
    res.status(200).json({ message: 'Password has been reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
