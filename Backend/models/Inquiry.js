const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    danceStyle: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ]
    },
    interest: {
        type: String,
        required: true // Removed enum so "sangeet choreo" won't cause a crash
    },
    message: {
        type: String,
        required: [true, "Message cannot be empty"]
    },
    dateReceived: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inquiry', inquirySchema);