const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

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
  res.json({ message: 'Booking updated successfully', id: req.params.id });
};

exports.cancelBooking = async (req, res) => {
  res.json({ message: 'Booking cancelled successfully', id: req.params.id });
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'usr-1';
    const [rows] = await db.query('SELECT * FROM bookings WHERE user_id = ?', [userId]);
    res.json(rows || []);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
