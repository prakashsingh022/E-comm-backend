const mongoose = require('mongoose');

const sectionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a section title'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please add a section slug'],
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Section', sectionSchema);
