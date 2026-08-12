const prisma = require('../db/db');
const { v4: uuidv4 } = require('uuid');

exports.getAllThemes = async (req, res) => {
  try {
    const { category } = req.query;
    
    const where = {};
    if (category) {
      where.category = {
        name: { equals: category } // Note: Prisma MySQL doesn't natively do case-insensitive without mode: 'insensitive' (requires PostgreSQL) or lowercasing. We assume exact match for now.
      };
    }

    const themes = await prisma.theme.findMany({
      where,
      include: {
        category: true
      }
    });

    // Map to include category name at the top level for backward compatibility
    const mappedThemes = themes.map(t => ({
      ...t,
      category: t.category?.name || 'Uncategorized'
    }));

    res.json(mappedThemes);
  } catch (error) {
    console.error('Error retrieving themes:', error);
    res.status(500).json({ message: 'Error retrieving experience themes' });
  }
};

exports.getThemeCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: { name: true }
    });
    res.json(categories.map(c => c.name));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

exports.getThemeById = async (req, res) => {
  try {
    const theme = await prisma.theme.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    
    if (!theme) return res.status(404).json({ message: 'Theme package not found' });
    
    res.json({
      ...theme,
      category: theme.category?.name || 'Uncategorized'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving theme' });
  }
};

exports.getThemeAddOns = async (req, res) => {
  try {
    const addons = await prisma.addOn.findMany();
    res.json(addons);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving add-ons' });
  }
};

// Admin Operations
exports.createTheme = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    
    // Find or create category
    let cat = await prisma.category.findUnique({ where: { name: category } });
    if (!cat) {
      cat = await prisma.category.create({ data: { name: category } });
    }

    const newTheme = await prisma.theme.create({
      data: {
        id: req.body.id || `pkg-${uuidv4().substring(0, 8)}`,
        name,
        category_id: cat.id,
        price: Number(price),
        basePrice: Number(price),
        baseGuestCount: 10,
        pricePerExtraGuest: 0,
        venueDiscountAmount: 0,
        status: 'Active'
      },
      include: { category: true }
    });
    
    res.status(201).json({ 
      message: 'Theme created successfully', 
      theme: { ...newTheme, category: newTheme.category.name } 
    });
  } catch (error) {
    console.error('Create theme error:', error);
    res.status(500).json({ message: 'Error creating theme' });
  }
};

exports.updateTheme = async (req, res) => {
  try {
    const { name, category, price, basePrice, baseGuestCount, pricePerExtraGuest, venueDiscountAmount, status, description } = req.body;
    
    const data = {};
    if (name) data.name = name;
    if (price !== undefined) data.price = Number(price);
    if (basePrice !== undefined) data.basePrice = Number(basePrice);
    if (baseGuestCount !== undefined) data.baseGuestCount = Number(baseGuestCount);
    if (pricePerExtraGuest !== undefined) data.pricePerExtraGuest = Number(pricePerExtraGuest);
    if (venueDiscountAmount !== undefined) data.venueDiscountAmount = Number(venueDiscountAmount);
    if (status) data.status = status;
    if (description) data.description = description;

    if (category) {
      let cat = await prisma.category.findUnique({ where: { name: category } });
      if (!cat) {
        cat = await prisma.category.create({ data: { name: category } });
      }
      data.category_id = cat.id;
    }

    const updatedTheme = await prisma.theme.update({
      where: { id: req.params.id },
      data,
      include: { category: true }
    });
    
    res.json({ 
      message: 'Theme updated successfully', 
      theme: { ...updatedTheme, category: updatedTheme.category.name } 
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ message: 'Error updating theme' });
  }
};

exports.deleteTheme = async (req, res) => {
  try {
    await prisma.theme.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Delete theme error:', error);
    res.status(500).json({ message: 'Error deleting theme' });
  }
};
