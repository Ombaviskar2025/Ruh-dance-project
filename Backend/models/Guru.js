const mongoose = require('mongoose');

const guruSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or path to the uploaded image
    default: null,
  },
  instagram: {
    type: String, // Optional Instagram handle/link
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Guru', guruSchema);
