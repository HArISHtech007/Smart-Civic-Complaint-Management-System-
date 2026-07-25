const MOCK_SYSTEM_USERS = [
  { _id: 'u1', name: 'Dharun', email: 'dharun6@civic.com', phone: '9876543299', role: 'citizen' },
  { _id: 'u2', name: 'John Citizen', email: 'citizen@example.com', phone: '1234567890', role: 'citizen' },
  { _id: 'u3', name: 'Alice Smith', email: 'alice@example.com', phone: '9876543211', role: 'citizen' },
  { _id: 'u4', name: 'David Miller', email: 'david@example.com', phone: '9876543214', role: 'citizen' },
  
  { _id: 'u5', name: 'Officer Bob', email: 'officer@example.com', phone: '5555555555', role: 'officer', department: 'Roads & Highways' },
  { _id: 'u6', name: 'Officer Alex', email: 'alex@example.com', phone: '5555555556', role: 'officer', department: 'Solid Waste Management' },
  { _id: 'u7', name: 'Officer Sarah', email: 'sarah@example.com', phone: '5555555557', role: 'officer', department: 'Water Supply & Drainage' },

  { _id: 'u8', name: 'Carol Head', email: 'carol@example.com', phone: '9876543212', role: 'head_officer', department: 'Solid Waste Management' },
  { _id: 'u9', name: 'Head Officer Raman', email: 'raman@example.com', phone: '9876543215', role: 'head_officer', department: 'Town Planning' },

  { _id: 'u10', name: 'Admin Dharun', email: 'dharun@admin.com', phone: '9876543210', role: 'admin' },
  { _id: 'u11', name: 'Admin Boss', email: 'admin@example.com', phone: '9999999999', role: 'admin' }
];

function getStoredCustomUsers() {
  try {
    return JSON.parse(localStorage.getItem('civic_custom_users') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCustomUsers(users) {
  try {
    localStorage.setItem('civic_custom_users', JSON.stringify(users));
  } catch (e) {}
}

async function getUsers(params = {}) {
  let serverUsers = [];
  try {
    const res = await api.get('/users', { params });
    serverUsers = res.data?.users || res.data?.data || (Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.warn('Users API endpoint offline, using stored user store:', err);
  }

  const customUsers = getStoredCustomUsers();
  const allUsersMap = new Map();

  [...MOCK_SYSTEM_USERS, ...customUsers, ...serverUsers].forEach(u => {
    if (u && u._id) {
      allUsersMap.set(u._id, u);
    }
  });

  const allUsers = Array.from(allUsersMap.values());
  const targetRole = (params.role || '').toLowerCase();

  let filtered = allUsers;
  if (targetRole) {
    filtered = allUsers.filter(u => (u.role || '').toLowerCase() === targetRole);
  }

  return { success: true, users: filtered, data: filtered };
}

async function getUserById(id) {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    const allUsers = [...MOCK_SYSTEM_USERS, ...getStoredCustomUsers()];
    const found = allUsers.find(u => u._id === id);
    return { success: true, user: found };
  }
}

async function createUser(data) {
  const newUser = { 
    _id: 'usr-' + Date.now(), 
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    role: (data.role || 'citizen').toLowerCase(),
    department: data.department || 'General Administration',
    createdAt: new Date().toISOString()
  };

  // Save into localStorage
  const customUsers = getStoredCustomUsers();
  customUsers.unshift(newUser);
  saveCustomUsers(customUsers);

  // Try API call
  try {
    const res = await api.post('/users', data);
    return res.data;
  } catch (err) {
    console.warn('Backend API offline, user stored in local storage:', err);
    return { success: true, user: newUser };
  }
}

async function updateUser(id, data) {
  const customUsers = getStoredCustomUsers();
  const idx = customUsers.findIndex(u => u._id === id);
  if (idx !== -1) {
    customUsers[idx] = { ...customUsers[idx], ...data };
    saveCustomUsers(customUsers);
  }

  try {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: true };
  }
}

async function deleteUser(id) {
  // Delete from localStorage
  const customUsers = getStoredCustomUsers();
  const updated = customUsers.filter(u => u._id !== id);
  saveCustomUsers(updated);

  // Delete from MOCK_SYSTEM_USERS in memory
  const sysIdx = MOCK_SYSTEM_USERS.findIndex(u => u._id === id);
  if (sysIdx !== -1) MOCK_SYSTEM_USERS.splice(sysIdx, 1);

  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    return { success: true };
  }
}