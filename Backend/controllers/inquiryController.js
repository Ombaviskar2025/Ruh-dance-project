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
        const frontendUrl = process.env.FRONTEND_URL || 'https://ruhdance.vercel.app';
        const proxyUrl = `${frontendUrl}/api/send-email`;

        // Send email in the background without awaiting it to speed up the API response
        fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'default_ruh_secret_key'}`
            },
            body: JSON.stringify({
                to: 'sneha.hosadodde2004@gmail.com', // As requested by the user
                subject: 'New Join the Journey Form Submission',
                text: `You have received a new inquiry from the Join the Journey form!\n\nDetails:\nFull Name: ${newInquiry.fullName}\nPhone: ${newInquiry.phone}\nGender: ${newInquiry.gender}\nAge: ${newInquiry.age}\nDance Style: ${newInquiry.danceStyle}\nEmail: ${newInquiry.email}\nInterest: ${newInquiry.interest}\nMessage: ${newInquiry.message}`
            })
        })
        .then(res => {
            if (!res.ok) throw new Error(`Proxy status ${res.status}`);
            console.log('Inquiry notification email proxied successfully.');
        })
        .catch(emailError => console.error('CRITICAL: Failed to proxy inquiry notification email.', emailError));
    } catch (emailConfigError) {
        console.error('Failed to configure email proxy:', emailConfigError);
    }

    res.status(201).json(newInquiry);
  } catch (err) {
    console.error('Inquiry Submission Error:', err);
    res.status(400).json({ message: err.message });
  }
};