const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, details, io = null) => {
  try {
    const log = await ActivityLog.create({
      user: userId,
      action,
      details
    });
    
    // If Socket.io is available, emit the new log
    if (io) {
      io.emit('new_activity', {
        ...log._doc,
        // We'll populate User info in the frontend or emit it here
      });
    }
    
    return log;
  } catch (error) {
    console.error('Activity Log Error:', error);
  }
};

module.exports = { logActivity };
