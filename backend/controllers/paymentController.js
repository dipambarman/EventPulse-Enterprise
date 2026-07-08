const Razorpay = require('razorpay');
const paymentMethods = [];
const payments = [];
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: 'rzp_test_ORMoqQwaGSJZXh',
  key_secret: 'ALzeODVLFDgLuJ3jdrVmkX0p',
});

exports.createPaymentIntent = (req, res) => {
  const bookingDetails = req.body;
  // Mock payment intent creation
  const paymentIntent = {
    id: uuidv4(),
    clientSecret: 'mock_client_secret_' + uuidv4(),
    amount: bookingDetails.amount || 0,
    currency: bookingDetails.currency || 'usd',
    status: 'requires_payment_method'
  };
  payments.push(paymentIntent);
  res.status(201).json(paymentIntent);
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    if (!amount || amount <= 0) {
      console.error('Invalid amount for Razorpay order:', amount);
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: currency || 'INR',
      receipt: receipt || `receipt_${uuidv4()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
};

exports.verifyPaymentSignature = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto.createHmac('sha256', razorpay.key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Update payment status in your database here
    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
};

exports.handleWebhook = (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      // Update payment status in your database here
      console.log('Payment captured:', paymentEntity);
    }
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
};

exports.confirmPayment = (req, res) => {
  const paymentIntentId = req.params.paymentIntentId;
  const paymentData = req.body;
  const payment = payments.find(p => p.id === paymentIntentId);
  if (!payment) {
    return res.status(404).json({ message: 'Payment intent not found' });
  }
  payment.status = 'succeeded';
  payment.details = paymentData;
  res.json({ message: 'Payment confirmed', payment });
};

exports.getPaymentMethods = (req, res) => {
  res.json(paymentMethods);
};

exports.addPaymentMethod = (req, res) => {
  const paymentMethodData = req.body;
  const newMethod = { id: uuidv4(), ...paymentMethodData };
  paymentMethods.push(newMethod);
  res.status(201).json(newMethod);
};

exports.removePaymentMethod = (req, res) => {
  const paymentMethodId = req.params.paymentMethodId;
  const index = paymentMethods.findIndex(m => m.id === paymentMethodId);
  if (index === -1) {
    return res.status(404).json({ message: 'Payment method not found' });
  }
  paymentMethods.splice(index, 1);
  res.json({ message: 'Payment method removed' });
};

exports.getPaymentHistory = (req, res) => {
  res.json(payments);
};

exports.requestRefund = (req, res) => {
  const paymentId = req.params.paymentId;
  const refundData = req.body;
  const payment = payments.find(p => p.id === paymentId);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  payment.refundRequested = true;
  payment.refundDetails = refundData;
  res.json({ message: 'Refund requested', payment });
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
