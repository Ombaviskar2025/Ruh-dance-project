const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isFeePayment: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'Cash' }, // e.g., Cash, Online, Bank Transfer
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
