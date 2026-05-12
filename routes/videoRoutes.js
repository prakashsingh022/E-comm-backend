const express = require('express');
const router = express.Router();
const {
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getVideos)
  .post(protect, checkPermission('manage_products'), addVideo);

router.route('/:id')
  .put(protect, checkPermission('manage_products'), updateVideo)
  .delete(protect, checkPermission('manage_products'), deleteVideo);

module.exports = router;
