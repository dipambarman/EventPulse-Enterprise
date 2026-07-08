const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

// GET /api/themes - get all themes with optional filters
router.get('/', themeController.getAllThemes);

// GET /api/themes/categories - get theme categories
router.get('/categories', themeController.getThemeCategories);

// GET /api/themes/:id - get theme by id
router.get('/:id', themeController.getThemeById);

// GET /api/themes/:id/addons - get add-ons for a theme
router.get('/:id/addons', themeController.getThemeAddOns);

module.exports = router;
