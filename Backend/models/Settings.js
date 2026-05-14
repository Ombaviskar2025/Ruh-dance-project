const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  homeVideoUrl: {
    type: String,
    default: 'https://cdn.pixabay.com/video/2021/08/11/84687-587889617_tiny.mp4' // Default placeholder
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
