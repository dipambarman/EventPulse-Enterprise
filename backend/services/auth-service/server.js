require('dotenv').config({ path: '../../../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('../../routes/authRoutes');
const { errorHandler } = require('../../middleware/errorHandler');

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
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🔐 Auth Microservice running on port ${PORT}`);
});
