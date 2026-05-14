const upload = require('../middleware/multer'); //const express = require('express');
const express = require('express'); // Fixes 'express is not defined'
const router = express.Router();
const Production = require('../models/Production');

// 1. GET all productions (Current)
// This matches https://ruh-dance-project.onrender.com/api/productions/
router.get('/', async (req, res) => {
    try {
        const allProductions = await Production.find();
        // Return an object that matches what your frontend expects
        res.status(200).json({ productions: allProductions }); 
    } catch (error) {
        res.status(500).json({ message: "Error fetching from database", error });
    }
});

// 2. NEW: POST a new production (To fix the blank page)
router.post('/', upload.single('image'), async (req, res) => {
  const production = new Production({
    year: req.body.year,
    title: req.body.title,
    subtitle: req.body.subtitle,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image
  });

  try {
    const newProd = await production.save();
    res.status(201).json(newProd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE a production (For the pencil icon)
// router.put('/:id', upload.single('image'), async (req, res) => {
router.put('/:id', upload.single('image'), async (req, res) => {    try {
        const updatedData = {
            year: req.body.year,
            title: req.body.title,
            subtitle: req.body.subtitle,
        };

        // If a new image was uploaded, update the path
        if (req.file) {
            updatedData.image = `/uploads/${req.file.filename}`;
        }

        const production = await Production.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!production) return res.status(404).json({ message: "Production not found" });
        res.json(production);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. NEW: DELETE a production
router.delete('/:id', async (req, res) => {
    try {
        const deletedProd = await Production.findByIdAndDelete(req.params.id);
        if (!deletedProd) return res.status(404).json({ message: "Production not found" });
        res.json({ message: "Production deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;