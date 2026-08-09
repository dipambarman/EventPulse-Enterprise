const mysql = require('mysql2/promise');

const mockStore = {
  users: [
    { id: 'usr-1', username: 'admin', email: 'admin@eventpulse.io', password_hash: '$2a$10$X8T7.b8M8uQ5rT...', role: 'admin' }
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

    // SELECT from users
    if (lower.includes('select') && lower.includes('from users')) {
      const user = mockStore.users.find(u => u.email === params[0] || u.username === params[0] || u.id === params[0]);
      return [user ? [user] : []];
    }

    // INSERT into users
    if (lower.includes('insert into users')) {
      const newUser = { id: params[0], username: params[1], email: params[2], password_hash: params[3], role: 'client' };
      mockStore.users.push(newUser);
      return [{ affectedRows: 1 }];
    }

    // UPDATE users SET password_hash
    if (lower.includes('update users') && lower.includes('password_hash')) {
      const user = mockStore.users.find(u => u.id === params[1]);
      if (user) {
        user.password_hash = params[0];
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    // INSERT into password_resets
    if (lower.includes('insert into password_resets')) {
      const reset = {
        id: params[0],
        user_id: params[1],
        token_hash: params[2],
        expires_at: params[3],
        used: false,
        created_at: new Date().toISOString()
      };
      mockStore.password_resets.push(reset);
      return [{ affectedRows: 1 }];
    }

    // SELECT from password_resets (by token_hash)
    if (lower.includes('select') && lower.includes('from password_resets')) {
      const tokenHash = params[0];
      const now = new Date();
      const reset = mockStore.password_resets.find(
        r => r.token_hash === tokenHash && new Date(r.expires_at) > now && !r.used
      );
      return [reset ? [reset] : []];
    }

    // UPDATE password_resets SET used = TRUE
    if (lower.includes('update password_resets')) {
      const resetId = params[0];
      const reset = mockStore.password_resets.find(r => r.id === resetId);
      if (reset) {
        reset.used = true;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }

    return [[]];
  }
};

module.exports = db;
