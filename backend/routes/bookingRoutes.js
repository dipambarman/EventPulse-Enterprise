const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, query } = require('express-validator');

// GET /api/bookings/availability - check availability
router.get('/availability', [
  query('themeId').notEmpty().withMessage('themeId is required').trim().escape(),
  query('startDate').notEmpty().withMessage('startDate is required').isISO8601(),
  query('endDate').notEmpty().withMessage('endDate is required').isISO8601()
], bookingController.checkAvailability);

// POST /api/bookings - create booking (auth required)
router.post('/', authMiddleware, [
  body('themeId').notEmpty().withMessage('themeId is required').trim().escape(),
  body('date').notEmpty().withMessage('date is required').isISO8601(),
  body('customerInfo.name').optional().trim().escape(),
  body('customerInfo.email').optional().isEmail().normalizeEmail(),
  body('customerInfo.phone').optional().trim().escape()
], bookingController.createBooking);

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
