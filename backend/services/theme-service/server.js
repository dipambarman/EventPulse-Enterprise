require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const themeRoutes = require('./routes/themeRoutes');
const addonController = require('./controllers/addonController');

const app = express();
const PORT = process.env.THEME_SERVICE_PORT || 5002;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Microservice Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Theme Catalog Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Theme Routes
app.use('/api/themes', themeRoutes);
app.get('/api/addons', addonController.getAllAddOns);
app.get('/api/addons/:id', addonController.getAddOnById);

// Error Handler
app.use((err, req, res, next) => {
  console.error('[Theme Service Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🎨 Theme & Catalog Microservice running on port ${PORT}`);
});
