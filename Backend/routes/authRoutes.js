const crypto = require('crypto'); // Declared ONLY once at the top
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// --- 1. LOGIN ROUTE ---
router.post('/login/:role', login);

// --- 2. REGISTRATION ROUTE ---
router.post('/register', register);

// --- 3. DATA RETRIEVAL ROUTES ---
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: "Database query failed", error: err.message });
    }
});

router.get('/instructors', async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor' }).select('-password');
        res.json(instructors);
    } catch (err) {
        res.status(500).json({ message: "Error fetching instructors" });
    }
});

// --- 4. FORGOT/RESET PASSWORD LOGIC ---
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No user found with that email" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'https://ruhdance.vercel.app';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'RUH Dance - Password Reset Request',
            html: `<h3>Reset your password</h3><p>Click below to set a new password:</p><a href="${resetUrl}">${resetUrl}</a>`
        });

        res.status(200).json({ message: "Success! Please check your Gmail inbox." });
    } catch (err) {
        res.status(500).json({ message: "Server error, try again later." });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token." });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully! You can now log in." });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// --- 5. ADMIN ACTIONS ---
router.post('/admin/add-instructor', upload.single('profilePhoto'), async (req, res) => {
    try {
        const { fullName, email, password, age, danceStyle, gender, phone } = req.body;
        
        // Validation for Mongoose requirements
        if (!gender || !phone) return res.status(400).json({ message: "Gender and Phone are required." });

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists with this email" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const resetToken = crypto.randomBytes(20).toString('hex');

        const newUser = new User({
            fullName, email: email.toLowerCase(), password: hashedPassword,
            age, danceStyle, gender, phone,
            role: 'instructor',
            isApproved: true,
            profilePhoto: req.file ? req.file.path : (req.body.profilePhotoUrl || req.body.profilePhoto || ''),
            resetPasswordToken: resetToken,
            resetPasswordExpires: Date.now() + 3600000 
        });

        await newUser.save();

        // Wrap Mail in a separate try/catch so DB save isn't rolled back if Gmail fails
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });

            const frontendUrl = process.env.FRONTEND_URL || 'https://ruhdance.vercel.app';
            const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to RUH Dance Production - Set Your Password',
                html: `<h1>Welcome, ${fullName}!</h1><p>Click below to set your permanent password:</p><a href="${resetUrl}">${resetUrl}</a>`
            });
        } catch (mailErr) {
            console.error("Email delivery failed:", mailErr.message);
        }

        res.status(201).json({ message: "Instructor created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase(), role: 'admin' },
            { password: hashedPassword },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put('/update-profile/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        // Delete structural fields to prevent overriding core access logic
        delete updateData.password;
        delete updateData.role;
        delete updateData.email; 
        delete updateData.isApproved;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true }
        ).select('-password');
        
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Update Error", error: err.message });
    }
});

router.delete('/instructor/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Instructor deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});
// Example backend handler
// Ensure this is in your auth routes file
// A single route can handle deleting any user by ID
// Add this inside Backend/routes/authRoutes.js
router.delete('/student/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});
// Example Backend Route
router.post('/', protect, admin, async (req, res) => {
  const { title, date, desc, category } = req.body;
  const newEvent = await Event.create({ title, date, desc, category });
  res.status(201).json({ event: newEvent });
});
module.exports = router;