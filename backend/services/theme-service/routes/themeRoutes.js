const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

router.get('/', themeController.getAllThemes);
router.get('/categories', themeController.getThemeCategories);
router.get('/:id', themeController.getThemeById);
router.get('/:id/addons', themeController.getThemeAddOns);

module.exports = router;
