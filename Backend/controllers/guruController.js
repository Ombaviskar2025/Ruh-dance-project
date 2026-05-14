const Guru = require('../models/Guru');

// @desc    Get all gurus
// @route   GET /api/gurus
exports.getGurus = async (req, res) => {
  try {
    const gurus = await Guru.find();
    res.status(200).json({ success: true, data: gurus });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Create a guru
// @route   POST /api/gurus
exports.createGuru = async (req, res) => {
  try {
    const { name, style, description, instagram } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const guru = await Guru.create({
      name,
      style,
      description,
      instagram,
      image: imageUrl
    });

    res.status(201).json({ success: true, data: guru });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Update a guru
// @route   PUT /api/gurus/:id
exports.updateGuru = async (req, res) => {
  try {
    const { name, style, description, instagram } = req.body;
    let guru = await Guru.findById(req.params.id);

    if (!guru) {
      return res.status(404).json({ success: false, message: 'Guru not found' });
    }

    guru.name = name || guru.name;
    guru.style = style || guru.style;
    guru.description = description || guru.description;
    guru.instagram = instagram !== undefined ? instagram : guru.instagram;

    if (req.file) {
      guru.image = `/uploads/${req.file.filename}`;
    }

    await guru.save();
    res.status(200).json({ success: true, data: guru });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Delete a guru
// @route   DELETE /api/gurus/:id
exports.deleteGuru = async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);

    if (!guru) {
      return res.status(404).json({ success: false, message: 'Guru not found' });
    }

    await guru.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
