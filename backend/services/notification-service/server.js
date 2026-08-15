require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const notificationRoutes = require('./routes/notificationRoutes');
const { connectWithRetry, consumeEvent } = require('./shared/rabbitmq');
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 5005;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Microservice Health Check Probe
app.get('/health', (req, res) => {
  res.json({ service: 'Notification & Messaging Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Notification Routes (REST endpoints remain as fallback)
app.use('/api/notifications', notificationRoutes);

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Notification Service Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, async () => {
  console.log(`🔔 Notification Microservice (Email & Web Push) running on port ${PORT}`);

  // Connect to RabbitMQ and start consuming events
  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const channel = await connectWithRetry(RABBITMQ_URL);

  if (channel) {
    // 1. Booking confirmation emails
    await consumeEvent('notification.booking_created', 'booking.created', async (msg) => {
      console.log('[Notification] Processing booking confirmation email...');
      await emailService.sendBookingConfirmationEmail({
        recipientEmail: msg.recipientEmail,
        customerName: msg.customerName,
        bookingId: msg.bookingId,
        eventDate: msg.eventDate,
        totalPrice: msg.totalPrice
      });
    });

    // 2. Payment receipt emails
    await consumeEvent('notification.payment_receipt', 'payment.verified', async (msg) => {
      console.log('[Notification] Processing payment receipt email...');
      await emailService.sendPaymentReceiptEmail({
        recipientEmail: msg.recipientEmail || 'guest@example.com',
        customerName: msg.customerName || 'Guest User',
        bookingId: msg.bookingId,
        amount: msg.amount,
        paymentMethod: msg.paymentMethod
      });
    });

    // 3. Password reset emails
    await consumeEvent('notification.password_reset', 'password.reset_requested', async (msg) => {
      console.log('[Notification] Processing password reset email...');
      await emailService.sendPasswordResetEmail({
        recipientEmail: msg.recipientEmail,
        resetToken: msg.resetToken
      });
    });

    console.log('[Notification] 🎧 All RabbitMQ consumers registered successfully');
  }
});
