const Video = require('../models/Video');
const logActivity = require('../utils/logger');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).populate('productId').sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a video
// @route   POST /api/videos
// @access  Private/Admin
const addVideo = async (req, res) => {
  try {
    const { 
      videoUrl, 
      thumbnail, 
      productId, 
      title, 
      views, 
      assignedTo, 
      adOpsStatus, 
      description, 
      stock 
    } = req.body;

    const video = await Video.create({
      videoUrl,
      thumbnail,
      productId: productId === '' ? null : productId,
      assignedTo: assignedTo === '' ? null : assignedTo,
      adOpsStatus: adOpsStatus || 'Unassigned',
      title,
      description,
      stock: stock || 0,
      views: views || 0,
    });

    await logActivity(
      req.admin._id,
      'ADD_VIDEO',
      `Added Video: ${video.title || 'Untitled'}`,
      req.ip
    );

    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Private/Admin
const updateVideo = async (req, res) => {
  try {
    const { videoUrl, thumbnail, productId, title, views, assignedTo, adOpsStatus, description, stock } = req.body;

    const video = await Video.findById(req.params.id);

    if (video) {
      video.videoUrl = videoUrl || video.videoUrl;
      video.thumbnail = thumbnail || video.thumbnail;
      video.productId = productId === '' ? null : (productId || video.productId);
      video.assignedTo = assignedTo === '' ? null : (assignedTo || video.assignedTo);
      video.adOpsStatus = adOpsStatus || video.adOpsStatus;
      video.title = title || video.title;
      video.description = description || video.description;
      video.stock = stock !== undefined ? stock : video.stock;
      video.views = views !== undefined ? views : video.views;

      const updatedVideo = await video.save();

      await logActivity(
        req.admin._id,
        'UPDATE_VIDEO',
        `Updated Video: ${updatedVideo.title || 'Untitled'}`,
        req.ip
      );

      res.json(updatedVideo);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (video) {
      await Video.findByIdAndDelete(req.params.id);

      await logActivity(
        req.admin._id,
        'DELETE_VIDEO',
        `Deleted Video: ${video.title || 'Untitled'}`,
        req.ip
      );

      res.json({ message: 'Video removed' });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo,
};
