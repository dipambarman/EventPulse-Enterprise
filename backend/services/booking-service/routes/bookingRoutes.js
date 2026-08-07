const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, query } = require('express-validator');

router.get('/availability', [
  query('themeId').notEmpty().withMessage('themeId is required').trim().escape()
], bookingController.checkAvailability);

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/session/booking', authMiddleware, bookingController.getBookingFromSession);
router.get('/user', authMiddleware, bookingController.getUserBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.patch('/:id', authMiddleware, bookingController.updateBooking);
router.post('/:id/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;
