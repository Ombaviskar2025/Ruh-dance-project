// 1. Load environment variables IMMEDIATELY
require('dotenv').config(); 
const User = require('./models/User'); 

const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Import Routes
const inquiryRoutes = require('./routes/inquiryRoutes');
const authRoutes = require('./routes/authRoutes');
const styleRoutes = require('./routes/styleRoutes');
const productionRoutes = require('./routes/productionRoutes'); // Adjust path as needed

const eventRoutes = require('./routes/eventRoutes');
const classRoutes = require('./routes/classRoutes');
const financeRoutes = require('./routes/financeRoutes');
const dmtRoutes = require('./routes/dmtRoutes');
const guruRoutes = require('./routes/guruRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const signatureRoutes = require('./routes/signatureRoutes');

// 3. Initialize the Express App
const app = express();
const path = require('path');
// 4. Middleware
app.use(express.json()); 
app.use(cors({
  origin: "https://ruhdance.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());  
app.use('/uploads', express.static( 'uploads'));      

// 5. Use the routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/productions', productionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/dmt-bookings', dmtRoutes);
app.use('/api/gurus', guruRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/signatures', signatureRoutes);

// 6. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");

    // --- ADMIN INITIALIZATION & SYNCHRONIZATION ---
    try {
      const adminEmail = 'sneha.hosadodde2004@gmail.com'; // Matches your login attempt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt); // Your temporary password

      // This logic will CREATE the admin if missing or UPDATE it if it exists
      // This ensures the role is 'admin' and the account is approved
      await User.findOneAndUpdate(
        { role: 'admin' }, 
        { 
          fullName: 'Main Administrator',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          isApproved: true // Fixes "Access Denied" if you have approval logic
        },
        { upsert: true, new: true }
      );
      
      console.log("🚀 Admin account synchronized: sneha.hosadodde2004@gmail.com / admin123");
    } catch (err) {
      console.error("Admin initialization error:", err.message);
    }
  })
  .catch(err => console.log("❌ MongoDB Connection Error: ", err));

// 7. Basic Test Route
app.get('/', (req, res) => {
    res.send("Ruh Dance Production API is running...");
});
// app.get('/api/productions', (req, res) => {
//   // Ensure this route exists and returns your data array
// });

// 8. Define the Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});