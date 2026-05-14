const DMTBooking = require('../models/DMTBooking');
const nodemailer = require('nodemailer');

// ── Create a new DMT Booking ─────────────────────────────────────────────────
exports.createBooking = async (req, res) => {
  try {
    const { studentId, name, email, phone, sessionType, sessionGoal, date, time, notes } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ message: 'Please fill all required fields: name, email, phone, date, time.' });
    }

    const newBooking = await DMTBooking.create({
      student: studentId || null,
      name,
      email,
      phone,
      sessionType: sessionType || 'Individual',
      sessionGoal: sessionGoal || 'Emotional Healing',
      date,
      time,
      notes,
      status: 'Pending'
    });

    // Send email notification to Admin
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const adminEmail = 'sneha.hosadodde2004@gmail.com'; // Updated Admin Email for session notifications
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New DMT Session Booking Request - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #982598;">New DMT Session Request</h2>
            <p>A new Dance Movement Therapy session has been requested. Here are the details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Client Name:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Session Type:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${sessionType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Primary Goal:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${sessionGoal}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Requested Date:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time Slot:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Additional Notes:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${notes || 'None provided'}</td>
              </tr>
            </table>
            <p style="margin-top: 30px;">Please log in to the Admin Dashboard to manage this booking.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Email delivery to admin failed:', mailError.message);
      // We don't return an error to the user since the booking was successfully created in DB
    }

    res.status(201).json({ message: 'Booking requested successfully! We\'ll confirm via email shortly.', booking: newBooking });
  } catch (error) {
    console.error('Error creating DMT booking:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// ── Fetch bookings for a specific student ────────────────────────────────────
exports.getMyBookings = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ message: 'Student ID missing' });

    const bookings = await DMTBooking.find({ student: studentId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching DMT bookings:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// ── Admin: Get ALL bookings ───────────────────────────────────────────────────
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await DMTBooking.find()
      .populate('student', 'fullName email')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching all DMT bookings:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// ── Admin: Update booking status ─────────────────────────────────────────────
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, therapistNotes } = req.body;

    const booking = await DMTBooking.findByIdAndUpdate(
      id,
      { status, therapistNotes },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// ── Admin: Delete a booking ───────────────────────────────────────────────────
exports.deleteBooking = async (req, res) => {
  try {
    await DMTBooking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
