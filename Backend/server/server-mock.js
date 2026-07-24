/* Backend Express Server with Mock Mongoose DB (Runs on port 5000) */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

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
  },
  {
    _id: '65fb7bb360d8e20f381e5b85',
    name: 'Carol Head',
    email: 'carol@example.com',
    phone: '9876543212',
    password: 'password123',
    role: 'HeadOfficer',
    department: 'Sanitation',
    createdAt: new Date(),
  },
  {
    _id: '65fb7bb360d8e20f381e5b89',
    name: 'Dharun',
    email: 'dharun6@civic.com',
    phone: '9876543299',
    password: '12345678',
    role: 'Citizen',
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

      // Handle text search filter
      if (filter.$text && filter.$text.$search) {
        const term = filter.$text.$search.toLowerCase();
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(term) || 
          c.description.toLowerCase().includes(term)
        );
      }
      
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

      if (filter.priority) {
        filtered = filtered.filter(c => c.priority === filter.priority);
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

// --- MOCK MONGOOSE AGGREGATION PIPELINES ---

User.aggregate = async (pipeline) => {
  const roleGroups = {};
  mockUsers.forEach(u => {
    roleGroups[u.role] = (roleGroups[u.role] || 0) + 1;
  });
  return Object.entries(roleGroups).map(([role, count]) => ({ _id: role, count }));
};

Complaint.aggregate = async (pipeline) => {
  const matchStage = pipeline.find(stage => stage.$match);
  const groupStage = pipeline.find(stage => stage.$group);

  let filtered = [...mockComplaints];

  // Apply match stage
  if (matchStage) {
    const match = matchStage.$match;
    if (match.citizen) {
      filtered = filtered.filter(c => {
        const citizenId = typeof c.citizen === 'object' ? c.citizen._id : c.citizen;
        return citizenId.toString() === match.citizen.toString();
      });
    }
    if (match.assignedOfficer) {
      filtered = filtered.filter(c => {
        const officerId = typeof c.assignedOfficer === 'object' ? c.assignedOfficer?._id : c.assignedOfficer;
        return officerId && officerId.toString() === match.assignedOfficer.toString();
      });
    }
    if (match.department) {
      filtered = filtered.filter(c => c.department === match.department);
    }
  }

  // Apply group stage
  if (groupStage) {
    const group = groupStage.$group;
    const groupField = typeof group._id === 'string' && group._id.startsWith('$') 
      ? group._id.substring(1) 
      : group._id;

    if (groupField === 'status') {
      const statusGroups = {};
      filtered.forEach(c => {
        statusGroups[c.status] = (statusGroups[c.status] || 0) + 1;
      });
      return Object.entries(statusGroups).map(([status, count]) => ({ _id: status, count }));
    }

    if (groupField === 'department') {
      if (group.completed) {
        const deptGroups = {};
        filtered.forEach(c => {
          if (!deptGroups[c.department]) {
            deptGroups[c.department] = { total: 0, completed: 0 };
          }
          deptGroups[c.department].total += 1;
          if (c.status === 'Completed') {
            deptGroups[c.department].completed += 1;
          }
        });

        return Object.entries(deptGroups).map(([dept, stats]) => {
          let rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
          rate = Math.round(rate * 10) / 10;
          return {
            _id: dept,
            total: stats.total,
            completed: stats.completed,
            rate: rate
          };
        });
      }

      const deptGroups = {};
      filtered.forEach(c => {
        deptGroups[c.department] = (deptGroups[c.department] || 0) + 1;
      });
      return Object.entries(deptGroups).map(([dept, count]) => ({ _id: dept, count }));
    }

    if (typeof groupField === 'object') {
      const monthlyGroups = {};
      filtered.forEach(c => {
        const date = new Date(c.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthlyGroups[key] = (monthlyGroups[key] || 0) + 1;
      });
      return Object.entries(monthlyGroups).map(([key, count]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          _id: { month, year },
          count
        };
      });
    }
  }

  return [];
};

Complaint.countDocuments = async (query) => {
  let filtered = [...mockComplaints];

  if (query.department) {
    filtered = filtered.filter(c => c.department === query.department);
  }
  if (query.priority) {
    filtered = filtered.filter(c => c.priority === query.priority);
  }
  if (query.status) {
    if (typeof query.status === 'object' && query.status.$ne) {
      filtered = filtered.filter(c => c.status !== query.status.$ne);
    } else if (typeof query.status === 'string') {
      filtered = filtered.filter(c => c.status === query.status);
    }
  }
  if (query.assignedOfficer) {
    filtered = filtered.filter(c => {
      const officerId = typeof c.assignedOfficer === 'object' ? c.assignedOfficer?._id : c.assignedOfficer;
      return officerId && officerId.toString() === query.assignedOfficer.toString();
    });
  }

  return filtered.length;
};

// --- MOCK NOTIFICATION QUERIES ---

const Notification = require('./models/notificationModel');
const mockNotifications = [
  {
    _id: 'mock-notify-1',
    user: '65fb7bb360d8e20f381e5b81', // John Citizen
    message: 'Welcome to CivicSmart Portal! Your account is active.',
    type: 'Success',
    read: false,
    createdAt: new Date()
  },
  {
    _id: 'mock-notify-2',
    user: '65fb7bb360d8e20f381e5b81', // John Citizen
    message: 'AI Pipeline successfully routed your pothole report to Public Works.',
    type: 'Info',
    read: false,
    createdAt: new Date()
  }
];

Notification.find = (query) => {
  const chain = {
    sort: function() { return this; },
    then: function(resolve) {
      let filtered = [...mockNotifications];
      if (query.user) {
        filtered = filtered.filter(n => n.user.toString() === query.user.toString());
      }
      if (query.read !== undefined) {
        filtered = filtered.filter(n => n.read === query.read);
      }
      resolve(filtered);
    }
  };
  return chain;
};

Notification.findById = async (id) => {
  const found = mockNotifications.find(n => n._id === id.toString());
  if (!found) return null;
  return {
    ...found,
    save: async function() {
      const idx = mockNotifications.findIndex(n => n._id === found._id);
      if (idx !== -1) {
        mockNotifications[idx] = { ...found, read: this.read };
      }
      return this;
    }
  };
};

Notification.updateMany = async (filter, update) => {
  const readVal = update.$set ? update.$set.read : update.read;
  let count = 0;
  mockNotifications.forEach(n => {
    if (n.user.toString() === filter.user.toString()) {
      n.read = readVal;
      count++;
    }
  });
  return { nModified: count };
};

// 4) Load Express App and start server
const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Mock Server] Express backend listening on http://localhost:${PORT}`);
  console.log(`[Mock Server] Active Environment: ${process.env.NODE_ENV}`);
});
