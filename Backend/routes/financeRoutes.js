const express = require('express');
const router = express.Router();
const { 
    getTransactions, 
    recordTransaction, 
    deleteTransaction,
    getFeeRates,
    saveFeeRate,
    deleteFeeRate
} = require('../controllers/financeController');

// Transaction Routes
router.route('/')
    .get(getTransactions)
    .post(recordTransaction);

router.route('/:id')
    .delete(deleteTransaction);

// Fee Structure Routes
router.route('/fee-rates')
    .get(getFeeRates)
    .post(saveFeeRate);

router.route('/fee-rates/:id')
    .delete(deleteFeeRate);

module.exports = router;
