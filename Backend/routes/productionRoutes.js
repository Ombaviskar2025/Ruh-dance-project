const upload = require('../middleware/multer');
const express = require('express');
const router = express.Router();
const Production = require('../models/Production');

// 1. GET all productions
router.get('/', async (req, res) => {
    try {
        const allProductions = await Production.find();
        res.status(200).json({ productions: allProductions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching from database", error });
    }
});

// 2. POST a new production
router.post('/', upload.single('image'), async (req, res) => {
    try {
        let imageUrl = req.body.imageUrl || req.body.image || '';
        if (req.file) {
            imageUrl = await upload.uploadToCloudinary(req.file.buffer, req.file.mimetype);
        }

        const production = new Production({
            year: req.body.year,
            title: req.body.title,
            subtitle: req.body.subtitle,
            image: imageUrl,
        });

        const newProd = await production.save();
        res.status(201).json(newProd);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. UPDATE a production
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updatedData = {
            year: req.body.year,
            title: req.body.title,
            subtitle: req.body.subtitle,
        };

        if (req.file) {
            updatedData.image = await upload.uploadToCloudinary(req.file.buffer, req.file.mimetype);
        } else if (req.body.imageUrl) {
            updatedData.image = req.body.imageUrl;
        } else if (req.body.image) {
            updatedData.image = req.body.image;
        }

        const production = await Production.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!production) return res.status(404).json({ message: "Production not found" });
        res.json(production);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. DELETE a production
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
