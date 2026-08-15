require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const paymentRoutes = require('./routes/paymentRoutes');
const { connectWithRetry } = require('./shared/rabbitmq');

const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 5004;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Microservice Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Payment Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Payment Routes
app.use('/api/payments', paymentRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('[Payment Service Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, async () => {
  console.log(`💳 Payment Microservice running on port ${PORT}`);

  // Connect to RabbitMQ (producer only — no consumers needed)
  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  await connectWithRetry(RABBITMQ_URL);
});
