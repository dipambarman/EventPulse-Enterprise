const mysql = require('mysql2/promise');

const mockStore = {
  payments: [
    { id: 'pay-1', booking_id: 'EVT-101', amount: 200000, status: 'completed', payment_method: 'razorpay', gateway_order_id: 'order_mock123' }
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
    console.log('⚡ Payment Service connected to MySQL database.');
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
        console.warn('[Payment Service] DB Error, using mock:', err.message);
      }
    }
    const lower = sql.toLowerCase();
    if (lower.includes('select') && lower.includes('from payments')) {
      return [mockStore.payments];
    }
    if (lower.includes('insert into payments')) {
      const newPay = { id: params[0], booking_id: params[1], amount: params[2], status: 'completed', payment_method: 'razorpay' };
      mockStore.payments.push(newPay);
      return [{ affectedRows: 1 }];
    }
    return [[]];
  }
};

module.exports = db;
