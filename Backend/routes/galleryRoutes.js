const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

// @route   GET /api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, data: galleryItems });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/gallery
// @desc    Add a gallery item (URL ONLY)
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, mediaUrl } = req.body;

    if (!title || !mediaUrl) {
      return res.status(400).json({ success: false, message: 'Please provide a title and mediaUrl' });
    }

    const newItem = new Gallery({
      title,
      description,
      type: type || 'photo',
      mediaUrl
    });

    const item = await newItem.save();
    res.json({ success: true, data: item });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update a gallery item
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, type, mediaUrl } = req.body;

    let item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (type) item.type = type;
    if (mediaUrl) item.mediaUrl = mediaUrl;

    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery item
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
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
    res.status(500).send('Server Error');
  }
});

module.exports = router;
