const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    action: {
      type: String, // e.g., 'CREATE_ADMIN', 'DELETE_ADMIN', 'UPDATE_STATUS'
      required: true,
    },
    details: {
      type: String,
    },
    ip: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
