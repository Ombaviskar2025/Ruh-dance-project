const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { getGurus, createGuru, updateGuru, deleteGuru } = require('../controllers/guruController');

// Mapping routes to controller functions
router.route('/')
    .get(getGurus)
    .post(upload.single('image'), createGuru);

router.route('/:id')
    .put(upload.single('image'), updateGuru)
    .delete(deleteGuru);

module.exports = router;
