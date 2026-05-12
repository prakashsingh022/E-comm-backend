const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User'); // Keep for deletion

const initSystem = async () => {
  try {
    // 1. Clear old users collection (DESTRUCTIVE as requested)
    // We check if User model exists and if there are docs
    if (mongoose.connection.collections['users']) {
        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        if (userCount > 0) {
            await mongoose.connection.db.collection('users').drop();
            console.log('--- SYSTEM CLEANUP: All old users deleted ---');
        }
    }

    // 2. Create or Update Default Super Admin
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@taratara.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
    
    let admin = await Admin.findOne({ email });
    
    if (!admin) {
      await Admin.create({
        name: 'Main Super Admin',
        email: email,
        password: password,
        role: 'superadmin',
        status: 'active',
      });
      console.log('--- SYSTEM INIT: Default Super Admin Created ---');
    } else {
      // Ensure existing admin has superadmin role and update password if needed
      admin.role = 'superadmin';
      admin.status = 'active';
      admin.password = password; // Pre-save hook will re-hash it
      await admin.save();
      console.log('--- SYSTEM INIT: Super Admin credentials synced ---');
    }
    console.log(`Login Email: ${email}`);
  } catch (error) {
    console.error('System Initialization Error:', error.message);
  }
};

module.exports = initSystem;
