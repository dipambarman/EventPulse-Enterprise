const prisma = require('../db/db');

exports.getAllAddOns = async (req, res) => {
  try {
    const addOns = await prisma.addOn.findMany();
    res.json(addOns);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving add-ons' });
  }
};

exports.getAddOnById = async (req, res) => {
  try {
    const addOn = await prisma.addOn.findUnique({
      where: { id: req.params.id }
    });
    if (!addOn) {
      return res.status(404).json({ message: 'Add-on not found' });
    }
    res.json(addOn);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving add-on' });
  }
};
