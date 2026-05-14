const Transaction = require('../models/Transaction');
const FeeRate = require('../models/FeeRate');
const User = require('../models/User');
const { sendPaymentSlip } = require('../utils/emailService');

// @desc    Get all transactions
// @route   GET /api/finance
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({}).populate('studentId', 'fullName email').sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// @desc    Record a new transaction (Generic or Student Fee)
// @route   POST /api/finance
exports.recordTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, studentId, paymentMethod, isFeePayment, sendEmail } = req.body;
        
        const newTransaction = new Transaction({
            type,
            amount: Number(amount),
            category,
            description,
            studentId: studentId || null,
            isFeePayment: !!isFeePayment,
            paymentMethod: paymentMethod || 'Cash'
        });

        const savedTransaction = await newTransaction.save();

        // If it's a student fee and sendEmail is true, trigger email service
        if (isFeePayment && studentId && sendEmail) {
            const student = await User.findById(studentId);
            if (student) {
                await sendPaymentSlip(student, savedTransaction);
            }
        }

        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: "Could not save transaction", error: err.message });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/finance/:id
exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};

// --- FEE RATES LOGIC ---

// @desc    Get all fee rates
// @route   GET /api/finance/fee-rates
exports.getFeeRates = async (req, res) => {
    try {
        const rates = await FeeRate.find({}).sort({ category: 1 });
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch fee rates" });
    }
};

// @desc    Update or create a fee rate
// @route   POST /api/finance/fee-rates
exports.saveFeeRate = async (req, res) => {
    try {
        const { id, category, amount, duration } = req.body;
        let rate;
        if (id) {
            rate = await FeeRate.findByIdAndUpdate(id, { category, amount, duration }, { new: true });
        } else {
            rate = await FeeRate.create({ category, amount, duration });
        }
        res.status(200).json(rate);
    } catch (err) {
        res.status(400).json({ message: "Failed to save fee rate", error: err.message });
    }
};

// @desc    Delete a fee rate
// @route   DELETE /api/finance/fee-rates/:id
exports.deleteFeeRate = async (req, res) => {
    try {
        await FeeRate.findByIdAndDelete(req.params.id);
        res.json({ message: "Fee rate deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};
