const mysql = require('mysql2/promise');
require('dotenv').config();

// In-memory mock database store for seamless demo execution when MySQL is unavailable
const mockStore = {
  themes: [
    { id: 'b1', name: 'Birthday Standard', category: 'Birthday', price: 15000, description: 'Complete balloon arch, cake table backdrop, and sound setup.' },
    { id: 'b2', name: 'Birthday Premium', category: 'Birthday', price: 45000, description: 'Custom LED backdrop, photographer, 3D theme stage, and party host.' },
    { id: 'b3', name: 'Birthday Exclusive', category: 'Birthday', price: 100000, description: 'VIP lounge, celebrity entertainer, live food stations, and fireworks.' },
    { id: 'c1', name: 'Corporate Summit Standard', category: 'Corporate', price: 50000, description: 'AV projector system, podium, registration counter, and catering.' },
    { id: 'c2', name: 'Corporate Premium', category: 'Corporate', price: 120000, description: 'Intelligent stage lighting, 4K LED screen, and executive gala dinner.' },
    { id: 'c3', name: 'Corporate Exclusive', category: 'Corporate', price: 300000, description: 'Concert sound rig, live streaming, VIP lounge, and multi-day passes.' },
    { id: 'w1', name: 'Royal Heritage Wedding', category: 'Wedding', price: 750000, description: 'Grand floral mandap, royal entry stage, luxury seating for 500 guests.' },
    { id: 'w2', name: 'Destination Beach Wedding', category: 'Wedding', price: 550000, description: 'Sunset oceanfront canopy, tropical floral arrangements, and live acoustic band.' },
    { id: 'w3', name: 'Luxe Emerald Gala Wedding', category: 'Wedding', price: 1200000, description: '5-star ballroom transformation, 100-person service crew, 4K cinematic crew.' },
    { id: 't1', name: 'Meghalaya Nature Retreat', category: 'Travel', price: 20000, description: 'Cherrapunji waterfall trek, luxury resort stay, and campfire dinner.' },
    { id: 't2', name: 'Arunachal Mountain Expedition', category: 'Travel', price: 35000, description: 'Tawang Monastery tour, high-altitude pass permits, and private SUV guide.' }
  ],
  bookings: [
    { id: 'EVT-101', theme_id: 'w1', user_id: 'usr-1', start_date: '2026-11-15', end_date: '2026-11-16', status: 'confirmed' },
    { id: 'EVT-102', theme_id: 'c2', user_id: 'usr-2', start_date: '2026-08-28', end_date: '2026-08-28', status: 'confirmed' }
  ],
  users: [
    { id: 'usr-1', username: 'admin', email: 'admin@eventpulse.io', password_hash: '$2a$10$X8T7...' }
  ],
  payments: [
    { id: 'pay-1', booking_id: 'EVT-101', amount: 200000, status: 'completed', payment_method: 'Razorpay' }
  ]
};

let pool = null;
let isMock = false;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'event_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 2000
  });

  pool.getConnection()
    .then(conn => {
      console.log('⚡ Connected to MySQL database successfully.');
      conn.release();
    })
    .catch(err => {
      console.warn('⚠️  MySQL Connection Failed. Initializing In-Memory DB Fallback Engine for zero-downtime execution.');
      isMock = true;
    });
} catch (e) {
  console.warn('⚠️  MySQL initialization exception. Using In-Memory DB Engine.');
  isMock = true;
}

// Wrapper interface allowing seamless execution regardless of MySQL availability
const dbInterface = {
  query: async (sql, params) => {
    if (!isMock && pool) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.warn('MySQL Query Error, using mock fallback:', err.message);
      }
    }

    // Mock query responder for essential tables
    const lowerSql = sql.toLowerCase();
    if (lowerSql.includes('select * from themes') || lowerSql.includes('themes')) {
      return [mockStore.themes];
    }
    if (lowerSql.includes('select * from bookings') || lowerSql.includes('bookings')) {
      return [mockStore.bookings];
    }
    if (lowerSql.includes('select * from users') || lowerSql.includes('users')) {
      return [mockStore.users];
    }
    return [[]];
  },
  execute: async (sql, params) => {
    return dbInterface.query(sql, params);
  },
  mockStore,
  isMockMode: () => isMock
};

module.exports = dbInterface;
