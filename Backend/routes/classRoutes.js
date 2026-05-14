const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// @route   GET /api/classes
router.get('/', async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: "Server Error: Could not fetch classes" });
    }
});

// @route   POST /api/classes
router.post('/', async (req, res) => {
    try {
        const newClass = new Class(req.body);
        const savedClass = await newClass.save();
        res.status(201).json(savedClass);
    } catch (err) {
        res.status(400).json({ message: "Server Error: Could not save class" });
    }
});

// @route   PUT /api/classes/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedClass);
    } catch (err) {
        res.status(400).json({ message: "Server Error: Could not update class" });
    }
});

// @route   DELETE /api/classes/:id
router.delete('/:id', async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ message: "Class deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: Could not delete class" });
    }
});

module.exports = router;
