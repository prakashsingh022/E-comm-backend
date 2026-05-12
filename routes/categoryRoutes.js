const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/adminMiddleware');

router.route('/').get(getCategories).post(protect, checkPermission('manage_products'), createCategory);
router
  .route('/:id')
  .put(protect, checkPermission('manage_products'), updateCategory)
  .delete(protect, checkPermission('manage_products'), deleteCategory);

module.exports = router;
