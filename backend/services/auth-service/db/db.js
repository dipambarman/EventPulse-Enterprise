const mysql = require('mysql2/promise');

const mockStore = {
  users: [
    { id: 'usr-1', username: 'admin', email: 'admin@eventpulse.io', password_hash: '$2a$10$X8T7.b8M8uQ5rT...' }
  ],
  password_resets: []
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
      console.log('⚡ Auth Service connected to MySQL database.');
      conn.release();
    })
    .catch(() => {
      isMock = true;
    });
} catch (e) {
  isMock = true;
}

const db = {
  query: async (sql, params = []) => {
    if (!isMock && pool) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.warn('[Auth Service] DB Error, falling back to mock:', err.message);
      }
    }
    const lower = sql.toLowerCase();
    if (lower.includes('select') && lower.includes('from users')) {
      const user = mockStore.users.find(u => u.email === params[0] || u.username === params[0] || u.id === params[0]);
      return [user ? [user] : []];
    }
    if (lower.includes('insert into users')) {
      const newUser = { id: params[0], username: params[1], email: params[2], password_hash: params[3] };
      mockStore.users.push(newUser);
      return [{ affectedRows: 1 }];
    }
    return [[]];
  }
};

module.exports = db;
