const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { getStyles, createStyle, updateStyle, deleteStyle } = require('../controllers/styleController');

// Mapping routes to controller functions
router.route('/')
    .get(getStyles)
    .post(upload.single('image'), createStyle);
router.route('/:id')
    .put(upload.single('image'), updateStyle)
    .delete(deleteStyle);

module.exports = router;

