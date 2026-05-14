const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: { type: String, required: true },
    instructorName: { type: String, required: true },
    scheduleTime: { type: String, required: true }, // e.g. "Mon & Wed, 6:00 PM"
    capacity: { type: Number, required: true },
    enrolled: { type: Number, default: 0 }
});

module.exports = mongoose.model('Class', classSchema);
