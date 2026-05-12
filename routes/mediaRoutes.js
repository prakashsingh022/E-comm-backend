const express = require('express');
const router = express.Router();
const { uploadMedia, getAllMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/upload', protect, upload.array('files', 10), uploadMedia);
router.get('/', protect, getAllMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
