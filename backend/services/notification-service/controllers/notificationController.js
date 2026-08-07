const emailService = require('../services/emailService');
const pushService = require('../services/pushNotificationService');

exports.sendEmailNotification = async (req, res) => {
  const { type, recipientEmail, customerName, bookingId, eventDate, totalPrice, amount, paymentMethod, resetToken } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ error: 'recipientEmail is required' });
  }

  let result;
  if (type === 'booking_confirmation') {
    result = await emailService.sendBookingConfirmationEmail({ recipientEmail, customerName, bookingId, eventDate, totalPrice });
  } else if (type === 'payment_receipt') {
    result = await emailService.sendPaymentReceiptEmail({ recipientEmail, customerName, bookingId, amount, paymentMethod });
  } else if (type === 'password_reset') {
    result = await emailService.sendPasswordResetEmail({ recipientEmail, resetToken });
  } else {
    return res.status(400).json({ error: `Unsupported email notification type: ${type}` });
  }

  res.status(200).json({ success: true, result });
};

exports.sendPushNotification = async (req, res) => {
  const { userId, title, body, icon, url } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required for push notifications' });
  }

  const result = await pushService.sendPushNotification({ userId: userId || 'usr-default', title, body, icon, url });
  res.status(200).json({ success: true, result });
};

exports.subscribeWebPush = async (req, res) => {
  const { userId, subscription } = req.body;

  if (!subscription) {
    return res.status(400).json({ error: 'subscription object is required' });
  }

  const registered = pushService.registerSubscription(userId || 'usr-default', subscription);
  res.status(201).json({ success: registered, message: 'Web Push subscription registered successfully' });
};

exports.getVapidPublicKey = (req, res) => {
  const key = pushService.getVapidPublicKey();
  res.status(200).json({ publicKey: key });
};
