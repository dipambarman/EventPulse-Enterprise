exports.getAllAddOns = async (req, res) => {
  res.json([
    { id: 'a1', name: 'Extra Photographer', price: 10000 },
    { id: 'a2', name: 'Live Acoustic Band', price: 20000 },
    { id: 'a3', name: 'VIP Pyro Effects', price: 15000 }
  ]);
};

exports.getAddOnById = async (req, res) => {
  res.json({ id: req.params.id, name: 'Extra Photographer', price: 10000 });
};
