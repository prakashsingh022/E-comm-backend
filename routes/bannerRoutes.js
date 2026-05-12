const express = require('express');
const router = express.Router();
const {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/adminMiddleware');

router.route('/').get(getBanners).post(protect, checkPermission('manage_products'), createBanner);
router.route('/admin').get(protect, checkPermission('manage_products'), getAllBanners);
router
  .route('/:id')
  .put(protect, checkPermission('manage_products'), updateBanner)
  .delete(protect, checkPermission('manage_products'), deleteBanner);

module.exports = router;
