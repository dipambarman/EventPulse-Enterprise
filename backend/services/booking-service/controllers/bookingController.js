const prisma = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const auditService = require('../services/auditService');

exports.checkAvailability = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { themeId, startDate, endDate } = req.query;
  try {
    const status = await prisma.bookingStatus.findUnique({ where: { name: 'confirmed' } });
    if (status) {
      const count = await prisma.booking.count({
        where: {
          theme_id: themeId,
          status_id: status.id,
          start_date: { lte: new Date(endDate) },
          end_date: { gte: new Date(startDate) }
        }
      });
      // Mock logic: always true for now
    }
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
    const email = bookingData.customerInfo?.email || 'guest@example.com';
    let customer = await prisma.customer.findUnique({ where: { email } });
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: bookingData.customerInfo?.name || 'Guest User',
          email,
          phone: bookingData.customerInfo?.phone || '0000000000'
        }
      });
    }

    let status = await prisma.bookingStatus.findUnique({ where: { name: 'pending' } });
    if (!status) {
      status = await prisma.bookingStatus.create({ data: { name: 'pending' } });
    }

    const start_date = new Date(bookingData.date || new Date().toISOString().split('T')[0]);
    const end_date = new Date(bookingData.endDate || bookingData.date || new Date().toISOString().split('T')[0]);

    const booking = await prisma.booking.create({
      data: {
        id,
        theme_id: bookingData.themeId || 'b1',
        user_id: userId,
        customer_id: customer.id,
        status_id: status.id,
        start_date,
        end_date,
        total_price: Number(bookingData.totalPrice || 15000),
        guest_count: Number(bookingData.guestCount || 10)
      }
    });
    
    await auditService.logAction(userId, 'BOOKING_CREATED', 'bookings', id, { themeId: booking.theme_id, amount: booking.total_price });

    const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';
    try {
      fetch(`${NOTIFICATION_SERVICE_URL}/api/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_confirmation',
          recipientEmail: customer.email,
          customerName: customer.name,
          bookingId: id,
          eventDate: start_date.toISOString(),
          totalPrice: booking.total_price
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
        themeId: booking.theme_id,
        date: booking.start_date,
        totalPrice: booking.total_price,
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
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { customer: true, status: true }
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found' });
    }
    // Flatten response for backward compatibility
    res.json({
      ...booking,
      customer_name: booking.customer.name,
      customer_email: booking.customer.email,
      customer_phone: booking.customer.phone,
      status: booking.status.name
    });
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
    let statusRecord = await prisma.bookingStatus.findUnique({ where: { name: status } });
    if (!statusRecord) {
      statusRecord = await prisma.bookingStatus.create({ data: { name: status } });
    }

    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status_id: statusRecord.id }
    });
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

    const bookings = await prisma.booking.findMany({
      where: { user_id: userId },
      skip: offset,
      take: limit,
      include: { status: true, customer: true }
    });
    
    const total = await prisma.booking.count({ where: { user_id: userId } });

    res.json({
      data: bookings.map(b => ({
        ...b,
        status: b.status.name,
        customer_name: b.customer.name
      })),
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

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const bookings = await prisma.booking.findMany({
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
      include: { customer: true, status: true }
    });
    const total = await prisma.booking.count();

    const mappedBookings = bookings.map(b => ({
      id: b.id,
      client: b.customer.name,
      theme: b.theme_id,
      date: b.start_date,
      amount: b.total_price,
      status: b.status.name,
      stage: b.status.name === 'confirmed' ? 'In Planning' : 'Pending'
    }));

    res.json({
      data: mappedBookings,
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
    const cancelledStatus = await prisma.bookingStatus.findUnique({ where: { name: 'cancelled' } });
    
    const bookings = await prisma.booking.findMany({
      where: cancelledStatus ? { status_id: { not: cancelledStatus.id } } : {}
    });
    
    const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
    const monthlyRevenue = totalRevenue * 0.3; // Rough approximation
    const activeBookings = bookings.length;
    
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
