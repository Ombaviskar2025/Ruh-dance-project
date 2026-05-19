const axios = require('axios');

async function test() {
  console.log("Fetching settings from live Render server...");
  try {
    const res = await axios.get('https://ruh-dance-project.onrender.com/api/settings', { timeout: 15000 });
    console.log("Success! Data received:");
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error fetching settings:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}

test();
