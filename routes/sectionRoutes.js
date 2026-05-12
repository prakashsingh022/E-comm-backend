const express = require('express');
const router = express.Router();
const {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} = require('../controllers/sectionController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/adminMiddleware');

router.route('/').get(getSections);
router.post('/add', protect, checkPermission('manage_products'), createSection);
router
  .route('/:id')
  .put(protect, checkPermission('manage_products'), updateSection)
  .delete(protect, checkPermission('manage_products'), deleteSection);

module.exports = router;
