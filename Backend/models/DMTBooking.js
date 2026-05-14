const mongoose = require('mongoose');

const dmtBookingSchema = new mongoose.Schema({
  // Guest / logged-in user identification
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Direct contact info (for guests or confirmation)
  name: { type: String, required: [true, 'Please provide your name'] },
  email: { type: String, required: [true, 'Please provide your email'] },
  phone: { type: String, required: [true, 'Please provide your phone number'] },

  // Session details
  sessionType: {
    type: String,
    enum: ['Individual', 'Group', 'Online'],
    default: 'Individual'
  },
  sessionGoal: {
    type: String,
    enum: ['Emotional Healing', 'Stress Reduction', 'Trauma Recovery', 'Self-Exploration', 'Physical Rehabilitation', 'Other'],
    default: 'Emotional Healing'
  },
  date: { type: Date, required: [true, 'Please select a date for your session'] },
  time: { type: String, required: [true, 'Please select a time slot'] },
  notes: { type: String, default: '' },

  // Admin management
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  therapistNotes: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DMTBooking', dmtBookingSchema);
