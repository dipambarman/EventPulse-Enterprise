const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /api/notifications/email - Dispatch transactional email
router.post('/email', [
  body('type').notEmpty().withMessage('Type is required'),
  body('recipientEmail').isEmail().withMessage('Valid email is required')
], validateRequest, notificationController.sendEmailNotification);

// POST /api/notifications/push - Dispatch Web Push / FCM Push notification
router.post('/push', [
  body('payload').notEmpty().withMessage('Payload is required')
], validateRequest, notificationController.sendPushNotification);

// POST /api/notifications/subscribe - Register browser Web Push subscription
router.post('/subscribe', [
  body('subscription').notEmpty().withMessage('Subscription object is required')
], validateRequest, notificationController.subscribeWebPush);

// GET /api/notifications/vapid-public-key - Fetch VAPID public key for frontend push registration
router.get('/vapid-public-key', notificationController.getVapidPublicKey);

module.exports = router;
