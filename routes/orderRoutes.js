const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { checkPermission, trackActivity } = require('../middleware/adminMiddleware');

// @desc    Get recent orders
// @route   GET /api/orders/recent
// @access  Private/Admin
router.get('/recent', protect, checkPermission('view_orders'), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, checkPermission('view_orders'), async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
router.get('/:id', protect, checkPermission('view_orders'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
router.put('/:id', protect, checkPermission('manage_orders'), trackActivity('UPDATE_ORDER', (req) => `Order ID: ${req.params.id}`), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      Object.assign(order, req.body);
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, checkPermission('manage_orders'), trackActivity('UPDATE_ORDER_STATUS', (req) => `Order: ${req.params.id} -> Status: ${req.body.status}`), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
