const mongoose = require('mongoose');
const User = require('../models/User');
const Report = require('../models/Report');
require('dotenv').config();

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('Please set MONGODB_URI in your environment or .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB (seed)');

    const demoEmail = 'demo@safefind.local';
    let user = await User.findOne({ email: demoEmail });
    if (!user) {
      user = new User({ name: 'Demo User', email: demoEmail, password: 'password123' });
      await user.save();
      console.log('Created demo user');
    } else {
      console.log('Demo user already exists');
    }

    // Admin user seed
    const adminEmail = 'admin@safefind.local';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({ name: 'Admin User', email: adminEmail, password: 'adminpass', isAdmin: true });
      await admin.save();
      console.log('Created admin user');
    } else {
      console.log('Admin user already exists');
      if (!admin.isAdmin) {
        admin.isAdmin = true;
        await admin.save();
        console.log('Updated admin user to admin');
      }
    }

    // Create sample reports if none exist for the user
    const existing = await Report.find({ user: user._id }).limit(1);
    if (existing.length === 0) {
      const samples = [
        { user: user._id, name: 'A. Missing', age: 34, location: 'Central Park', description: 'Last seen wearing a blue jacket.' },
        { user: user._id, name: 'B. Missing', age: 7, location: 'Downtown Mall', description: 'Child with red cap.' },
        { user: user._id, name: 'C. Missing', age: 42, location: 'Riverside', description: 'Adult with gray hoodie.' },
      ];
      await Report.insertMany(samples);
      console.log('Seeded sample reports');
    } else {
      console.log('Reports already exist, skipping seed for reports');
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
