import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  roll_number: { type: String, unique: true, sparse: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'ADMIN', 'INVIGILATOR'], default: 'STUDENT' },
  assigned_center_id: { type: String },
  assigned_terminal_id: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
}, {
  collection: 'users'
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

const User = mongoose.model('User', userSchema);
export default User;
