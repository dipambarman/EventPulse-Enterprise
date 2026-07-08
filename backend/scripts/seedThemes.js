const pool = require('../db');
const { themes } = require('../controllers/themeController');

async function seedThemes() {
  try {
    for (const theme of themes) {
      const { id, name, category, price } = theme;
      // Insert theme into database, ignoring if already exists
      await pool.execute(
        `INSERT IGNORE INTO themes (id, name, description, price) VALUES (?, ?, ?, ?)`,
        [id, name, category, price]
      );
      console.log(`Inserted theme ${id} - ${name}`);
    }
    console.log('Theme seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding themes:', error);
    process.exit(1);
  }
}

seedThemes();
