const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

exports.addTestimonial = async (req, res) => {
  try {
    const { studentId, rating, text } = req.body;

    // Fetch the user to get their name, photo, and style
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTestimonial = new Testimonial({
      studentId: user._id,
      studentName: user.fullName || user.username,
      studentPhoto: user.profilePhoto || '', // Might be empty if they don't have one
      danceStyle: user.danceStyle || 'Student',
      rating,
      text,
      isApproved: true, // Auto-approve for now
    });

    const savedTestimonial = await newTestimonial.save();
    res.status(201).json({ success: true, testimonial: savedTestimonial });
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    // Only fetch approved testimonials, sort by newest
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
