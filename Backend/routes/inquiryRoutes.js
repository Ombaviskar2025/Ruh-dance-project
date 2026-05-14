const express = require('express');
const router = express.Router();
// IMPORTANT: Ensure the names in { } match exactly what you exported in inquiryController.js
const { getInquiries, createInquiry } = require('../controllers/inquiryController');

router.route('/')
    .get(getInquiries) // This was likely causing the crash on line 6
    .post(createInquiry);

module.exports = router;