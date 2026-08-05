const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const pool = require('../db');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_ORMoqQwaGSJZXh',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'ALzeODVLFDgLuJ3jdrVmkX0p',
});

exports.createPaymentIntent = (req, res) => {
  // Legacy / unused in Razorpay flow, kept for backward compatibility
  const bookingDetails = req.body;
  const paymentIntent = {
    id: uuidv4(),
    clientSecret: 'mock_client_secret_' + uuidv4(),
    amount: bookingDetails.amount || 0,
    currency: bookingDetails.currency || 'usd',
    status: 'requires_payment_method'
  };
  res.status(201).json(paymentIntent);
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, bookingId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: currency || 'INR',
      receipt: receipt || `receipt_${uuidv4()}`,
      payment_capture: 1,
    };
    
    const order = await razorpay.orders.create(options);
    
    // Save pending payment record in database
    const paymentId = uuidv4();
    if (bookingId) {
       await pool.execute(
         'INSERT INTO payments (id, booking_id, amount, status, gateway_order_id, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
         [paymentId, bookingId, amount, 'pending', order.id, 'razorpay']
       );
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
};

exports.verifyPaymentSignature = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto.createHmac('sha256', razorpay.key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
      // Update payment status in database
      await pool.execute(
        'UPDATE payments SET status = ?, gateway_payment_id = ?, gateway_signature = ? WHERE gateway_order_id = ?',
        ['completed', razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (dbError) {
      console.error('Database error verifying payment:', dbError);
      res.status(500).json({ success: false, message: 'Database error updating payment' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
};

exports.handleWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      try {
        await pool.execute(
          'UPDATE payments SET status = ? WHERE gateway_order_id = ? OR gateway_payment_id = ?',
          ['completed', paymentEntity.order_id, paymentEntity.id]
        );
        console.log('Payment captured:', paymentEntity.id);
      } catch (e) {
        console.error('Webhook DB Error:', e);
      }
    }
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
};

exports.confirmPayment = (req, res) => {
  res.status(200).json({ message: 'Legacy endpoint. Use verifyPaymentSignature.' });
};

exports.getPaymentMethods = (req, res) => {
  res.json([{ id: 'rzp', name: 'Razorpay' }]);
};

exports.addPaymentMethod = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

exports.removePaymentMethod = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

exports.getPaymentHistory = async (req, res) => {
  try {
     const [rows] = await pool.execute('SELECT * FROM payments');
     res.json(rows);
  } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
  }
};

exports.requestRefund = async (req, res) => {
  // Mock refund implementation
  res.json({ message: 'Refund requested successfully' });
};

exports.getPaymentDetails = async (req, res) => {
  const paymentId = req.params.paymentId;
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
};
