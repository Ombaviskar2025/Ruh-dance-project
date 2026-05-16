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
const productionRoutes = require('./routes/productionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const classRoutes = require('./routes/classRoutes');
const financeRoutes = require('./routes/financeRoutes');
const dmtRoutes = require('./routes/dmtRoutes');
const guruRoutes = require('./routes/guruRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const signatureRoutes = require('./routes/signatureRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

// 3. Initialize the Express App
const app = express();
const path = require('path');

// 4. Middleware

const allowedOrigins = [
  "https://ruhdance.netlify.app",
  "https://frontend-mu-flax-66.vercel.app",
  "https://ruh-dance-project.vercel.app",
  "https://ruhdance.vercel.app"
];

// Explicitly handle OPTIONS preflight for every route and dynamic CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow if it's explicitly in the list OR if it's any vercel.app domain
  if (allowedOrigins.includes(origin) || (origin && origin.includes('vercel.app'))) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // Fallback
    res.header("Access-Control-Allow-Origin", "https://ruhdance.netlify.app");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files as static assets
app.use('/uploads', express.static(uploadsDir));

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
app.use('/api/gallery', galleryRoutes);

// 6. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");

    try {
      const adminEmail = 'sneha.hosadodde2004@gmail.com';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.findOneAndUpdate(
        { role: 'admin' }, 
        { 
          fullName: 'Main Administrator',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          isApproved: true
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

// 8. Define the Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});