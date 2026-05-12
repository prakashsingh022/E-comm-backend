const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ActivityLog = require('../models/ActivityLog');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for: ${email}`);
    const admin = await Admin.findOne({ email });

    if (!admin) {
        console.log(`Login failed: Admin not found for email ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.matchPassword(password);
    console.log(`Password match result: ${isMatch}`);

    if (isMatch) {
      if (admin.status === 'inactive') {
        console.log(`Login failed: Admin ${email} is inactive`);
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      // Update last login
      admin.lastLogin = Date.now();
      await admin.save();

      console.log(`Login successful for: ${email} (${admin.role})`);
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions || [],
        token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      });
    } else {
      console.log(`Login failed: Incorrect password for ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin, getMe };
