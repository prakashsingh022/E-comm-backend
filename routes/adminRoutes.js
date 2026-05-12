const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminController');
const { protect, isSuperAdmin } = require('../middleware/auth');

// All routes here are protected and require SuperAdmin role
router.use(protect);
router.use(isSuperAdmin);

router.post('/create', createAdmin);
router.get('/', getAdmins);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
