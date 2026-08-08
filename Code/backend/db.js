import mongoose from 'mongoose';

const inMemoryStore = {
  users: [],
  exams: [],
  candidateAttempts: [],
  alerts: [],
  incidents: [],
  logs: [],
  seats: []
};

let useMemory = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    useMemory = false;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn('Falling back to IN-MEMORY store for development/testing.');
    useMemory = true;
  }
};

export default connectDB;
export { useMemory, inMemoryStore };
