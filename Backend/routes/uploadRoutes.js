const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// --- Set Up Multer for Saving Files ---
const storage = multer.diskStorage({
  // Specify the folder for saving uploads
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  // Keep original name but add a unique timestamp
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

// --- Filter and Limit Uploads ---
const upload = multer({
  storage: storage,
  // Limit to image files only
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only images (jpeg, jpg, png, webp) are allowed.');
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

// --- THE UPLOAD ENDPOINT ---
// Use this route to upload a single image. It will return the image path.
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image file.' });
  }

  // Create the image URL that the frontend can use
  // Assuming your server is running on port https://ruh-dance-project.onrender.com and serves static files
  const imageUrl = `https://ruh-dance-project.onrender.com/${req.file.path.replace(/\\/g, '/')}`;

  res.status(200).json({
    message: 'Image uploaded successfully!',
    imageUrl: imageUrl 
  });
});

module.exports = router;