// Backend/controllers/inquiryController.js
const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createInquiry = async (req, res) => {
  try {
    const newInquiry = await Inquiry.create(req.body);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sneha.hosadodde2004@gmail.com', // As requested by the user
            subject: 'New Join the Journey Form Submission',
            text: `You have received a new inquiry from the Join the Journey form!\n\nDetails:\nFull Name: ${newInquiry.fullName}\nPhone: ${newInquiry.phone}\nGender: ${newInquiry.gender}\nAge: ${newInquiry.age}\nDance Style: ${newInquiry.danceStyle}\nEmail: ${newInquiry.email}\nInterest: ${newInquiry.interest}\nMessage: ${newInquiry.message}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Inquiry notification email sent successfully.');
    } catch (emailError) {
        console.error('Failed to send inquiry notification email:', emailError);
    }

    res.status(201).json(newInquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};