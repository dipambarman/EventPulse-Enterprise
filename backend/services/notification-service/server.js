require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 5005;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Microservice Health Check Probe
app.get('/health', (req, res) => {
  res.json({ service: 'Notification & Messaging Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Notification Routes
app.use('/api/notifications', notificationRoutes);

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Notification Service Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🔔 Notification Microservice (Email & Web Push) running on port ${PORT}`);
});
