const mongoose = require('mongoose');

const videoSchema = mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: [true, 'Please add a video URL'],
    },
    thumbnail: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    adOpsStatus: {
      type: String,
      enum: ['Unassigned', 'Pending', 'Active', 'Completed'],
      default: 'Unassigned'
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Video', videoSchema);
