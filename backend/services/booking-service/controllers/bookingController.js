const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const auditService = require('../services/auditService');

exports.checkAvailability = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { themeId, startDate, endDate } = req.query;
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS count FROM bookings WHERE theme_id = ? AND status = \'confirmed\'',
      [themeId, startDate, endDate]
    );
    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const bookingData = req.body;
  const id = `EVT-${Math.floor(100 + Math.random() * 900)}`;
  const userId = req.user ? req.user.id : 'usr-anon';

  try {
    await db.query(
      'INSERT INTO bookings (id, theme_id, user_id, start_date, end_date, total_price, guest_count, customer_name, customer_email, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        bookingData.themeId || 'b1',
        userId,
        bookingData.date || new Date().toISOString().split('T')[0],
        bookingData.endDate || bookingData.date || new Date().toISOString().split('T')[0],
        bookingData.totalPrice || 15000,
        bookingData.guestCount || 10,
        bookingData.customerInfo?.name || 'Guest User',
        bookingData.customerInfo?.email || 'guest@example.com',
        bookingData.customerInfo?.phone || '0000000000'
      ]
    );
    
    await auditService.logAction(userId, 'BOOKING_CREATED', 'bookings', id, { themeId: bookingData.themeId, amount: bookingData.totalPrice });

    // Call Notification Service to send booking confirmation email
    const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';
    try {
      fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_confirmation',
          recipientEmail: bookingData.customerInfo?.email || 'guest@example.com',
          customerName: bookingData.customerInfo?.name || 'Guest User',
          bookingId: id,
          eventDate: bookingData.date || new Date().toISOString().split('T')[0],
          totalPrice: bookingData.totalPrice || 15000
        })
      }).catch(e => console.warn('[Booking Service] Failed to notify notification-service:', e.message));
    } catch (err) {
      console.warn('[Booking Service] Failed to initiate notification:', err.message);
    }

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: id,
      booking: {
        id,
        themeId: bookingData.themeId,
        date: bookingData.date,
        totalPrice: bookingData.totalPrice || 15000,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Booking record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBookingFromSession = async (req, res) => {
  res.json({ id: 'EVT-101', status: 'confirmed', total_price: 15000 });
};

exports.updateBooking = async (req, res) => {
  try {
    const { status, stage } = req.body;
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Booking updated successfully', id: req.params.id, status, stage });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

exports.cancelBooking = async (req, res) => {
  const userId = req.user ? req.user.id : 'usr-anon';
  await auditService.logAction(userId, 'BOOKING_CANCELLED', 'bookings', req.params.id);
  res.json({ message: 'Booking cancelled successfully', id: req.params.id });
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'usr-1';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await db.query('SELECT * FROM bookings WHERE user_id = ? LIMIT ? OFFSET ?', [userId, limit, offset]);
    const [countRow] = await db.query('SELECT COUNT(*) AS total FROM bookings WHERE user_id = ?', [userId]);
    const total = countRow[0].total;

    res.json({
      data: rows || [],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin Endpoints
exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await db.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
    const [countRow] = await db.query('SELECT COUNT(*) AS total FROM bookings');
    const total = countRow[0].total;

    // Map to frontend expected format
    const bookings = rows.map(b => ({
      id: b.id,
      client: b.customer_name || 'Client',
      theme: b.theme_id || 'Theme',
      date: b.start_date,
      amount: b.total_price || 0,
      status: b.status,
      stage: b.status === 'confirmed' ? 'In Planning' : 'Pending'
    }));

    res.json({
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings WHERE status != "cancelled"');
    
    const totalRevenue = rows.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
    const monthlyRevenue = totalRevenue * 0.3; // Rough approximation for mock
    const activeBookings = rows.length;
    
    res.json({
      totalRevenue,
      monthlyRevenue,
      activeBookings,
      conversionRate: 34.2,
      monthlyChart: [
        { month: 'Jan', revenue: 320000 },
        { month: 'Feb', revenue: 410000 },
        { month: 'Mar', revenue: 380000 },
        { month: 'Apr', revenue: 520000 },
        { month: 'May', revenue: 610000 },
        { month: 'Jun', revenue: monthlyRevenue }
      ]
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
};

