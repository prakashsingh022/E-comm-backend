const Admin = require('../models/Admin');
const ActivityLog = require('../models/ActivityLog');
const logActivity = require('../utils/logger');

// @desc    Create new admin
// @route   POST /api/admin/create
// @access  Private (SuperAdmin)
const createAdmin = async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin',
      permissions: permissions || []
    });

    if (admin) {
      await logActivity(
        req.admin._id,
        'CREATE_ADMIN',
        `Created admin: ${admin.email} | Role: ${admin.role} | Access: [${admin.permissions.join(', ') || 'None'}]`,
        req.ip
      );

      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        permissions: admin.permissions
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all admins
// @route   GET /api/admin
// @access  Private (SuperAdmin)
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin
// @route   PUT /api/admin/:id
// @access  Private (SuperAdmin)
const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      // Calculate changes for detailed logging
      const changes = [];
      if (req.body.name && req.body.name !== admin.name) changes.push(`Name: ${admin.name} -> ${req.body.name}`);
      if (req.body.email && req.body.email !== admin.email) changes.push(`Email: ${admin.email} -> ${req.body.email}`);
      if (req.body.role && req.body.role !== admin.role) changes.push(`Role: ${admin.role} -> ${req.body.role}`);
      if (req.body.status && req.body.status !== admin.status) changes.push(`Status: ${admin.status} -> ${req.body.status}`);
      
      if (req.body.permissions) {
        const oldPerms = admin.permissions || [];
        const newPerms = req.body.permissions;
        const added = newPerms.filter(p => !oldPerms.includes(p));
        const removed = oldPerms.filter(p => !newPerms.includes(p));
        if (added.length > 0) changes.push(`Added Permissions: [${added.join(', ')}]`);
        if (removed.length > 0) changes.push(`Removed Permissions: [${removed.join(', ')}]`);
      }

      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      admin.role = req.body.role || admin.role;
      admin.status = req.body.status || admin.status;
      admin.permissions = req.body.permissions || admin.permissions;

      if (req.body.password) {
        admin.password = req.body.password;
        changes.push('Password updated');
      }

      const updatedAdmin = await admin.save();

      await logActivity(
        req.admin._id,
        'UPDATE_ADMIN',
        `Admin: ${updatedAdmin.email} | Changes: ${changes.join(' | ') || 'No manual fields changed'}`,
        req.ip
      );

      res.json({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        status: updatedAdmin.status,
        permissions: updatedAdmin.permissions
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private (SuperAdmin)
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      if (admin.role === 'superadmin') {
        return res.status(400).json({ message: 'Cannot delete a superadmin' });
      }

      await admin.deleteOne();

      await logActivity(
        req.admin._id,
        'DELETE_ADMIN',
        `Deleted admin with email: ${admin.email}`,
        req.ip
      );

      res.json({ message: 'Admin removed' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
};
