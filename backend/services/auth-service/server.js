require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { connectWithRetry } = require('./shared/rabbitmq');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 5001;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Microservice Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Auth Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('[Auth Service Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, async () => {
  console.log(`🔐 Auth Microservice running on port ${PORT}`);

  // Connect to RabbitMQ (producer only — no consumers needed)
  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  await connectWithRetry(RABBITMQ_URL);
});
