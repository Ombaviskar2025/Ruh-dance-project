const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    videoUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Signature', signatureSchema);
