const https = require('https');

const postData = JSON.stringify({
  theme: {
    wine: '#5C0612',
    brandPurple: '#7A1C50',
    brandPink: '#C97A9E',
    darkNavy: '#0F0914',
    deepPurple: '#3B0F2A',
    lightPurple: '#EBCBE3',
    lightGray: '#EAD5E6'
  }
});

const options = {
  hostname: 'ruh-dance-project.onrender.com',
  port: 443,
  path: '/api/settings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Response status:", res.statusCode);
    try {
      console.log("Response data:", JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log("Raw response:", data);
    }
    
    // Now let's fetch it again to make sure it persisted!
    setTimeout(() => {
      https.get('https://ruh-dance-project.onrender.com/api/settings', (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => { data2 += chunk; });
        res2.on('end', () => {
          console.log("\n--- Verification Fetch ---");
          try {
            console.log(JSON.stringify(JSON.parse(data2), null, 2));
          } catch (e) {
            console.log(data2);
          }
        });
      });
    }, 2000);
  });
});

req.on('error', (err) => {
  console.error("POST request failed:", err.message);
});

req.write(postData);
req.end();
