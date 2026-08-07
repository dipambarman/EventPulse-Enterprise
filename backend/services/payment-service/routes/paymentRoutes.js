const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.post('/create-intent', authMiddleware, paymentController.createPaymentIntent);
router.post('/confirm/:paymentIntentId', authMiddleware, paymentController.confirmPayment);
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);
router.post('/methods', authMiddleware, paymentController.addPaymentMethod);
router.delete('/methods/:paymentMethodId', authMiddleware, paymentController.removePaymentMethod);
router.get('/history', authMiddleware, paymentController.getPaymentHistory);
router.post('/:paymentId/refund', authMiddleware, paymentController.requestRefund);

router.post('/razorpay/order', authMiddleware, [
  body('amount').isNumeric().withMessage('amount must be a number')
], paymentController.createOrder);

router.post('/razorpay/verify', authMiddleware, paymentController.verifyPaymentSignature);
router.post('/razorpay/webhook', paymentController.handleWebhook);
router.get('/razorpay/payment/:paymentId', authMiddleware, paymentController.getPaymentDetails);

module.exports = router;
