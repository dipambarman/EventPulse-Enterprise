const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/payments/create-intent - create payment intent (auth required)
router.post('/create-intent', authMiddleware, paymentController.createPaymentIntent);

// POST /api/payments/confirm/:paymentIntentId - confirm payment (auth required)
router.post('/confirm/:paymentIntentId', authMiddleware, paymentController.confirmPayment);

// GET /api/payments/methods - get payment methods (auth required)
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);

// POST /api/payments/methods - add payment method (auth required)
router.post('/methods', authMiddleware, paymentController.addPaymentMethod);

// DELETE /api/payments/methods/:paymentMethodId - remove payment method (auth required)
router.delete('/methods/:paymentMethodId', authMiddleware, paymentController.removePaymentMethod);

// GET /api/payments/history - get payment history (auth required)
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

// POST /api/payments/:paymentId/refund - request refund (auth required)
router.post('/:paymentId/refund', authMiddleware, paymentController.requestRefund);

// Razorpay order creation endpoint (auth required)
router.post('/razorpay/order', authMiddleware, paymentController.createOrder);

// Razorpay payment signature verification endpoint (auth required)
router.post('/razorpay/verify', authMiddleware, paymentController.verifyPaymentSignature);

// Razorpay webhook endpoint (no auth, called by Razorpay)
router.post('/razorpay/webhook', express.json({ type: 'application/json' }), paymentController.handleWebhook);

// GET /api/payments/razorpay/payment/:paymentId - get payment details by payment ID (auth required)
router.get('/razorpay/payment/:paymentId', authMiddleware, paymentController.getPaymentDetails);

module.exports = router;
