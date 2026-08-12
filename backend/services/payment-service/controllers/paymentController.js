const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const prisma = require('../db/db');
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

// Helper: find or create a PaymentStatus by name
async function getOrCreateStatus(name) {
  let status = await prisma.paymentStatus.findUnique({ where: { name } });
  if (!status) {
    status = await prisma.paymentStatus.create({ data: { name } });
  }
  return status;
}

// Helper: find or create a PaymentMethod by name
async function getOrCreateMethod(name) {
  let method = await prisma.paymentMethod.findUnique({ where: { name } });
  if (!method) {
    method = await prisma.paymentMethod.create({ data: { name } });
  }
  return method;
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
    if (bookingId) {
      const pendingStatus = await getOrCreateStatus('pending');
      const razorpayMethod = await getOrCreateMethod('razorpay');

      await prisma.payment.create({
        data: {
          booking_id: bookingId,
          amount: Number(amount),
          status_id: pendingStatus.id,
          method_id: razorpayMethod.id,
          gateway_order_id: order.id
        }
      });
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
 * 4. On valid: update payment status to 'completed'
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

    const completedStatus = await getOrCreateStatus('completed');

    // Find the payment by gateway_order_id and update it
    const existingPayment = await prisma.payment.findFirst({
      where: { gateway_order_id: razorpay_order_id }
    });

    if (existingPayment) {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          status_id: completedStatus.id,
          gateway_payment_id: razorpay_payment_id,
          gateway_signature: razorpay_signature
        }
      });
    }

    // Notify about booking confirmation (cross-service, best-effort)
    // When RabbitMQ is added, this will be replaced with a message publish
    if (booking_id) {
      try {
        const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:5003';
        fetch(`${BOOKING_SERVICE_URL}/api/bookings/${booking_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'confirmed' })
        }).catch(e => console.warn('[Payment Service] Could not update booking status:', e.message));

        // Notify notification service
        const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';
        fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payment_receipt',
            recipientEmail: 'guest@example.com',
            customerName: 'Guest User',
            bookingId: booking_id,
            amount: existingPayment?.amount || 0,
            paymentMethod: 'Razorpay'
          })
        }).catch(e => console.warn('[Payment Service] Failed to notify notification-service:', e.message));
      } catch (bookingErr) {
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
  try {
    const methods = await prisma.paymentMethod.findMany();
    res.json(methods.length > 0 ? methods : [
      { id: 'pm_card_1', name: 'Visa' },
      { id: 'pm_upi_1', name: 'UPI' }
    ]);
  } catch (error) {
    res.json([
      { id: 'pm_card_1', name: 'Visa' },
      { id: 'pm_upi_1', name: 'UPI' }
    ]);
  }
};

exports.addPaymentMethod = async (req, res) => {
  res.status(201).json({ id: 'pm_card_new', brand: 'Mastercard', last4: '5555' });
};

exports.removePaymentMethod = async (req, res) => {
  res.json({ message: 'Payment method removed successfully' });
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const payments = await prisma.payment.findMany({
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
      include: { status: true, method: true }
    });

    const total = await prisma.payment.count();

    // Flatten for backward compat
    const mappedPayments = payments.map(p => ({
      ...p,
      status: p.status.name,
      payment_method: p.method.name
    }));

    res.json({
      data: mappedPayments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving payment history' });
  }
};

exports.requestRefund = async (req, res) => {
  res.json({ status: 'refund_initiated', paymentId: req.params.paymentId });
};

exports.handleWebhook = async (req, res) => {
  res.status(200).json({ status: 'webhook_received' });
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.paymentId },
      include: { status: true, method: true }
    });
    if (!payment) {
      return res.json({ id: req.params.paymentId, status: 'captured', amount: 15000 });
    }
    res.json({
      ...payment,
      status: payment.status.name,
      payment_method: payment.method.name
    });
  } catch (error) {
    res.json({ id: req.params.paymentId, status: 'captured', amount: 15000 });
  }
};
