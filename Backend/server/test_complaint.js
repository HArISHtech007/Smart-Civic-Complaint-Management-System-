const mongoose = require('mongoose');

// Mock Mongoose connect
mongoose.connect = async () => {
  console.log('\n[Mock] Mongoose database connection established.');
  return { connection: { host: 'mock-mongodb' } };
};

const request = require('supertest');
const app = require('./app');
const User = require('./models/userModel');
const Complaint = require('./models/complaintModel');

// In-memory data store
const CITIZEN1_ID = '60d5ec38f1b29c3d98a28e81';
const CITIZEN2_ID = '60d5ec38f1b29c3d98a28e82';
const OFFICER1_ID = '60d5ec38f1b29c3d98a28e83';
const ADMIN1_ID = '60d5ec38f1b29c3d98a28e84';
const HEAD_OFFICER1_ID = '60d5ec38f1b29c3d98a28e85';

const mockUsers = [
  {
    _id: CITIZEN1_ID,
    name: 'John Citizen',
    email: 'citizen1@example.com',
    phone: '1234567890',
    password: 'password123',
    role: 'Citizen',
    createdAt: new Date(),
  },
  {
    _id: CITIZEN2_ID,
    name: 'Jane Citizen',
    email: 'citizen2@example.com',
    phone: '0987654321',
    password: 'password123',
    role: 'Citizen',
    createdAt: new Date(),
  },
  {
    _id: OFFICER1_ID,
    name: 'Officer Bob',
    email: 'officer1@example.com',
    phone: '5555555555',
    password: 'password123',
    role: 'Officer',
    department: 'Sanitation',
    createdAt: new Date(),
  },
  {
    _id: ADMIN1_ID,
    name: 'Admin Boss',
    email: 'admin@example.com',
    phone: '9999999999',
    password: 'password123',
    role: 'Admin',
    createdAt: new Date(),
  },
  {
    _id: HEAD_OFFICER1_ID,
    name: 'Carol Head',
    email: 'carol@example.com',
    phone: '9876543212',
    password: 'password123',
    role: 'HeadOfficer',
    department: 'Sanitation',
    createdAt: new Date(),
  }
];

const mockComplaints = [];

// Helper to find and mock population
const populateDoc = (doc) => {
  if (!doc) return null;
  const populated = { ...doc };
  
  if (doc.citizen && typeof doc.citizen === 'string') {
    const user = mockUsers.find(u => u._id === doc.citizen);
    populated.citizen = user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } : doc.citizen;
  }
  
  if (doc.assignedOfficer && typeof doc.assignedOfficer === 'string') {
    const user = mockUsers.find(u => u._id === doc.assignedOfficer);
    populated.assignedOfficer = user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, department: user.department } : doc.assignedOfficer;
  }
  
  return populated;
};

// Mock User methods
User.findOne = (query) => {
  return {
    select: function() { return this; },
    then: function(resolve) {
      const email = query.email || (query.$or && query.$or[0] && query.$or[0].email);
      const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!found) return resolve(null);
      
      const userDoc = {
        ...found,
        matchPassword: async function(enteredPassword) {
          return enteredPassword === found.password;
        }
      };
      resolve(userDoc);
    }
  };
};

User.findById = async (id) => {
  const found = mockUsers.find(u => u._id === id.toString());
  return found || null;
};

