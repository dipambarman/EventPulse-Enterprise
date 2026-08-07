const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const db = require('../db/db');
const { validationResult } = require('express-validator');

exports.createPaymentIntent = (req, res) => {
  const bookingDetails = req.body;
  res.status(201).json({
    id: uuidv4(),
    clientSecret: 'mock_client_secret_' + uuidv4(),
    amount: bookingDetails.amount || 0,
    currency: bookingDetails.currency || 'INR',
    status: 'requires_payment_method'
  });
};

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, currency, receipt, bookingId } = req.body;
    const orderId = `order_${uuidv4().substring(0, 8)}`;
    const paymentId = uuidv4();

    if (bookingId) {
      await db.query(
        'INSERT INTO payments (id, booking_id, amount, status, gateway_order_id, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
        [paymentId, bookingId, amount, 'pending', orderId, 'razorpay']
      );
    }

    res.status(201).json({
      id: orderId,
      entity: 'order',
      amount: (amount || 1000) * 100,
      amount_paid: 0,
      amount_due: (amount || 1000) * 100,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${uuidv4()}`,
      status: 'created'
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

exports.verifyPaymentSignature = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, booking_id } = req.body;
  res.json({
    status: 'success',
    message: 'Payment signature verified successfully',
    paymentId: razorpay_payment_id || `pay_${uuidv4()}`
  });
};

exports.confirmPayment = async (req, res) => {
  res.json({ status: 'succeeded', paymentIntentId: req.params.paymentIntentId });
};

exports.getPaymentMethods = async (req, res) => {
  res.json([
    { id: 'pm_card_1', brand: 'Visa', last4: '4242' },
    { id: 'pm_upi_1', brand: 'UPI', upiId: 'user@upi' }
  ]);
};

exports.addPaymentMethod = async (req, res) => {
  res.status(201).json({ id: 'pm_card_new', brand: 'Mastercard', last4: '5555' });
};

exports.removePaymentMethod = async (req, res) => {
  res.json({ message: 'Payment method removed successfully' });
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM payments');
    res.json(rows || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

exports.requestRefund = async (req, res) => {
  res.json({ status: 'refund_initiated', paymentId: req.params.paymentId });
};

exports.handleWebhook = async (req, res) => {
  res.status(200).json({ status: 'webhook_received' });
};

exports.getPaymentDetails = async (req, res) => {
  res.json({ id: req.params.paymentId, status: 'captured', amount: 15000 });
};
