const mongoose = require('mongoose');

const calendarTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // We'll just use 'default' for single-user local app
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CalendarToken', calendarTokenSchema);
