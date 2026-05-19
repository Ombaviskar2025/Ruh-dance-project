const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  homeVideoUrl: {
    type: String,
    default: 'https://cdn.pixabay.com/video/2021/08/11/84687-587889617_tiny.mp4' // Default placeholder
  },
  theme: {
    wine: { type: String, default: '#722F37' },
    brandPurple: { type: String, default: '#982598' },
    brandPink: { type: String, default: '#E491C9' },
    darkNavy: { type: String, default: '#15173D' },
    deepPurple: { type: String, default: '#4B0082' },
    lightPurple: { type: String, default: '#D8BFD8' },
    lightGray: { type: String, default: '#F1E9E9' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
