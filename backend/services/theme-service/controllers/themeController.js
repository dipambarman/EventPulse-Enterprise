const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');

let themesCatalog = [
  { id: 'b1', name: 'Birthday Standard', category: 'Birthday', price: 3000, basePrice: 3000, baseGuestCount: 10, pricePerExtraGuest: 100, venueDiscountAmount: 200 },
  { id: 'b2', name: 'Birthday Premium', category: 'Birthday', price: 8099, basePrice: 8099, baseGuestCount: 15, pricePerExtraGuest: 150, venueDiscountAmount: 300 },
  { id: 'b3', name: 'Birthday Exclusive', category: 'Birthday', price: 15000, basePrice: 15000, baseGuestCount: 20, pricePerExtraGuest: 200, venueDiscountAmount: 400 },
  { id: 'c1', name: 'Corporate Standard', category: 'Corporate', price: 10999, basePrice: 10999, baseGuestCount: 20, pricePerExtraGuest: 250, venueDiscountAmount: 500 },
  { id: 'c2', name: 'Corporate Premium', category: 'Corporate', price: 25009, basePrice: 25009, baseGuestCount: 30, pricePerExtraGuest: 300, venueDiscountAmount: 600 },
  { id: 'c3', name: 'Corporate Exclusive', category: 'Corporate', price: 50099, basePrice: 50099, baseGuestCount: 40, pricePerExtraGuest: 350, venueDiscountAmount: 700 },
  { id: 'w1', name: 'Wedding Standard', category: 'Wedding', price: 3000000, basePrice: 3000000, baseGuestCount: 50, pricePerExtraGuest: 500, venueDiscountAmount: 1000 },
  { id: 'w2', name: 'Wedding Premium', category: 'Wedding', price: 5500000, basePrice: 5500000, baseGuestCount: 60, pricePerExtraGuest: 600, venueDiscountAmount: 1200 },
  { id: 'w3', name: 'Wedding Exclusive', category: 'Wedding', price: 10000000, basePrice: 10000000, baseGuestCount: 70, pricePerExtraGuest: 700, venueDiscountAmount: 1500 },
  { id: 't1', name: 'Meghalaya Nature Retreat', category: 'Travel', price: 20000, basePrice: 20000, baseGuestCount: 1, pricePerExtraGuest: 0, venueDiscountAmount: 0 },
  { id: 't2', name: 'Arunachal Mountain Expedition', category: 'Travel', price: 35000, basePrice: 35000, baseGuestCount: 1, pricePerExtraGuest: 0, venueDiscountAmount: 0 }
];

exports.getAllThemes = async (req, res) => {
  try {
    const { category } = req.query;
    let filtered = themesCatalog;
    if (category) {
      filtered = themesCatalog.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    // Convert price to number just in case and map status for admin
    res.json(filtered.map(t => ({ ...t, price: Number(t.price) || 0, status: 'Active' })));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving experience themes' });
  }
};

exports.getThemeCategories = async (req, res) => {
  try {
    const categories = Array.from(new Set(themesCatalog.map(t => t.category)));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

exports.getThemeById = async (req, res) => {
  try {
    const theme = themesCatalog.find(t => t.id === req.params.id);
    if (!theme) return res.status(404).json({ message: 'Theme package not found' });
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving theme' });
  }
};

exports.getThemeAddOns = async (req, res) => {
  try {
    res.json([
      { id: 'a1', name: 'Extra 4K Drone Videographer', price: 15000 },
      { id: 'a2', name: 'VIP Champagne Lounge', price: 25000 }
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving add-ons' });
  }
};

// Admin Operations
exports.createTheme = async (req, res) => {
  try {
    const newTheme = {
      id: req.body.id || `pkg-${uuidv4().substring(0, 8)}`,
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      basePrice: Number(req.body.price),
      baseGuestCount: 10,
      pricePerExtraGuest: 0,
      venueDiscountAmount: 0,
      status: 'Active'
    };
    themesCatalog.push(newTheme);
    res.status(201).json({ message: 'Theme created successfully', theme: newTheme });
  } catch (error) {
    console.error('Create theme error:', error);
    res.status(500).json({ message: 'Error creating theme' });
  }
};

exports.updateTheme = async (req, res) => {
  try {
    const index = themesCatalog.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Theme not found' });
    
    themesCatalog[index] = { ...themesCatalog[index], ...req.body, id: req.params.id };
    res.json({ message: 'Theme updated successfully', theme: themesCatalog[index] });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ message: 'Error updating theme' });
  }
};

exports.deleteTheme = async (req, res) => {
  try {
    themesCatalog = themesCatalog.filter(t => t.id !== req.params.id);
    res.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Delete theme error:', error);
    res.status(500).json({ message: 'Error deleting theme' });
  }
};
