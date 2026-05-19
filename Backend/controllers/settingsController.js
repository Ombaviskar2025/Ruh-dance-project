const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Creates default document if none exists
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
      settings.homeVideoUrl = req.file.path;
    } else if (req.body.homeVideoUrl) {
      settings.homeVideoUrl = req.body.homeVideoUrl; // Allow direct URL bypass if we want
    }

    if (req.body.theme) {
      let themeObj = req.body.theme;
      if (typeof themeObj === 'string') {
        try {
          themeObj = JSON.parse(themeObj);
        } catch (e) {
          console.error("Theme JSON parsing failed", e);
        }
      }
      
      // Safety: extract values as standard object to avoid Mongoose subdocument internal spread issues
      const themeColors = settings.theme ? settings.theme.toObject() : {};
      const mergedTheme = { ...themeColors, ...themeObj };
      
      // Explicitly assign each key to Mongoose subdocument to ensure validations and setters fire perfectly
      if (!settings.theme) {
        settings.theme = {};
      }
      Object.keys(mergedTheme).forEach(key => {
        settings.theme[key] = mergedTheme[key];
      });
      
      settings.markModified('theme');
    }

    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
