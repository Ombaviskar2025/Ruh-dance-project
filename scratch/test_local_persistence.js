const mongoose = require('mongoose');
const Settings = require('../Backend/models/Settings');

async function runTest() {
  console.log("Connecting to local MongoDB...");
  try {
    await mongoose.connect('mongodb://localhost:27017/ruh_dance_db');
    console.log("Connected successfully!");

    // Clean up existing settings
    await Settings.deleteMany({});

    console.log("Creating new Settings document...");
    let settings = new Settings();
    await settings.save();
    console.log("Initial settings doc created:", settings);

    console.log("\nSimulating theme update...");
    const themeObj = {
      wine: '#5C0612',
      brandPurple: '#7A1C50',
      brandPink: '#C97A9E',
      darkNavy: '#0F0914',
      deepPurple: '#3B0F2A',
      lightPurple: '#EBCBE3',
      lightGray: '#EAD5E6'
    };

    // Extract values as standard object
    const themeColors = settings.theme ? settings.theme.toObject() : {};
    const mergedTheme = { ...themeColors, ...themeObj };

    if (!settings.theme) {
      settings.theme = {};
    }
    Object.keys(mergedTheme).forEach(key => {
      settings.theme[key] = mergedTheme[key];
    });

    settings.markModified('theme');
    await settings.save();

    console.log("Successfully saved! Retrieving from DB to check persistence...");
    const retrieved = await Settings.findOne();
    console.log("Retrieved document:", JSON.stringify(retrieved, null, 2));

    await mongoose.connection.close();
    console.log("Local test complete!");
  } catch (err) {
    console.error("Local test failed:", err);
  }
}

runTest();
