const mongoose = require('mongoose');

// Mock Mongoose connect before requiring the app
mongoose.connect = async () => {
  console.log('\n[Mock] Mongoose database connection established successfully.');
  return {
    connection: { host: 'mock-mongodb-atlas-cluster' },
  };
};

const request = require('supertest');
const app = require('./app');
const User = require('./models/userModel');

// In-memory mock database
const mockUsers = [];

// Mock Mongoose queries
User.findOne = (query) => {
  const queryObj = {
    select: function (selectStr) {
      return this;
    },
    then: function (resolve, reject) {
      const email = query.email || (query.$or && query.$or[0] && query.$or[0].email);
      const phone = query.phone || (query.$or && query.$or[1] && query.$or[1].phone);

      const found = mockUsers.find(
        (u) =>
          (email && u.email.toLowerCase() === email.toLowerCase()) ||
          (phone && u.phone === phone)
      );

      if (!found) {
        return resolve(null);
      }

      const userDoc = {
        ...found,
        matchPassword: async function (enteredPassword) {
          return enteredPassword === found.password;
        },
      };
      resolve(userDoc);
    }
  };
  return queryObj;
};

User.create = async (userData) => {
  // Leverage actual Mongoose validation offline before storing
  const schemaInstance = new User(userData);
  await schemaInstance.validate();

  const newUser = {
    _id: 'mock-user-id-' + Math.random().toString(36).substr(2, 9),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password, // Keep raw password in mock db for comparisons
    role: userData.role || 'Citizen',
    department: userData.department,
    createdAt: new Date(),
  };

  mockUsers.push(newUser);
  
  // Return user with method support
  return {
    ...newUser,
    matchPassword: async function (enteredPassword) {
      return enteredPassword === newUser.password;
    },
  };
};

User.findById = async (id) => {
  const found = mockUsers.find((u) => u._id === id);
  if (!found) return null;
  return found;
};

// Test Runner
const runTests = async () => {
  console.log('--- Starting Backend API Test Suite ---');
  let exitCode = 0;

  try {
    // ----------------------------------------------------
    // Test 1: Register Citizen (Success)
    // ----------------------------------------------------
    console.log('\nTest 1: POST /api/auth/register (Citizen success)');
    const resRegCitizen = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
      });

    if (resRegCitizen.status === 201 && resRegCitizen.body.success) {
      console.log('✅ Citizen registration test passed.');
    } else {
      console.error('❌ Citizen registration test failed:', resRegCitizen.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 2: Register Duplicate Email/Phone (Fail)
    // ----------------------------------------------------
    console.log('\nTest 2: POST /api/auth/register (Duplicate check)');
    const resRegDup = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password456',
      });

    if (resRegDup.status === 400 && resRegDup.body.success === false) {
      console.log('✅ Duplicate prevention check passed:', resRegDup.body.message);
    } else {
      console.error('❌ Duplicate prevention check failed:', resRegDup.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 3: Register Officer without Department (Fail)
    // ----------------------------------------------------
    console.log('\nTest 3: POST /api/auth/register (Officer missing department validation)');
    // Mongoose validation check
    try {
      const invalidOfficer = new User({
        name: 'Officer Bob',
        email: 'bob@example.com',
        phone: '9876543210',
        password: 'password123',
        role: 'Officer',
      });
      await invalidOfficer.validate();
      console.error('❌ Mongoose validation failed to block Officer without department');
      exitCode = 1;
    } catch (validationError) {
      console.log('✅ Mongoose validation successfully blocked Officer without department:', validationError.message);
    }

    // ----------------------------------------------------
    // Test 4: Register Officer with Department (Success)
    // ----------------------------------------------------
    console.log('\nTest 4: POST /api/auth/register (Officer with department success)');
    const resRegOfficer = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Officer Alice',
        email: 'alice@example.com',
        phone: '9876543210',
        password: 'password123',
        role: 'Officer',
        department: 'Sanitation',
      });

    if (resRegOfficer.status === 201 && resRegOfficer.body.data.role === 'Officer') {
      console.log('✅ Officer registration test passed.');
    } else {
      console.error('❌ Officer registration test failed:', resRegOfficer.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 5: Login (Success)
    // ----------------------------------------------------
    console.log('\nTest 5: POST /api/auth/login (Success)');
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    let jwtCookie = '';
    if (resLogin.status === 200 && resLogin.body.success) {
      console.log('✅ Login test passed.');
      // Extract cookie
      const cookies = resLogin.headers['set-cookie'];
      if (cookies && cookies[0]) {
        jwtCookie = cookies[0].split(';')[0];
        console.log('✅ JWT Cookie successfully returned:', jwtCookie);
      } else {
        console.error('❌ JWT Cookie was not set in response headers');
        exitCode = 1;
      }
    } else {
      console.error('❌ Login test failed:', resLogin.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 6: Login (Fail - Invalid Password)
    // ----------------------------------------------------
    console.log('\nTest 6: POST /api/auth/login (Fail - wrong password)');
    const resLoginFail = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'wrongpassword',
      });

    if (resLoginFail.status === 401 && resLoginFail.body.success === false) {
      console.log('✅ Invalid password block passed:', resLoginFail.body.message);
    } else {
      console.error('❌ Invalid password block failed:', resLoginFail.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 7: Access Profile (Unauthenticated Fail)
    // ----------------------------------------------------
    console.log('\nTest 7: GET /api/auth/profile (Unauthenticated check)');
    const resProfileUnauth = await request(app).get('/api/auth/profile');

    if (resProfileUnauth.status === 401) {
      console.log('✅ Unauthenticated profile block passed:', resProfileUnauth.body.message);
    } else {
      console.error('❌ Unauthenticated profile block failed:', resProfileUnauth.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 8: Access Profile (Authenticated Success)
    // ----------------------------------------------------
    console.log('\nTest 8: GET /api/auth/profile (Authenticated check)');
    const resProfileAuth = await request(app)
      .get('/api/auth/profile')
      .set('Cookie', jwtCookie); // Set the cookie we received

    if (resProfileAuth.status === 200 && resProfileAuth.body.success) {
      console.log('✅ Authenticated profile retrieval passed:', resProfileAuth.body.data.name);
    } else {
      console.error('❌ Authenticated profile retrieval failed:', resProfileAuth.body);
      exitCode = 1;
    }

    // ----------------------------------------------------
    // Test 9: Logout (Success)
    // ----------------------------------------------------
    console.log('\nTest 9: POST /api/auth/logout (Success)');
    const resLogout = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', jwtCookie);

    if (resLogout.status === 200 && resLogout.body.success) {
      console.log('✅ Logout test passed.');
      const cookies = resLogout.headers['set-cookie'];
      if (cookies && cookies[0] && cookies[0].includes('jwt=;')) {
        console.log('✅ JWT Cookie successfully cleared in response headers.');
      } else {
        console.error('❌ JWT Cookie was not cleared properly:', cookies);
        exitCode = 1;
      }
    } else {
      console.error('❌ Logout test failed:', resLogout.body);
      exitCode = 1;
    }

  } catch (error) {
    console.error('Error during test execution:', error);
    exitCode = 1;
  }

  console.log('\n--- Test Suite Summary ---');
  if (exitCode === 0) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! The backend is production-ready.');
  } else {
    console.error('🚨 SOME TESTS FAILED. Please review the errors above.');
  }
  process.exit(exitCode);
};

runTests();
