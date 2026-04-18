const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

let connected = false;

async function connectDB() {
  if (connected) return;
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/meeting_intelligence';
  try {
    await mongoose.connect(uri);
    connected = true;
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    // App continues in degraded mode (no persistence)
  }
}

module.exports = { connectDB };
