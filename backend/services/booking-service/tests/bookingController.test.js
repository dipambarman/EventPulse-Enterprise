const request = require('supertest');
const express = require('express');
const bookingRoutes = require('../routes/bookingRoutes');
const db = require('../db/db');

// Mock the DB and middleware
jest.mock('../db/db', () => ({
  query: jest.fn()
}));
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.user = { id: 'test-user', role: 'client' };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

describe('Booking API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/bookings/availability should return available true', async () => {
    db.query.mockResolvedValue([[{ count: 0 }]]);

    const res = await request(app).get('/api/bookings/availability?themeId=b1&startDate=2026-10-10&endDate=2026-10-10');
    expect(res.status).toBe(200);
    expect(res.body.available).toBe(true);
  });

  test('GET /api/bookings/user should return user bookings', async () => {
    const mockBookings = [{ id: 'EVT-101', status: 'confirmed' }];
    db.query.mockResolvedValue([mockBookings]);
    // The second query is for pagination count
    db.query.mockResolvedValueOnce([mockBookings]).mockResolvedValueOnce([[{ total: 1 }]]);

    const res = await request(app).get('/api/bookings/user');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe('EVT-101');
    expect(res.body.pagination.total).toBe(1);
  });
});
