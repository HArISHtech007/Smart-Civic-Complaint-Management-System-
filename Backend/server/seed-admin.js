const http = require('http');

const data = JSON.stringify({
  name: 'Admin Dharun',
  email: 'dharun@admin.com',
  phone: '9876543210',
  password: '12345678',
  role: 'Admin'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    try {
      const parsed = JSON.parse(body);
      if (parsed.success || res.statusCode === 201) {
        console.log('\n✓ Admin account created successfully!');
        console.log('  Email: dharun@admin.com');
        console.log('  Password: 12345678');
      } else {
        console.log('\n✗ Failed:', parsed.message || 'Unknown error');
      }
    } catch (e) {
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (e) => {
  if (e.code === 'ECONNREFUSED') {
    console.log('Backend server is not running at http://localhost:5000');
    console.log('Start it first with: npm start or node server.js');
  } else {
    console.log('Error:', e.message);
  }
});

req.write(data);
req.end();