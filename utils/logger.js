const ActivityLog = require('../models/ActivityLog');

const logActivity = async (adminId, action, details, ip) => {
  try {
    await ActivityLog.create({
      admin: adminId,
      action,
      details,
      ip,
    });
  } catch (error) {
    console.error('Activity Logging Error:', error.message);
  }
};

module.exports = logActivity;
