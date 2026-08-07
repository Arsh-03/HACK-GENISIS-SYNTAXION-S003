import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const run = async () => {
  await connectDB();
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('password123', salt);

  const newUsers = [
    {
      full_name: 'Student One',
      email: 'student1@example.com',
      password_hash,
      role: 'STUDENT',
      roll_number: 'STU-001'
    },
    {
      full_name: 'Student Two',
      email: 'student2@example.com',
      password_hash,
      role: 'STUDENT',
      roll_number: 'STU-002'
    },
    {
      full_name: 'Invigilator User',
      email: 'invigilator@example.com',
      password_hash,
      role: 'INVIGILATOR',
      roll_number: 'INV-001'
    }
  ];

  for (const u of newUsers) {
    await User.findOneAndUpdate({ email: u.email }, u, { upsert: true });
  }

  process.exit(0);
};

run();
