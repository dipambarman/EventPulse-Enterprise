const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

const { adminOnly } = require('../middleware/roleMiddleware');
const { body, query } = require('express-validator');

// Admin Routes (Must be before /:id)
router.get('/admin/analytics', authMiddleware, adminOnly, bookingController.getAdminAnalytics);
router.get('/admin/all', authMiddleware, adminOnly, bookingController.getAllBookings);

router.get('/availability', [
  query('themeId').notEmpty().withMessage('themeId is required').trim().escape()
], bookingController.checkAvailability);

router.post('/', optionalAuth, bookingController.createBooking);
router.get('/session/booking', bookingController.getBookingFromSession);
router.get('/user', authMiddleware, bookingController.getUserBookings);
router.get('/:id', optionalAuth, bookingController.getBookingById);
router.patch('/:id', authMiddleware, adminOnly, bookingController.updateBooking);
router.post('/:id/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;
