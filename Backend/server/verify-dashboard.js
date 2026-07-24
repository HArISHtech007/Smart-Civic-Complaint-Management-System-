/* Programmatic Verification of Dashboard Analytics & Notifications */
const axios = require('axios');

async function runDashboardVerification() {
  console.log('--- STARTING DASHBOARD & NOTIFICATIONS BACKEND VERIFICATION ---');
  
  const client = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  });

  try {
    // =====================================
    // 1) Test Citizen Dash & Notifications
    // =====================================
    console.log('\n[Step 1] Authenticating as Citizen (citizen@example.com)...');
    const citizenLogin = await client.post('/auth/login', {
      email: 'citizen@example.com',
      password: 'password123'
    });

    const citizenToken = citizenLogin.data.token;
    console.log(`Logged in! Token: ${citizenToken.substring(0, 30)}...`);

    // Set citizen auth headers
    client.defaults.headers.common['Authorization'] = `Bearer ${citizenToken}`;

    console.log('Fetching citizen stats (/api/dashboard/citizen)...');
    const citStatsRes = await client.get('/dashboard/citizen');
    console.log('Citizen stats returned:', JSON.stringify(citStatsRes.data.data));

    console.log('Fetching citizen notifications (/api/notifications)...');
    const citNotifyRes = await client.get('/notifications');
    console.log(`Success! Fetched ${citNotifyRes.data.count} notifications.`);
    if (citNotifyRes.data.data.length > 0) {
      console.log('First Notification sample:', JSON.stringify(citNotifyRes.data.data[0]));
      
      const notifyId = citNotifyRes.data.data[0]._id;
      console.log(`Marking notification (${notifyId}) as read...`);
      const readRes = await client.put(`/notifications/${notifyId}/read`);
      console.log('Notification read updated:', readRes.data.success);
    }

    console.log('Marking all notifications as read...');
    const allReadRes = await client.put('/notifications/mark-all-read');
    console.log('All read success:', allReadRes.data.success);

    // =====================================
    // 2) Test Head Officer Dashboard Stats
    // =====================================
    console.log('\n[Step 2] Authenticating as Head Officer (carol@example.com)...');
    const hoLogin = await client.post('/auth/login', {
      email: 'carol@example.com',
      password: 'password123'
    });

    const hoToken = hoLogin.data.token;
    client.defaults.headers.common['Authorization'] = `Bearer ${hoToken}`;

    console.log('Fetching Head Officer stats (/api/dashboard/headofficer)...');
    const hoStatsRes = await client.get('/dashboard/headofficer');
    console.log('Head Officer Department stats returned:', JSON.stringify(hoStatsRes.data.data));

    // =====================================
    // 3) Test Admin Dashboard Analytics
    // =====================================
    console.log('\n[Step 3] Authenticating as Admin (admin@example.com)...');
    const adminLogin = await client.post('/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });

    const adminToken = adminLogin.data.token;
    client.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;

    console.log('Fetching Admin global stats (/api/dashboard/admin)...');
    const adminStatsRes = await client.get('/dashboard/admin');
    console.log('Admin global analytics returned successfully.');
    const adminData = adminStatsRes.data.data;
    console.log(' - Total Users Count:', JSON.stringify(adminData.users));
    console.log(' - Total Complaints Count:', JSON.stringify(adminData.complaints));
    console.log(' - Completion Rates per Department:', JSON.stringify(adminData.completionRates));

    console.log('\n--- VERIFICATION STATUS: ALL TESTS PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('\n--- VERIFICATION STATUS: FAILED ---');
    if (err.response) {
      console.error(`Backend returned error status ${err.response.status}:`, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

runDashboardVerification();
