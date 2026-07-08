const themes = [
  // Birthday party themes
  { id: 'b1', name: 'Birthday Standard', category: 'Birthday', price: 3000, basePrice: 3000, baseGuestCount: 10, pricePerExtraGuest: 100, venueDiscountAmount: 200,
    gallery: [
      '/src/assets/standardshow1.jpg',
      '/src/assets/standardshow2.webp',
      '/src/assets/standardshow3.jpeg'
    ]
  },
  { id: 'b2', name: 'Birthday Premium', category: 'Birthday', price: 8099, basePrice: 8099, baseGuestCount: 15, pricePerExtraGuest: 150, venueDiscountAmount: 300,
    gallery: [
      '/src/assets/premiumshow1.jpg',
      '/src/assets/premiumshow2.avif',
      '/src/assets/premiumshow3.jpg'
    ]
  },
  { id: 'b3', name: 'Birthday Exclusive', category: 'Birthday', price: 15000, basePrice: 15000, baseGuestCount: 20, pricePerExtraGuest: 200, venueDiscountAmount: 400,
    gallery: [
      '/src/assets/exclusiveshow1.jpg',
      '/src/assets/exclusiveshow2.jpeg',
      '/src/assets/exclusiveshow3.jpg'
    ]
  },
  // Corporate events themes
  { id: 'c1', name: 'Corporate Standard', category: 'Corporate', price: 10999, basePrice: 10999, baseGuestCount: 20, pricePerExtraGuest: 250, venueDiscountAmount: 500,
    gallery: [
      '/src/assets/stand1.jpg',
      '/src/assets/stand2.jpg',
      '/src/assets/stand3.webp'
    ]
  },
  { id: 'c2', name: 'Corporate Premium', category: 'Corporate', price: 25009, basePrice: 25009, baseGuestCount: 30, pricePerExtraGuest: 300, venueDiscountAmount: 600,
    gallery: [
      '/src/assets/pre1.png',
      '/src/assets/pre2.jpg',
      '/src/assets/corpre3.jpg'
    ]
  },
  { id: 'c3', name: 'Corporate Exclusive', category: 'Corporate', price: 50099, basePrice: 50099, baseGuestCount: 40, pricePerExtraGuest: 350, venueDiscountAmount: 700,
    gallery: [
      '/src/assets/execlusive1.jpg',
      '/src/assets/execlusive2.jpg',
      '/src/assets/corexeclusive3.jpg'
    ]
  },
  // Weddings themes
  { id: 'w1', name: 'Wedding Standard', category: 'Wedding', price: 3000000, basePrice: 3000000, baseGuestCount: 50, pricePerExtraGuest: 500, venueDiscountAmount: 1000,
    gallery: [
      '/src/assets/wedstand1.jpg',
      '/src/assets/wedstand2.jpg',
      '/src/assets/wedstand3.avif'
    ]
  },
  { id: 'w2', name: 'Wedding Premium', category: 'Wedding', price: 5500000, basePrice: 5500000, baseGuestCount: 60, pricePerExtraGuest: 600, venueDiscountAmount: 1200,
    gallery: [
      '/src/assets/wedpre1.webp',
      '/src/assets/wedpre2.jpg',
      '/src/assets/wedpre3.webp'
    ]
  },
  { id: 'w3', name: 'Wedding Exclusive', category: 'Wedding', price: 10000000, basePrice: 10000000, baseGuestCount: 70, pricePerExtraGuest: 700, venueDiscountAmount: 1400,
    gallery: [
      '/src/assets/wedexe1.jpg',
      '/src/assets/wedexe2.webp',
      '/src/assets/wedexe3.jpg'
    ]
  },
  // Travel packages themes with updated prices
  { id: 't1', name: 'Meghalaya Travel Package', category: 'Travel', price: 7000, basePrice: 7000, baseGuestCount: 5, pricePerExtraGuest: 50, venueDiscountAmount: 100,
    gallery: [
      '/src/assets/meghlogo.avif',
      '/src/assets/meghshow1.jpg',
      '/src/assets/meghshow2.webp',
      '/src/assets/meghshow3.jpg'
    ]
  },
  { id: 't2', name: 'Arunachal Travel Package', category: 'Travel', price: 12000, basePrice: 12000, baseGuestCount: 6, pricePerExtraGuest: 60, venueDiscountAmount: 120,
    gallery: [
      '/src/assets/arulogo.webp',
      '/src/assets/arushow1.webp',
      '/src/assets/arushow2.jpg',
      '/src/assets/arushow3.webp'
    ]
  },
  { id: 't3', name: 'Sikkim Travel Package', category: 'Travel', price: 20000, basePrice: 20000, baseGuestCount: 7, pricePerExtraGuest: 70, venueDiscountAmount: 140,
    gallery: [
      '/src/assets/siklogo.jpeg',
      '/src/assets/sikshow1.jpg',
      '/src/assets/sikshow2.webp',
      '/src/assets/sikshow3.jpg'
    ]
  },
  { id: 't4', name: 'Manali Travel Package', category: 'Travel', price: 25000, basePrice: 25000, baseGuestCount: 8, pricePerExtraGuest: 80, venueDiscountAmount: 160,
    gallery: [
      '/src/assets/manlogo.jpg',
      '/src/assets/manshow1.jpg',
      '/src/assets/manshow2.webp',
      '/src/assets/manshow3.webp'
    ]
  },
  { id: 't5', name: 'Delhi Travel Package', category: 'Travel', price: 21000, basePrice: 21000, baseGuestCount: 9, pricePerExtraGuest: 90, venueDiscountAmount: 180,
    gallery: [
      '/src/assets/dellogo.jpg',
      '/src/assets/delshow1.jpg',
      '/src/assets/delshow2.jpg',
      '/src/assets/delshow3.webp'
    ]
  },
  { id: 't6', name: 'Jammu and Kashmir Travel Package', category: 'Travel', price: 23000, basePrice: 23000, baseGuestCount: 10, pricePerExtraGuest: 100, venueDiscountAmount: 200,
    gallery: [
      '/src/assets/kashlogo.jpg',
      '/src/assets/kashshow1.webp',
      '/src/assets/kashshow2.webp',
      '/src/assets/kashshow3.webp'
    ]
  }
];

const categories = ['Birthday', 'Corporate', 'Wedding', 'Travel'];

const addOns = {
  'b1': [{ id: 'a1', name: 'Extra Balloons', price: 200 }],
  'b2': [{ id: 'a2', name: 'Premium Cake', price: 500 }],
  'b3': [{ id: 'a3', name: 'Celebrity Appearance', price: 5000 }],
  // Add more addOns as needed
};

exports.getAllThemes = (req, res) => {
  const filters = req.query;
  let filteredThemes = themes;

  if (filters.category) {
    filteredThemes = filteredThemes.filter(theme => theme.category === filters.category);
  }
  // Add more filter logic as needed

  res.json(filteredThemes);
};

exports.getThemeById = (req, res) => {
  const theme = themes.find(t => t.id === req.params.id);
  if (!theme) {
    return res.status(404).json({ message: 'Theme not found' });
  }
  res.json(theme);
};

exports.getThemeCategories = (req, res) => {
  res.json(categories);
};

exports.getThemeAddOns = (req, res) => {
  const themeAddOns = addOns[req.params.id] || [];
  res.json(themeAddOns);
};

exports.themes = themes;
