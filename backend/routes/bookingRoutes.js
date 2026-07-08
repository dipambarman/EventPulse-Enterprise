const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/bookings/availability - check availability
router.get('/availability', bookingController.checkAvailability);

// POST /api/bookings - create booking (auth required)
router.post('/', authMiddleware, bookingController.createBooking);

// GET /api/bookings/:id - get booking by id (auth required)
router.get('/:id', authMiddleware, bookingController.getBookingById);

// GET /api/bookings/session/booking - get booking data from session (auth required)
router.get('/session/booking', authMiddleware, bookingController.getBookingFromSession);

// PATCH /api/bookings/:id - update booking (auth required)
router.patch('/:id', authMiddleware, bookingController.updateBooking);

// POST /api/bookings/:id/cancel - cancel booking (auth required)
router.post('/:id/cancel', authMiddleware, bookingController.cancelBooking);

// GET /api/bookings/user - get user bookings (auth required)
router.get('/user', authMiddleware, bookingController.getUserBookings);

module.exports = router;
