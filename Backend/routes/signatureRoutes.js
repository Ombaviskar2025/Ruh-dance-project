const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { getSignatures, createSignature, updateSignature, deleteSignature } = require('../controllers/signatureController');

router.route('/')
    .get(getSignatures)
    .post(upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 }
    ]), createSignature);

router.route('/:id')
    .put(upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 }
    ]), updateSignature)
    .delete(deleteSignature);

module.exports = router;
