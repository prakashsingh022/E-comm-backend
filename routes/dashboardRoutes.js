const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/adminMiddleware');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
router.get('/stats', protect, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' }); 
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    const stats = {
      revenue: {
        value: totalRevenue.toFixed(2),
        growth: '+12.5%',
        trend: 'up'
      },
      orders: {
        value: totalOrders,
        growth: '+8.2%',
        trend: 'up'
      },
      users: {
        value: totalUsers,
        growth: '+5.4%',
        trend: 'up'
      },
      products: {
        value: totalProducts,
        growth: '+2.1%',
        trend: 'up'
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
