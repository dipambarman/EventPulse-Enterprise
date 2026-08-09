const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const db = require('../db/db');
const { validationResult } = require('express-validator');

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;

// Initialize Razorpay SDK if credentials are available
let razorpayInstance = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
    console.log('[Payment Service] Razorpay SDK initialized with live credentials');
  } catch (err) {
    console.warn('[Payment Service] Razorpay SDK not available, using mock order generation');
  }
}

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
    let order;

    if (razorpayInstance) {
      // Use real Razorpay SDK to create order
      order = await razorpayInstance.orders.create({
        amount: Math.round((amount || 1000) * 100), // Razorpay expects paise
        currency: currency || 'INR',
        receipt: receipt || `receipt_${uuidv4().substring(0, 8)}`
      });
      console.log(`[Payment Service] Razorpay order created: ${order.id}`);
    } else {
      // Mock order for development without Razorpay credentials
      order = {
        id: `order_${uuidv4().substring(0, 8)}`,
        entity: 'order',
        amount: Math.round((amount || 1000) * 100),
        amount_paid: 0,
        amount_due: Math.round((amount || 1000) * 100),
        currency: currency || 'INR',
        receipt: receipt || `receipt_${uuidv4().substring(0, 8)}`,
        status: 'created'
      };
    }

    // Save pending payment record in DB
    const paymentId = uuidv4();
    if (bookingId) {
      await db.query(
        'INSERT INTO payments (id, booking_id, amount, status, gateway_order_id, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
        [paymentId, bookingId, amount, 'pending', order.id, 'razorpay']
      );
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

/**
 * Verify Razorpay Payment Signature — HMAC SHA-256
 *
 * Security measures:
 * 1. Construct expected signature body: razorpay_order_id + "|" + razorpay_payment_id
 * 2. Generate HMAC SHA-256 digest using RAZORPAY_KEY_SECRET
 * 3. Compare using crypto.timingSafeEqual to prevent timing attacks
 * 4. On valid: update payment status to 'completed', update booking to 'confirmed'
 * 5. On invalid: return 400 with clear error
 */
exports.verifyPaymentSignature = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      status: 'failure',
      error: 'Missing required payment verification fields: razorpay_order_id, razorpay_payment_id, razorpay_signature'
    });
  }

  try {
    // Step 1: Construct the signature body as per Razorpay docs
    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Step 2: Generate expected HMAC SHA-256 digest
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET || 'fallback_test_secret')
      .update(signatureBody)
      .digest('hex');

    // Step 3: Timing-safe comparison to prevent timing attacks
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    );

    if (!isSignatureValid) {
      console.warn(`[Payment Service] Invalid signature for order ${razorpay_order_id}`);
      return res.status(400).json({
        status: 'failure',
        error: 'Payment signature verification failed. This payment cannot be trusted.'
      });
    }

    // Step 4: Signature is valid — update payment record
    console.log(`[Payment Service] ✅ Signature verified for order ${razorpay_order_id}`);

    await db.query(
      'UPDATE payments SET status = ?, gateway_payment_id = ?, gateway_signature = ? WHERE gateway_order_id = ?',
      ['completed', razorpay_payment_id, razorpay_signature, razorpay_order_id]
    );

    // Update booking status to confirmed if booking_id provided
    if (booking_id) {
      try {
        await db.query(
          'UPDATE bookings SET status = ? WHERE id = ?',
          ['confirmed', booking_id]
        );
        console.log(`[Payment Service] Booking ${booking_id} confirmed after payment verification`);
        
        // Fetch booking details to send receipt
        const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [booking_id]);
        if (bookings && bookings.length > 0) {
          const booking = bookings[0];
          const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';
          fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment_receipt',
              recipientEmail: booking.customer_email || 'guest@example.com',
              customerName: booking.customer_name || 'Guest User',
              bookingId: booking_id,
              amount: booking.total_price || 0,
              paymentMethod: 'Razorpay'
            })
          }).catch(e => console.warn('[Payment Service] Failed to notify notification-service:', e.message));
        }
      } catch (bookingErr) {
        // Booking update is best-effort (booking may be in a different service/DB)
        console.warn('[Payment Service] Could not update booking status:', bookingErr.message);
      }
    }

    res.json({
      status: 'success',
      message: 'Payment signature verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (error) {
    console.error('[Payment Service] Signature verification error:', error);

    // Handle hex decoding errors (malformed signature)
    if (error.code === 'ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH') {
      return res.status(400).json({
        status: 'failure',
        error: 'Malformed payment signature'
      });
    }

    res.status(500).json({ error: 'Payment verification failed due to server error' });
  }
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

