const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in environment variables.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;
    connection.on('connected', () => console.log('MongoDB connected successfully!'));
    connection.on('error', (err) => console.error('MongoDB connection error:', err));
    connection.on('disconnected', () => console.log('MongoDB disconnected.'));
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };