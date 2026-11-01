const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// @route   GET /api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, data: galleryItems });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/gallery
// @desc    Add a gallery item (file upload OR direct URL)
// @access  Private (Admin)
router.post('/', protect, upload.single('media'), async (req, res) => {
  try {
    const { title, description, type } = req.body;
    let mediaUrl = req.body.mediaUrl ? req.body.mediaUrl.trim() : '';

    // If a file was uploaded, push it to Cloudinary
    if (req.file) {
      try {
        mediaUrl = await upload.uploadToCloudinary(req.file.buffer, req.file.mimetype);
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(500).json({ success: false, message: 'Failed to upload file to Cloudinary. Check your CLOUDINARY_* env variables.' });
      }
    }

    if (!title || !mediaUrl) {
      return res.status(400).json({ success: false, message: 'Please provide a title and media (file or URL)' });
    }

    const newItem = new Gallery({
      title,
      description,
      type: type || 'photo',
      mediaUrl,
    });

    const item = await newItem.save();
    res.json({ success: true, data: item });
  } catch (err) {
    console.error('Gallery POST error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update a gallery item
// @access  Private (Admin)
router.put('/:id', protect, upload.single('media'), async (req, res) => {
  try {
    const { title, description, type } = req.body;
    let mediaUrl = req.body.mediaUrl ? req.body.mediaUrl.trim() : '';

    // If a new file was uploaded, push it to Cloudinary
    if (req.file) {
      try {
        mediaUrl = await upload.uploadToCloudinary(req.file.buffer, req.file.mimetype);
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(500).json({ success: false, message: 'Failed to upload file to Cloudinary. Check your CLOUDINARY_* env variables.' });
      }
    }

    let item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (type) item.type = type;
    if (mediaUrl) item.mediaUrl = mediaUrl;

    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    console.error('Gallery PUT error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery item
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    await item.deleteOne();
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
