const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video', 'pdf'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Media', mediaSchema);
