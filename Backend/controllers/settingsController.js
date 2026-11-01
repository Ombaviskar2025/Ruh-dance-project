const Settings = require('../models/Settings');
const upload = require('../middleware/multer');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (req.file) {
      // Upload video/image to Cloudinary
      settings.homeVideoUrl = await upload.uploadToCloudinary(req.file.buffer, req.file.mimetype);
    } else if (req.body.homeVideoUrl) {
      settings.homeVideoUrl = req.body.homeVideoUrl;
    }

    if (req.body.theme) {
      let themeObj = req.body.theme;
      if (typeof themeObj === 'string') {
        try {
          themeObj = JSON.parse(themeObj);
        } catch (e) {
          console.error('Theme JSON parsing failed', e);
        }
      }

      const themeColors = settings.theme ? settings.theme.toObject() : {};
      const mergedTheme = { ...themeColors, ...themeObj };

      if (!settings.theme) {
        settings.theme = {};
      }
      Object.keys(mergedTheme).forEach(key => {
        settings.theme[key] = mergedTheme[key];
      });

      settings.markModified('theme');
    }

    if (req.body.savedThemes !== undefined) {
      let savedThemesArr = req.body.savedThemes;
      if (typeof savedThemesArr === 'string') {
        try {
          savedThemesArr = JSON.parse(savedThemesArr);
        } catch (e) {
          console.error('Saved Themes JSON parsing failed', e);
        }
      }
      if (Array.isArray(savedThemesArr)) {
        settings.savedThemes = savedThemesArr;
        settings.markModified('savedThemes');
      }
    }

    if (req.body.previousTheme !== undefined) {
      let prevObj = req.body.previousTheme;
      if (typeof prevObj === 'string') {
        try {
          prevObj = JSON.parse(prevObj);
        } catch (e) {
          console.error('Previous Theme JSON parsing failed', e);
        }
      }
      if (prevObj && typeof prevObj === 'object') {
        settings.previousTheme = prevObj;
        settings.markModified('previousTheme');
      }
    }

    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
