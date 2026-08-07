require('dotenv').config({ path: '../../../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const paymentRoutes = require('../../routes/paymentRoutes');
const { errorHandler } = require('../../middleware/errorHandler');

const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 5004;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Microservice Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Payment & Billing Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Payment Routes
app.use('/api/payments', paymentRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`💳 Payment Microservice running on port ${PORT}`);
});