// Mock Complaint methods
Complaint.create = async (complaintData) => {
  const newComplaint = {
    _id: 'mock-complaint-' + Math.random().toString(36).substr(2, 9),
    ...complaintData,
    priority: complaintData.priority || 'Medium',
    status: complaintData.status || 'Pending',
    latitude: complaintData.latitude || null,
    longitude: complaintData.longitude || null,
    address: complaintData.address || '',
    beforeImage: complaintData.beforeImage || '',
    afterImage: complaintData.afterImage || '',
    aiPrediction: complaintData.aiPrediction || {},
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockComplaints.push(newComplaint);
  return populateDoc(newComplaint);
};

Complaint.find = (filter) => {
  let skipVal = 0;
  let limitVal = null;

  const chain = {
    populate: function() { return this; },
    sort: function() { return this; },
    skip: function(val) {
      skipVal = val;
      return this;
    },
    limit: function(val) {
      limitVal = val;
      return this;
    },
    then: function(resolve) {
      let filtered = [...mockComplaints];
      if (filter.citizen) {
        filtered = filtered.filter(c => c.citizen === filter.citizen.toString());
      }
      if (filter.status) {
        filtered = filtered.filter(c => c.status === filter.status);
      }
      if (filter.department) {
        filtered = filtered.filter(c => c.department === filter.department);
      }
      if (filter.priority) {
        filtered = filtered.filter(c => c.priority === filter.priority);
      }
      if (filter.assignedOfficer) {
        filtered = filtered.filter(c => c.assignedOfficer === filter.assignedOfficer.toString());
      }

      let paginated = filtered;
      if (skipVal) {
        paginated = paginated.slice(skipVal);
      }
      if (limitVal !== null) {
        paginated = paginated.slice(0, limitVal);
      }

      resolve(paginated.map(populateDoc));
    }
  };
  return chain;
};

Complaint.countDocuments = async (filter = {}) => {
  let filtered = [...mockComplaints];
  if (filter.citizen) {
    filtered = filtered.filter(c => c.citizen === filter.citizen.toString());
  }
  if (filter.status) {
    filtered = filtered.filter(c => c.status === filter.status);
  }
  if (filter.department) {
    filtered = filtered.filter(c => c.department === filter.department);
  }
  if (filter.priority) {
    filtered = filtered.filter(c => c.priority === filter.priority);
  }
  if (filter.assignedOfficer) {
    filtered = filtered.filter(c => c.assignedOfficer === filter.assignedOfficer.toString());
  }
  return filtered.length;
};

Complaint.findById = (id) => {
  const chain = {
    populate: function() { return this; },
    then: function(resolve) {
      const found = mockComplaints.find(c => c._id === id.toString());
      resolve(found ? populateDoc(found) : null);
    }
  };
  return chain;
};

Complaint.findByIdAndUpdate = (id, update, options) => {
  const chain = {
    populate: function() { return this; },
    then: function(resolve) {
      const idx = mockComplaints.findIndex(c => c._id === id.toString());
      if (idx === -1) return resolve(null);
      
      const updatedFields = update.$set || update;
      mockComplaints[idx] = {
        ...mockComplaints[idx],
        ...updatedFields,
        updatedAt: new Date()
      };
      
      resolve(populateDoc(mockComplaints[idx]));
    }
  };
  return chain;
};

Complaint.findByIdAndDelete = async (id) => {
  const idx = mockComplaints.findIndex(c => c._id === id.toString());
  if (idx === -1) return null;
  const deleted = mockComplaints.splice(idx, 1);
  return deleted[0];
};

// Test Runner
const runTests = async () => {
  console.log('--- Starting Complaint API Test Suite ---');
  let exitCode = 0;

  try {
    // ----------------------------------------------------
    // Auth Helpers: Generate tokens/cookies by logging in
    // ----------------------------------------------------
    console.log('\n[Prep] Authenticating users...');
    
    // Helper to log in a user by mocking auth token
    const loginUser = async (email) => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'password123' });
      
      if (res.status === 200) {
        return res.headers['set-cookie'][0].split(';')[0];
      }
      throw new Error(`Login failed for ${email}`);
    };

    const citizen1Cookie = await loginUser('citizen1@example.com');
    const citizen2Cookie = await loginUser('citizen2@example.com');
    const officerCookie = await loginUser('officer1@example.com');
    const adminCookie = await loginUser('admin@example.com');
    const carolCookie = await loginUser('carol@example.com');

    console.log('🔑 Authentication successful. Cookies obtained.');

    // ----------------------------------------------------
    // Test 1: Create Complaint (Citizen - Success)
    // ----------------------------------------------------
    console.log('\nTest 1: POST /api/complaints (Citizen Success)');
    const resCreate = await request(app)
      .post('/api/complaints')
      .set('Cookie', citizen1Cookie)
      .send({
        title: 'Broken street light',
        description: 'The street light on 5th Avenue is completely broken and it is pitch dark at night.',
        department: 'Electricity',
        latitude: 40.7128,
        longitude: -74.0060,
        address: '5th Ave, NY'
      });

    let complaintId = '';
    if (resCreate.status === 201 && resCreate.body.success) {
      complaintId = resCreate.body.data._id;
      console.log('✅ Complaint creation test passed. ID:', complaintId);
      console.log('🤖 AI Prediction output:', resCreate.body.data.aiPrediction);
    } else {
      console.error('❌ Complaint creation test failed:', resCreate.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 2: Create Complaint (Validation Fail)
    // ----------------------------------------------------
    console.log('\nTest 2: POST /api/complaints (Validation Fail)');
    const resCreateFail = await request(app)
      .post('/api/complaints')
      .set('Cookie', citizen1Cookie)
      .send({
        title: '', // Empty title
        description: 'Some desc',
        department: 'Water'
      });

    if (resCreateFail.status === 400 && resCreateFail.body.success === false) {
      console.log('✅ Validation validation failed block passed:', resCreateFail.body.errors);
    } else {
      console.error('❌ Validation check failed:', resCreateFail.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 3: Citizen views own complaints
    // ----------------------------------------------------
    console.log('\nTest 3: GET /api/complaints (Citizen views own)');
    const resGetCitizen1 = await request(app)
      .get('/api/complaints')
      .set('Cookie', citizen1Cookie);

    if (resGetCitizen1.status === 200 && resGetCitizen1.body.data.length === 1) {
      console.log('✅ Citizen 1 own complaints list retrieval passed.');
    } else {
      console.error('❌ Citizen 1 own complaints list retrieval failed:', resGetCitizen1.body);
      exitCode = 1;
    }

    // Citizen 2 has no complaints
    const resGetCitizen2 = await request(app)
      .get('/api/complaints')
      .set('Cookie', citizen2Cookie);

    if (resGetCitizen2.status === 200 && resGetCitizen2.body.data.length === 0) {
      console.log('✅ Citizen 2 owns no complaints, list empty (correct).');
    } else {
      console.error('❌ Citizen 2 complaints isolation check failed:', resGetCitizen2.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 4: Officer views assigned complaints (Bob sees assigned - empty at first)
    // ----------------------------------------------------
    console.log('\nTest 4: GET /api/complaints (Officer views assigned - empty)');
    const resGetOfficer = await request(app)
      .get('/api/complaints')
      .set('Cookie', officerCookie);

    if (resGetOfficer.status === 200 && resGetOfficer.body.data.length === 0) {
      console.log('✅ Officer assigned list is empty initially (correct).');
    } else {
      console.error('❌ Officer assigned list checks failed:', resGetOfficer.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 5: Citizen attempts to view someone else's complaint (Forbidden)
    // ----------------------------------------------------
    console.log('\nTest 5: GET /api/complaints/:id (Citizen 2 views Citizen 1\'s complaint - Forbidden)');
    const resGetOther = await request(app)
      .get(`/api/complaints/${complaintId}`)
      .set('Cookie', citizen2Cookie);

    if (resGetOther.status === 403) {
      console.log('✅ Citizen cross-access prevention check passed:', resGetOther.body.message);
    } else {
      console.error('❌ Citizen cross-access prevention check failed:', resGetOther.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 6: Citizen updates Pending complaint
    // ----------------------------------------------------
    console.log('\nTest 6: PUT /api/complaints/:id (Citizen updates Pending)');
    const resUpdateCitizen = await request(app)
      .put(`/api/complaints/${complaintId}`)
      .set('Cookie', citizen1Cookie)
      .send({
        title: 'Broken street light - UPDATED',
        description: 'New details added'
      });

    if (resUpdateCitizen.status === 200 && resUpdateCitizen.body.data.title.includes('UPDATED')) {
      console.log('✅ Citizen update of Pending complaint passed.');
    } else {
      console.error('❌ Citizen update of Pending complaint failed:', resUpdateCitizen.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 7: HeadOfficer Carol assigns the complaint to Bob
    // ----------------------------------------------------
    console.log('\nTest 7: PUT /api/complaints/:id (HeadOfficer Carol assigns to Bob)');
    const resAssign = await request(app)
      .put(`/api/complaints/${complaintId}`)
      .set('Cookie', carolCookie)
      .send({
        status: 'Assigned',
        assignedOfficer: OFFICER1_ID,
        priority: 'High'
      });

    if (resAssign.status === 200 && resAssign.body.data.status === 'Assigned' && resAssign.body.data.assignedOfficer._id === OFFICER1_ID) {
      console.log('✅ HeadOfficer assignment test passed.');
    } else {
      console.error('❌ HeadOfficer assignment test failed:', resAssign.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 7b: Officer Bob now views assigned complaints
    // ----------------------------------------------------
    console.log('\nTest 7b: GET /api/complaints (Officer Bob sees assigned complaint)');
    const resGetBobAssigned = await request(app)
      .get('/api/complaints')
      .set('Cookie', officerCookie);

    if (resGetBobAssigned.status === 200 && resGetBobAssigned.body.data.length === 1) {
      console.log('✅ Officer Bob successfully retrieved his assigned complaint.');
    } else {
      console.error('❌ Officer Bob assigned complaint retrieval failed:', resGetBobAssigned.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 7c: Officer Bob accepts and marks In Progress
    // ----------------------------------------------------
    console.log('\nTest 7c: PUT /api/complaints/:id (Officer Bob accepts and starts work)');
    const resAccept = await request(app)
      .put(`/api/complaints/${complaintId}`)
      .set('Cookie', officerCookie)
      .send({ status: 'Accepted' });

    const resInProgress = await request(app)
      .put(`/api/complaints/${complaintId}`)
      .set('Cookie', officerCookie)
      .send({ status: 'In Progress' });

    if (resInProgress.status === 200 && resInProgress.body.data.status === 'In Progress') {
      console.log('✅ Officer acceptance and In Progress status flow passed.');
    } else {
      console.error('❌ Officer workflow updates failed:', resInProgress.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 8: Citizen attempts to update/delete processed complaint (Fail)
    // ----------------------------------------------------
    console.log('\nTest 8: PUT & DELETE /api/complaints/:id (Citizen attempts update on In Progress)');
    const resUpdateInProgress = await request(app)
      .put(`/api/complaints/${complaintId}`)
      .set('Cookie', citizen1Cookie)
      .send({
        title: 'Sneaky edit attempt'
      });

    if (resUpdateInProgress.status === 400 || resUpdateInProgress.status === 403) {
      console.log('✅ Edit block for processed complaints passed:', resUpdateInProgress.body.message);
    } else {
      console.error('❌ Edit block for processed complaints failed:', resUpdateInProgress.body);
      exitCode = 1;
    }

    const resDeleteInProgress = await request(app)
      .delete(`/api/complaints/${complaintId}`)
      .set('Cookie', citizen1Cookie);

    if (resDeleteInProgress.status === 403) {
      console.log('✅ Delete block for non-admin citizens passed:', resDeleteInProgress.body.message);
    } else {
      console.error('❌ Delete block for non-admin citizens failed:', resDeleteInProgress.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 9: Officer completes complaint
    // ----------------------------------------------------
    console.log('\nTest 9: PUT /api/complaints/:id (Officer completes complaint)');
    const resComplete = await request(app)
      .put(`/api/complaints/${complaintId}`)
      .set('Cookie', officerCookie)
      .send({
        status: 'Completed'
      });

    if (resComplete.status === 200 && resComplete.body.data.status === 'Completed' && resComplete.body.data.completedAt) {
      console.log('✅ Officer completed complaint test passed. CompletedAt set:', resComplete.body.data.completedAt);
    } else {
      console.error('❌ Officer completed complaint test failed:', resComplete.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 10: Admin deletes complaint
    // ----------------------------------------------------
    console.log('\nTest 10: DELETE /api/complaints/:id (Admin delete)');
    const resDelete = await request(app)
      .delete(`/api/complaints/${complaintId}`)
      .set('Cookie', adminCookie);

    if (resDelete.status === 200 && resDelete.body.success) {
      console.log('✅ Admin delete complaint test passed.');
    } else {
      console.error('❌ Admin delete complaint test failed:', resDelete.body);
      exitCode = 1;
    }

  } catch (error) {
    console.error('Unexpected error during tests:', error);
    exitCode = 1;
  }

  console.log('\n--- Test Suite Summary ---');
  if (exitCode === 0) {
    console.log('🎉 ALL COMPLAINT TESTS PASSED SUCCESSFULLY! Complaint Management is production-ready.');
  } else {
    console.error('🚨 SOME TESTS FAILED. Please review the errors above.');
  }
  process.exit(exitCode);
};

runTests();
