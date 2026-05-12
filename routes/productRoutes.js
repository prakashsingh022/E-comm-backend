const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/adminMiddleware');

// Routes mapping
router.route('/')
  .get(getProducts)
  .post(protect, checkPermission('manage_products'), createProduct);

router.post('/add', protect, checkPermission('manage_products'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, checkPermission('manage_products'), updateProduct)
  .delete(protect, checkPermission('manage_products'), deleteProduct);

module.exports = router;
