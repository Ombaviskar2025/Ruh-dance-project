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

    // If a file was uploaded, save via Cloudinary or local fallback
    if (req.file) {
      try {
        mediaUrl = await upload.saveMedia(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadErr) {
        console.error('Media upload error:', uploadErr);
        return res.status(500).json({ success: false, message: 'Failed to process media file: ' + uploadErr.message });
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
    console.error('Gallery POST error:', err);
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

    // If a new file was uploaded, save via Cloudinary or local fallback
    if (req.file) {
      try {
        mediaUrl = await upload.saveMedia(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadErr) {
        console.error('Media upload error:', uploadErr);
        return res.status(500).json({ success: false, message: 'Failed to process media file: ' + uploadErr.message });
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
    console.error('Gallery PUT error:', err);
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
