/* Backend Express Server with Mock Mongoose DB (Runs on port 5000) */
const mongoose = require('mongoose');

// 1) Mock Mongoose connection
mongoose.connect = async () => {
  console.log('\n[Mock Database] In-memory Mongoose connection established.');
  return { connection: { host: 'mock-mongodb-in-memory' } };
};

const User = require('./models/userModel');
const Complaint = require('./models/complaintModel');

// Shared in-memory data store
const mockUsers = [
  {
    _id: '65fb7bb360d8e20f381e5b81',
    name: 'John Citizen',
    email: 'citizen@example.com',
    phone: '1234567890',
    password: 'password123',
    role: 'Citizen',
    createdAt: new Date(),
  },
  {
    _id: '65fb7bb360d8e20f381e5b82',
    name: 'Officer Bob',
    email: 'officer@example.com',
    phone: '5555555555',
    password: 'password123',
    role: 'Officer',
    department: 'Sanitation',
    createdAt: new Date(),
  },
  {
    _id: '65fb7bb360d8e20f381e5b83',
    name: 'Admin Boss',
    email: 'admin@example.com',
    phone: '9999999999',
    password: 'password123',
    role: 'Admin',
    createdAt: new Date(),
  }
];

const mockComplaints = [];

const populateDoc = (doc) => {
  if (!doc) return null;
  const populated = { ...doc };
  
  if (doc.citizen) {
    const userId = typeof doc.citizen === 'object' ? doc.citizen._id : doc.citizen;
    const user = mockUsers.find(u => u._id === userId.toString());
    populated.citizen = user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } : doc.citizen;
  }
  
  if (doc.assignedOfficer) {
    const officerId = typeof doc.assignedOfficer === 'object' ? doc.assignedOfficer._id : doc.assignedOfficer;
    const user = mockUsers.find(u => u._id === officerId.toString());
    populated.assignedOfficer = user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, department: user.department } : doc.assignedOfficer;
  }
  
  return populated;
};

// 2) Mock User Model Methods
User.findOne = (query) => {
  return {
    select: function() { return this; },
    then: function(resolve) {
      const email = query.email || (query.$or && query.$or[0] && query.$or[0].email);
      const phone = query.phone || (query.$or && query.$or[1] && query.$or[1].phone);
      
      const found = mockUsers.find(u => 
        (email && u.email.toLowerCase() === email.toLowerCase()) ||
        (phone && u.phone === phone)
      );

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

User.create = async (userData) => {
  const newUser = {
    _id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
    ...userData,
    createdAt: new Date()
  };
  mockUsers.push(newUser);
  return newUser;
};

// 3) Mock Complaint Model Methods
Complaint.create = async (complaintData) => {
  const newComplaint = {
    _id: 'mock-comp-' + Math.random().toString(36).substr(2, 9),
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
    updatedAt: new Date()
  };
  mockComplaints.push(newComplaint);
  return populateDoc(newComplaint);
};

Complaint.find = (filter) => {
  const chain = {
    results: [],
    populate: function() { return this; },
    sort: function() { return this; },
    then: function(resolve) {
      let filtered = [...mockComplaints];
      
      if (filter.citizen) {
        filtered = filtered.filter(c => {
          const citizenId = typeof c.citizen === 'object' ? c.citizen._id : c.citizen;
          return citizenId.toString() === filter.citizen.toString();
        });
      }
      
      if (filter.assignedOfficer) {
        filtered = filtered.filter(c => {
          const officerId = typeof c.assignedOfficer === 'object' ? c.assignedOfficer._id : c.assignedOfficer;
          return officerId && officerId.toString() === filter.assignedOfficer.toString();
        });
      }

      if (filter.status) {
        filtered = filtered.filter(c => c.status === filter.status);
      }

      if (filter.department) {
        filtered = filtered.filter(c => c.department === filter.department);
      }

      resolve(filtered.map(populateDoc));
    }
  };
  return chain;
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

Complaint.findByIdAndUpdate = (id, updateObj, options) => {
  const chain = {
    populate: function() { return this; },
    then: function(resolve) {
      const idx = mockComplaints.findIndex(c => c._id === id.toString());
      if (idx === -1) return resolve(null);
      
      const original = mockComplaints[idx];
      const updates = updateObj.$set || updateObj;
      
      const updated = {
        ...original,
        ...updates,
        updatedAt: new Date()
      };

      if (updates.assignedOfficer) {
        const officer = mockUsers.find(u => u._id === updates.assignedOfficer.toString());
        if (officer) {
          updated.assignedOfficer = officer;
          updated.status = 'Assigned';
        }
      }

      mockComplaints[idx] = updated;
      resolve(populateDoc(updated));
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

// 4) Load Express App and start server
const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Mock Server] Express backend listening on http://localhost:${PORT}`);
  console.log(`[Mock Server] Active Environment: ${process.env.NODE_ENV}`);
});
