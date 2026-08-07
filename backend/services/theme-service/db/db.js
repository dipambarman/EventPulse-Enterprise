const mysql = require('mysql2/promise');

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
  add_ons: [
    { id: 'a1', name: 'Extra Photographer', price: 10000 }
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
    console.log('⚡ Theme Service connected to MySQL database.');
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
        console.warn('[Theme Service] DB Error, using mock:', err.message);
      }
    }
    const lower = sql.toLowerCase();
    if (lower.includes('select') && lower.includes('from themes')) {
      if (params && params.length > 0 && params[0]) {
        const item = mockStore.themes.find(t => t.id === params[0] || t.category === params[0]);
        return [[item || mockStore.themes[0]]];
      }
      return [mockStore.themes];
    }
    if (lower.includes('select') && lower.includes('from add_ons')) {
      return [mockStore.add_ons];
    }
    return [[]];
  }
};

module.exports = db;
