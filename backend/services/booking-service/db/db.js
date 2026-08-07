const mysql = require('mysql2/promise');

const mockStore = {
  bookings: [
    { id: 'EVT-101', theme_id: 'w1', user_id: 'usr-1', start_date: '2026-11-15', end_date: '2026-11-16', total_price: 750000, guest_count: 50, customer_name: 'John Doe', customer_email: 'john@example.com', customer_phone: '1234567890', status: 'confirmed' },
    { id: 'EVT-102', theme_id: 'c2', user_id: 'usr-2', start_date: '2026-08-28', end_date: '2026-08-28', total_price: 120000, guest_count: 100, customer_name: 'Jane Smith', customer_email: 'jane@example.com', customer_phone: '0987654321', status: 'confirmed' }
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

  pool.getConnection().then(conn => {
    console.log('⚡ Booking Service connected to MySQL database.');
    conn.release();
  }).catch(() => { isMock = true; });
} catch (e) {
  isMock = true;
}

const db = {
  query: async (sql, params = []) => {
    if (!isMock && pool) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.warn('[Booking Service] DB Error, using mock:', err.message);
      }
    }
    const lower = sql.toLowerCase();
    if (lower.includes('select') && lower.includes('from bookings')) {
      if (params && params.length > 0 && params[0]) {
        const found = mockStore.bookings.find(b => b.id === params[0] || b.user_id === params[0]);
        return [[found || mockStore.bookings[0]]];
      }
      return [mockStore.bookings];
    }
    if (lower.includes('insert into bookings')) {
      const newBooking = {
        id: params[0],
        theme_id: params[1],
        user_id: params[2],
        start_date: params[3],
        end_date: params[4],
        total_price: params[5],
        guest_count: params[6],
        customer_name: params[7],
        customer_email: params[8],
        customer_phone: params[9],
        status: 'pending'
      };
      mockStore.bookings.push(newBooking);
      return [{ affectedRows: 1 }];
    }
    return [[]];
  }
};

module.exports = db;
