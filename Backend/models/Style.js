const mongoose = require('mongoose');

const styleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a dance style name"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    category: {
        type: String,
        enum: ['Classical', 'Contemporary', 'Folk', 'Jazz', 'Ballet'],
        required: true
    },
    image: {
        type: String, // You will store the URL of the image here
        default: "no-photo.jpg"
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    videoUrl: { type: String, default: "" } // Add this line

});
const Style = mongoose.model('Style', styleSchema);
module.exports = Style;
