const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get revenue analytics for line chart
// @route   GET /api/analytics/revenue
// @access  Private/Admin
router.get('/revenue', async (req, res) => {
  try {
    const days = req.query.days || 7;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const orders = await Order.find({
      isPaid: true,
      createdAt: { $gte: dateLimit }
    }).sort({ createdAt: 1 });

    // Group by date
    const revenueData = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      revenueData[date] = (revenueData[date] || 0) + order.totalPrice;
    });

    // Format for chart (e.g., [{ date: '2023-10-01', amount: 400 }])
    const formattedData = Object.entries(revenueData).map(([date, amount]) => ({
      date,
      amount: parseFloat(amount.toFixed(2))
    }));

    // If no data, provide mock for demo
    if (formattedData.length === 0) {
      const mockData = [];
      for (let i = days; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        mockData.push({
          date: d.toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 5000) + 1000
        });
      }
      return res.json(mockData);
    }

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
router.get('/top-products', async (req, res) => {
  try {
    // In a real app, you'd aggregate orders to find best sellers
    // For now, let's fetch products with lowest stock or just a few products as "top"
    const products = await Product.find().limit(5);
    const topProducts = products.map(p => ({
      id: p._id,
      name: p.name,
      image: p.image,
      sales: Math.floor(Math.random() * 500) + 50, // Mock sales count
      revenue: (Math.random() * 5000).toFixed(2)
    }));
    
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
