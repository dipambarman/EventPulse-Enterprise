require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bookingRoutes = require('./routes/bookingRoutes');
const { connectWithRetry, consumeEvent } = require('./shared/rabbitmq');
const prisma = require('./db/db');

const app = express();
const PORT = process.env.BOOKING_SERVICE_PORT || 5003;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Microservice Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Booking Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Booking Routes
app.use('/api/bookings', bookingRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('[Booking Service Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, async () => {
  console.log(`📅 Booking Microservice running on port ${PORT}`);

  // Connect to RabbitMQ and start consuming events
  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const channel = await connectWithRetry(RABBITMQ_URL);

  if (channel) {
    // When a payment is verified, update the booking status to 'confirmed'
    await consumeEvent('booking.payment_confirmed', 'payment.verified', async (msg) => {
      const { bookingId } = msg;
      if (!bookingId) return;

      try {
        let status = await prisma.bookingStatus.findUnique({ where: { name: 'confirmed' } });
        if (!status) {
          status = await prisma.bookingStatus.create({ data: { name: 'confirmed' } });
        }
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status_id: status.id }
        });
        console.log(`[Booking Service] ✅ Booking ${bookingId} confirmed via payment.verified event`);
      } catch (err) {
        console.error(`[Booking Service] ❌ Failed to confirm booking ${bookingId}:`, err.message);
        throw err; // Re-throw so RabbitMQ can nack/retry
      }
    });
  }
});
