const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const { themes } = require('./themeController');

exports.checkAvailability = async (req, res) => {
  const { themeId, startDate, endDate } = req.query;
  try {
    const query = 
      'SELECT COUNT(*) AS count FROM bookings ' +
      'WHERE theme_id = ? AND status = \'confirmed\' ' +
      'AND NOT (end_date < ? OR start_date > ?)';
    const [rows] = await pool.execute(query, [themeId, startDate, endDate]);
    const available = rows[0].count === 0;
    res.json({ available });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createBooking = async (req, res) => {
  const bookingData = req.body;
  const id = uuidv4();

  console.log('Booking data received:', bookingData);
  console.log('User ID:', req.user ? req.user.id : 'No user');
  console.log('Booking date:', bookingData.date);

  // Validate required fields
  if (!bookingData.themeId) {
    console.error('Validation error: themeId is required');
    return res.status(400).json({ error: 'themeId is required' });
  }
  if (!bookingData.date) {
    console.error('Validation error: date is required');
    return res.status(400).json({ error: 'date is required' });
  }
  if (!bookingData.totalPrice && bookingData.totalPrice !== 0) {
    console.error('Validation error: totalPrice is required');
    return res.status(400).json({ error: 'totalPrice is required' });
  }
  if (!bookingData.guestCount && bookingData.guestCount !== 0) {
    console.error('Validation error: guestCount is required');
    return res.status(400).json({ error: 'guestCount is required' });
  }

  try {
    // Check if theme exists in hardcoded themes array
    const themeExists = themes.some(theme => theme.id === bookingData.themeId);
    if (!themeExists) {
      return res.status(400).json({ error: 'Invalid themeId: theme does not exist' });
    }

    const query = 
      'INSERT INTO bookings (id, theme_id, user_id, start_date, end_date, total_price, guest_count, add_ons, customer_info, status) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, \'confirmed\')';

    let addOnsJson = '[]';
    let customerInfoJson = '{}';

    try {
      addOnsJson = JSON.stringify(bookingData.addOns || []);
    } catch (e) {
      console.error('Error stringifying addOns:', e);
    }

    try {
      customerInfoJson = JSON.stringify(bookingData.customerInfo || {});
    } catch (e) {
      console.error('Error stringifying customerInfo:', e);
    }

    const params = [
      id,
      bookingData.themeId,
      req.user ? req.user.id : null,
      bookingData.date,
      bookingData.date,
      bookingData.totalPrice,
      bookingData.guestCount,
      addOnsJson,
      customerInfoJson
    ];
    await pool.execute(query, params);
    const newBooking = { id, ...bookingData, status: 'confirmed' };

    // Store booking data in session
    if (req.session) {
      req.session.bookingData = newBooking;
    }
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    console.error(error.stack);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};


exports.getBookingById = async (req, res) => {
  const id = req.params.id;
  try {
    const query = 'SELECT * FROM bookings WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBooking = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  
  // Whitelist of allowed fields for update to prevent mass assignment
  const allowedFields = ['theme_id', 'start_date', 'end_date', 'total_price', 'guest_count', 'add_ons', 'customer_info', 'status'];
  
  const validUpdates = {};
  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      validUpdates[key] = updates[key];
    }
  });

  if (Object.keys(validUpdates).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  try {
    const fields = Object.keys(validUpdates).map(key => key + ' = ?').join(', ');
    const values = Object.values(validUpdates);
    const query = 'UPDATE bookings SET ' + fields + ' WHERE id = ?';
    await pool.execute(query, [...values, id]);
    const [rows] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  const id = req.params.id;
  const cancellationDetails = req.body;
  try {
    const query = 
      'UPDATE bookings SET status = \'cancelled\', cancellation_details = ? WHERE id = ?';
    await pool.execute(query, [JSON.stringify(cancellationDetails), id]);
    const [rows] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled', booking: rows[0] });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM bookings');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.getBookingFromSession = (req, res) => {
  console.log('getBookingFromSession called');
  if (req.session && req.session.bookingData) {
    console.log('Booking data found in session:', req.session.bookingData);
    res.json(req.session.bookingData);
  } else {
    console.log('No booking data found in session');
    res.status(404).json({ message: 'No booking data found in session' });
  }
};


