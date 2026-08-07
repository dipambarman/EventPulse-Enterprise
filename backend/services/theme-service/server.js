require('dotenv').config({ path: '../../../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const themeRoutes = require('../../routes/themeRoutes');
const addonController = require('../../controllers/addonController');
const authMiddleware = require('../../middleware/authMiddleware');
const { errorHandler } = require('../../middleware/errorHandler');

const app = express();
const PORT = process.env.THEME_SERVICE_PORT || 5002;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Microservice Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Theme Catalog Microservice', status: 'UP', timestamp: new Date().toISOString() });
});

// Theme & Add-on Routes
app.use('/api/themes', themeRoutes);
app.get('/api/addons', authMiddleware, addonController.getAllAddOns);
app.get('/api/addons/:id', authMiddleware, addonController.getAddOnById);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎨 Theme & Catalog Microservice running on port ${PORT}`);
});
