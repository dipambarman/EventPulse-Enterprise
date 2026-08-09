const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/create-intent', authMiddleware, [
  body('amount').isNumeric().withMessage('amount must be a number'),
  body('bookingId').notEmpty().withMessage('bookingId is required')
], validateRequest, paymentController.createPaymentIntent);

router.post('/confirm/:paymentIntentId', authMiddleware, paymentController.confirmPayment);
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);
router.post('/methods', authMiddleware, paymentController.addPaymentMethod);
router.delete('/methods/:paymentMethodId', authMiddleware, paymentController.removePaymentMethod);
router.get('/history', authMiddleware, paymentController.getPaymentHistory);
router.post('/:paymentId/refund', authMiddleware, paymentController.requestRefund);

router.post('/razorpay/order', authMiddleware, [
  body('amount').isNumeric().withMessage('amount must be a number')
], validateRequest, paymentController.createOrder);

router.post('/razorpay/verify', authMiddleware, paymentController.verifyPaymentSignature);
router.post('/razorpay/webhook', paymentController.handleWebhook);
router.get('/razorpay/payment/:paymentId', authMiddleware, paymentController.getPaymentDetails);

module.exports = router;
