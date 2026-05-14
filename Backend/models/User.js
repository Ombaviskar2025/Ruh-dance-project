const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true , trim:true},
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  danceStyle: { type: String, required: true }, // Ensure this matches frontend
  role: { type: String, default: 'student' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isApproved: { type: Boolean, default: false }, // Instructors start as unapproved
});

module.exports = mongoose.model('User', UserSchema);