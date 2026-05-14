const mongoose = require('mongoose');

const feeRateSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    amount: { 
        type: Number, 
        required: true 
    },
    duration: { 
        type: String, 
        default: 'Monthly' // e.g., Monthly, Quarterly, One-time
    }
}, { timestamps: true });

module.exports = mongoose.model('FeeRate', feeRateSchema);
