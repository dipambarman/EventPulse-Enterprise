// analyticsController.js - Handles business performance & revenue stats

exports.getExecutiveAnalytics = (req, res) => {
  res.json({
    totalRevenue: 2485000,
    monthlyRevenue: 680000,
    activeBookings: 14,
    conversionRate: 34.2,
    monthlyChart: [
      { month: 'Jan', revenue: 320000 },
      { month: 'Feb', revenue: 410000 },
      { month: 'Mar', revenue: 380000 },
      { month: 'Apr', revenue: 520000 },
      { month: 'May', revenue: 610000 },
      { month: 'Jun', revenue: 680000 }
    ],
    categoryBreakdown: [
      { category: 'Wedding', percentage: 55 },
      { category: 'Corporate', percentage: 25 },
      { category: 'Birthday', percentage: 12 },
      { category: 'Travel', percentage: 8 }
    ]
  });
};
