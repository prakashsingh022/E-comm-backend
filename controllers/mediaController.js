const Media = require('../models/Media');
const { cloudinary } = require('../config/cloudinary');
const logActivity = require('../utils/logger');

// @desc    Upload multiple files
// @route   POST /api/media/upload
// @access  Private (Admin)
const uploadMedia = async (req, res) => {
  try {
    console.log('Upload request received');
    if (!req.files || req.files.length === 0) {
      console.log('No files found in request');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    console.log(`Processing ${req.files.length} files...`);
    const uploadedMedia = [];

    for (const file of req.files) {
      let type = 'image';
      if (file.mimetype.includes('video')) type = 'video';
      if (file.mimetype.includes('pdf')) type = 'pdf';

      console.log(`Saving to DB: ${file.originalname}`);
      const media = await Media.create({
        url: file.path,
        public_id: file.filename,
        type: type,
        name: file.originalname,
        folder: 'products',
        uploadedBy: req.admin._id,
      });

      uploadedMedia.push(media);
    }

    await logActivity(
      req.admin._id,
      'UPLOAD_MEDIA',
      `Uploaded ${uploadedMedia.length} assets: ${uploadedMedia.map(m => m.name).join(', ')}`,
      req.ip
    );

    console.log('Upload completed successfully');
    res.status(201).json(uploadedMedia);
  } catch (error) {
    console.error('CRITICAL UPLOAD ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all media
// @route   GET /api/media
// @access  Private (Admin)
const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private (Admin)
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    const mediaName = media.name;

    // Delete from Cloudinary
    let resource_type = 'image';
    if (media.type === 'video') resource_type = 'video';
    if (media.type === 'pdf') resource_type = 'raw';

    await cloudinary.uploader.destroy(media.public_id, { resource_type });

    // Delete from DB
    await media.deleteOne();

    await logActivity(
      req.admin._id,
      'DELETE_MEDIA',
      `Removed asset: ${mediaName}`,
      req.ip
    );

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMedia, getAllMedia, deleteMedia };
