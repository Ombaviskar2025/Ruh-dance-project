const https = require('https');

https.get('https://ruh-dance-project.onrender.com/api/settings', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      console.log("Success! Data received:");
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log("Received raw non-JSON data:", data);
    }
  });
}).on('error', (err) => {
  console.error("Error fetching settings:", err.message);
});
