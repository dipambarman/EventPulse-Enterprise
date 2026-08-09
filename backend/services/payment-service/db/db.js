const mysql = require('mysql2/promise');

const mockStore = {
  payments: [
    { id: 'pay-1', booking_id: 'EVT-101', amount: 200000, status: 'completed', payment_method: 'razorpay', gateway_order_id: 'order_mock123', gateway_payment_id: 'pay_mock123', gateway_signature: '' }
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

    // SELECT from payments
    if (lower.includes('select') && lower.includes('from payments')) {
      if (params.length > 0) {
        const found = mockStore.payments.find(p => p.gateway_order_id === params[0] || p.booking_id === params[0] || p.id === params[0]);
        return [found ? [found] : []];
      }
      return [mockStore.payments];
    }

    // INSERT into payments
    if (lower.includes('insert into payments')) {
      const newPay = {
        id: params[0],
        booking_id: params[1],
        amount: params[2],
        status: params[3] || 'pending',
        gateway_order_id: params[4] || '',
        payment_method: params[5] || 'razorpay',
        gateway_payment_id: '',
        gateway_signature: ''
      };
      mockStore.payments.push(newPay);
      return [{ affectedRows: 1 }];
    }

    // UPDATE payments (status, gateway_payment_id, gateway_signature)
    if (lower.includes('update payments')) {
      // Expect: UPDATE payments SET status = ?, gateway_payment_id = ?, gateway_signature = ? WHERE gateway_order_id = ?
      const payment = mockStore.payments.find(p => p.gateway_order_id === params[3] || p.id === params[3]);
      if (payment) {
        payment.status = params[0] || payment.status;
        payment.gateway_payment_id = params[1] || payment.gateway_payment_id;
        payment.gateway_signature = params[2] || payment.gateway_signature;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    return [[]];
  }
};

module.exports = db;

