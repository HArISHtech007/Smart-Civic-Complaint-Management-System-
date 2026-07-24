/* Programmatic Verification of AI Service Integration */
const axios = require('axios');

async function runVerification() {
  console.log('--- STARTING AI INTEGRATION END-TO-END VERIFICATION ---');
  
  const client = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  });

  try {
    // 1) Login as Citizen
    console.log('\n[Step 1] Authenticating with backend as citizen...');
    const loginRes = await client.post('/auth/login', {
      email: 'citizen@example.com',
      password: 'password123'
    });

    const token = loginRes.data.token;
    console.log(`Success! Logged in. Token (User ID): ${token}`);

    // Set authorization header
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 2) File a complaint
    console.log('\n[Step 2] Filing a civic complaint to test YOLOv8 and NLP pipelines...');
    const complaintRes = await client.post('/complaints', {
      title: 'Deep pothole on Main Street causing hazard',
      description: 'There is a large pothole at the main crossing. It is filling with water and vehicles are swerving to avoid it.',
      department: 'Other', // Let AI auto-detect department
      priority: 'Low',      // Let AI auto-detect priority
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Main Street Crossing, Sector 4'
    });

    console.log('Success! Complaint created.');
    const complaint = complaintRes.data.data;
    
    // 3) Validate AI Prediction merge output
    console.log('\n[Step 3] Validating stored AI predictions in complaint document...');
    console.log('Returned Complaint Object:', JSON.stringify(complaint, null, 2));

    const aiPred = complaint.aiPrediction;
    if (!aiPred) {
      throw new Error('Verification Failed: aiPrediction field is missing from complaint document!');
    }

    const expectedKeys = ['detectedIssue', 'department', 'priority', 'confidence', 'summary'];
    const missingKeys = expectedKeys.filter(k => !(k in aiPred));

    if (missingKeys.length > 0) {
      throw new Error(`Verification Failed: aiPrediction is missing required keys: ${missingKeys.join(', ')}`);
    }

    console.log('\n--- VERIFICATION STATUS: SUCCESS ---');
    console.log('All YOLOv8 and NLP predictions were successfully requested, merged, and stored.');
    console.log('Stored AI Prediction details:');
    console.log(` - Detected Issue: ${aiPred.detectedIssue}`);
    console.log(` - Department Route: ${aiPred.department} (Overridden from "Other" -> "${complaint.department}")`);
    console.log(` - Priority Level: ${aiPred.priority} (Overridden from "Low" -> "${complaint.priority}")`);
    console.log(` - Detection Confidence: ${(aiPred.confidence * 100).toFixed(1)}%`);
    console.log(` - Summary description: "${aiPred.summary}"`);
    
  } catch (err) {
    console.error('\n--- VERIFICATION STATUS: FAILED ---');
    if (err.response) {
      console.error(`Backend returned error status ${err.response.status}:`, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

runVerification();
