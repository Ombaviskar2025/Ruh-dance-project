const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentPhoto: { type: String },
  danceStyle: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  isApproved: { type: Boolean, default: true }, // Defaulting to true for MVP as requested
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
