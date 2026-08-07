const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /api/notifications/email - Dispatch transactional email
router.post('/email', notificationController.sendEmailNotification);

// POST /api/notifications/push - Dispatch Web Push / FCM Push notification
router.post('/push', notificationController.sendPushNotification);

// POST /api/notifications/subscribe - Register browser Web Push subscription
router.post('/subscribe', notificationController.subscribeWebPush);

// GET /api/notifications/vapid-public-key - Fetch VAPID public key for frontend push registration
router.get('/vapid-public-key', notificationController.getVapidPublicKey);

module.exports = router;
