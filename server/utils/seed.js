// utils/seed.js
// Seeds an initial admin user into the database
// Run with: npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existing = await AdminUser.findOne({ email: 'president@shecanfoundation.org' });
    if (existing) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create default admin user
    const admin = await AdminUser.create({
      username: 'She Can Admin',
      email: 'president@shecanfoundation.org',
      password: 'Admin@123',  // Change this after first login!
      role: 'superadmin',
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: Admin@123`);
    console.log(`   ⚠️  Please change the password after first login!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
