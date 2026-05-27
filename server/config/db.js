// config/db.js
// Establishes connection to MongoDB Atlas using Mongoose

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 * Reads MONGO_URI from environment variables
 */
const connectDB = async () => {
  // Check if we have a connection to the database or if it's currently connecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4 // Force IPv4 to fix DNS resolution issues in some networks
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit process in serverless environments, just throw the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
