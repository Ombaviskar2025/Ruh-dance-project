const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.route('/')
  .get(getSettings)
  .post(upload.single('homeVideoUrl'), updateSettings);

module.exports = router;
