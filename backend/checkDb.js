import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';

dotenv.config();

const check = async () => {
  await connectDB();
  const users = await User.find({});
  console.log("Users in DB:");
  users.forEach(u => console.log(u.email, u.role));
  
  // also specifically check for admin@example.com
  const admin = await User.findOne({ email: 'admin@example.com' });
  if (!admin) {
      console.log("admin@example.com NOT FOUND. Creating...");
      // Let's create it right now
      const bcrypt = (await import('bcryptjs')).default;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
          full_name: 'Admin User',
          email: 'admin@example.com',
          password_hash: hashedPassword,
          role: 'ADMIN',
          is_active: true
      });
      console.log("Created admin@example.com");
  } else {
      console.log("admin@example.com ALREADY EXISTS");
  }
  process.exit(0);
};

check();
