const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register', [
  body('username').notEmpty().withMessage('Username is required').trim().escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

router.post('/logout', authController.logout);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
], authController.forgotPassword);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.resetPassword);

module.exports = router;
