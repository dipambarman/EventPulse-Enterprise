const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', themeController.getAllThemes);
router.get('/categories', themeController.getThemeCategories);
router.get('/:id', themeController.getThemeById);
router.get('/:id/addons', themeController.getThemeAddOns);

// Admin routes
router.post('/', authMiddleware, adminOnly, themeController.createTheme);
router.put('/:id', authMiddleware, adminOnly, themeController.updateTheme);
router.delete('/:id', authMiddleware, adminOnly, themeController.deleteTheme);

module.exports = router;
