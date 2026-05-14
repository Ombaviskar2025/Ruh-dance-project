const express = require('express');
const router = express.Router();
// Assuming your model is named Event and located in your models folder
const Event = require('../models/Event'); 

// @route   GET /api/events
// @desc    Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Server Error: Could not fetch events" });
    }
});

// @route   POST /api/events
// @desc    Create a new event
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: "Server Error: Could not save event" });
    }
});

// @route   PUT /api/events/:id
// @desc    Update an event
router.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: "Server Error: Could not update event" });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: Could not delete event" });
    }
});

module.exports = router;