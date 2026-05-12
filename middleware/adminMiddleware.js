const logActivity = require('../utils/logger');

// Check for specific permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ message: 'Not authorized' });
    
    if (req.admin.role === 'superadmin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ message: `Insufficient permissions: ${permission}` });
    }
  };
};

// Activity Logging Middleware
const trackActivity = (action, detailsFn) => {
  return async (req, res, next) => {
    // Capture original json function to log after response is sent successfully
    const originalJson = res.json;
    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.admin) {
        const details = typeof detailsFn === 'function' ? detailsFn(req) : detailsFn;
        logActivity(req.admin._id, action, details, req.ip);
        
        // Emit to socket for real-time dashboard updates
        if (req.io) {
          req.io.emit('new_activity', { action, admin: req.admin.name });
        }
      }
      return originalJson.call(this, data);
    };
    next();
  };
};

module.exports = { checkPermission, trackActivity };
