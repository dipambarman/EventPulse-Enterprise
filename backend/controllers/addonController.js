// addonController.js - Handles custom event add-on services
const db = require('../db');

const addOnsData = [
  { id: 'addon-1', name: 'Gourmet Catering & Drinks', pricePerGuest: 650, icon: '🍷', category: 'Catering' },
  { id: 'addon-2', name: '4K Cinematic Video & Photo', priceFlat: 45000, icon: '📸', category: 'Media' },
  { id: 'addon-3', name: 'Intelligent Stage & Laser Lighting', priceFlat: 30000, icon: '💡', category: 'Production' },
  { id: 'addon-4', name: 'Live DJ & Sound System (10,000W)', priceFlat: 25000, icon: '🎧', category: 'Entertainment' },
  { id: 'addon-5', name: 'Exotic Floral Stage Entrance', priceFlat: 50000, icon: '🌸', category: 'Decor' },
  { id: 'addon-6', name: 'Professional Event Bouncers', priceFlat: 15000, icon: '🛡️', category: 'Security' }
];

exports.getAllAddOns = (req, res) => {
  res.json(addOnsData);
};

exports.getAddOnById = (req, res) => {
  const item = addOnsData.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Addon not found' });
  res.json(item);
};
