const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { protect, isSuperAdmin } = require('../middleware/auth');

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Private/SuperAdmin
router.get('/', protect, isSuperAdmin, async (req, res) => {
  try {
    const logs = await ActivityLog.find({})
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
