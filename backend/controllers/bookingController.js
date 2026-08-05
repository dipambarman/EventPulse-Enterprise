const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const { themes } = require('./themeController');

const { validationResult } = require('express-validator');

exports.checkAvailability = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { themeId, startDate, endDate } = req.query;
  try {
    const query = 
      'SELECT COUNT(*) AS count FROM bookings ' +
      'WHERE theme_id = ? AND status = \'confirmed\' ' +
      'AND NOT (end_date < ? OR start_date > ?) AND deleted_at IS NULL';
    const [rows] = await pool.execute(query, [themeId, startDate, endDate]);
    const available = rows[0].count === 0;
    res.json({ available });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const bookingData = req.body;
  const id = uuidv4();

  // Extract customer info
  const customerInfo = bookingData.customerInfo || {};
  const customerName = customerInfo.name || null;
  const customerEmail = customerInfo.email || null;
  const customerPhone = customerInfo.phone || null;

  // C4: Server-side price calculation
  const theme = themes.find(t => t.id === bookingData.themeId);
  if (!theme) {
    return res.status(400).json({ error: 'Invalid themeId' });
  }
  
  let calculatedTotalPrice = theme.basePrice || theme.price;
  const guestCount = bookingData.guestCount || 0;
  if (guestCount > (theme.baseGuestCount || 0)) {
    calculatedTotalPrice += (guestCount - theme.baseGuestCount) * (theme.pricePerExtraGuest || 0);
  }
  
  if (bookingData.addOns && Array.isArray(bookingData.addOns)) {
    for (const addon of bookingData.addOns) {
      const addonPrice = Number(addon.price) || 0;
      if (addonPrice > 0) {
        calculatedTotalPrice += addonPrice;
      }
    }
  }
  
  bookingData.totalPrice = calculatedTotalPrice;

  try {
    // Note: In real MySQL, we'd use connection.beginTransaction()
    // Since we're using a fallback engine that might be mock, we'll try to get a real connection
    let conn;
    let isMock = pool.isMockMode && pool.isMockMode();
    
    if (!isMock && pool.getConnection) {
      try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
      } catch (err) {
        console.warn("Could not start transaction, proceeding without it.");
        conn = pool;
      }
    } else {
      conn = pool;
    }

    const query = 
      'INSERT INTO bookings (id, theme_id, user_id, start_date, end_date, total_price, guest_count, customer_name, customer_email, customer_phone, status) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'confirmed\')';

    const params = [
      id,
      bookingData.themeId,
      req.user ? req.user.id : 'guest',
      bookingData.date,
      bookingData.date, // Assuming 1-day events for now
      bookingData.totalPrice,
      bookingData.guestCount || 0,
      customerName,
      customerEmail,
      customerPhone
    ];
    
    await conn.execute(query, params);

    // Insert add-ons if any exist
    if (bookingData.addOns && Array.isArray(bookingData.addOns) && bookingData.addOns.length > 0) {
      for (const addon of bookingData.addOns) {
        // Ensure addon exists in add_ons table (or dynamically insert it if it's a mock setup)
        const addonId = addon.id || uuidv4();
        
        // In a strictly normalized setup, we'd only insert into booking_add_ons.
        // For backwards compatibility with the frontend which sends arbitrary addons, we insert into add_ons first if it doesn't exist.
        if (!isMock) {
           await conn.execute('INSERT IGNORE INTO add_ons (id, name, price) VALUES (?, ?, ?)', [addonId, addon.name, addon.price || 0]);
        }
        
        await conn.execute(
          'INSERT INTO booking_add_ons (booking_id, add_on_id, quantity, price_at_booking) VALUES (?, ?, ?, ?)',
          [id, addonId, addon.quantity || 1, addon.price || 0]
        );
      }
    }

    if (conn.commit && !isMock && conn !== pool) {
      await conn.commit();
      conn.release();
    }

    const newBooking = { id, ...bookingData, status: 'confirmed' };

    // Store booking data in session for payment flow
    if (req.session) {
      req.session.bookingData = newBooking;
    }
    res.status(201).json(newBooking);
  } catch (error) {
    if (conn && conn.rollback && conn !== pool) {
      try { await conn.rollback(); } catch(e) {}
      conn.release();
    }
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBookingById = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM bookings WHERE id = ? AND user_id = ? AND deleted_at IS NULL', [id, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const booking = rows[0];
    
    // Fetch add-ons
    let isMock = pool.isMockMode && pool.isMockMode();
    if (!isMock) {
       const [addonRows] = await pool.execute(
         'SELECT a.id, a.name, ba.quantity, ba.price_at_booking as price FROM booking_add_ons ba JOIN add_ons a ON ba.add_on_id = a.id WHERE ba.booking_id = ?',
         [id]
       );
       booking.addOns = addonRows;
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const id = req.params.id;
  const updates = req.body;
  
  // Whitelist of allowed fields for update based on new schema
  const allowedFields = ['theme_id', 'start_date', 'end_date', 'total_price', 'guest_count', 'customer_name', 'customer_email', 'customer_phone', 'status', 'cancellation_details'];
  
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
    const query = 'UPDATE bookings SET ' + fields + ' WHERE id = ? AND user_id = ?';
    const [result] = await pool.execute(query, [...values, id, req.user.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }
    
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const id = req.params.id;
  const cancellationDetails = req.body;
  const userId = req.user.id;
  try {
    const query = 
      'UPDATE bookings SET status = \'cancelled\', cancellation_details = ? WHERE id = ? AND user_id = ?';
    const [result] = await pool.execute(query, [JSON.stringify(cancellationDetails), id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }
    
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
    const userId = req.user ? req.user.id : 'guest';
    const [rows] = await pool.execute('SELECT * FROM bookings WHERE user_id = ? AND deleted_at IS NULL', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBookingFromSession = (req, res) => {
  if (req.session && req.session.bookingData) {
    res.json(req.session.bookingData);
  } else {
    res.status(404).json({ message: 'No booking data found in session' });
  }
};
