require('dotenv').config({ path: '../../../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bookingRoutes = require('../../routes/bookingRoutes');
const { errorHandler } = require('../../middleware/errorHandler');

const app = express();
const PORT = process.env.BOOKING_SERVICE_PORT || 5003;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Microservice Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Booking & Reservation Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Booking Routes
app.use('/api/bookings', bookingRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`📅 Booking Microservice running on port ${PORT}`);
});
