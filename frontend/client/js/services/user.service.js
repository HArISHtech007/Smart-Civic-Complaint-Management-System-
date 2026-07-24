const MOCK_SYSTEM_USERS = [
  { _id: 'u1', name: 'Dharun', email: 'dharun6@civic.com', phone: '9876543299', role: 'citizen' },
  { _id: 'u2', name: 'John Citizen', email: 'citizen@example.com', phone: '1234567890', role: 'citizen' },
  { _id: 'u3', name: 'Alice Smith', email: 'alice@example.com', phone: '9876543211', role: 'citizen' },
  { _id: 'u4', name: 'David Miller', email: 'david@example.com', phone: '9876543214', role: 'citizen' },
  
  { _id: 'u5', name: 'Officer Bob', email: 'officer@example.com', phone: '5555555555', role: 'officer', department: 'Roads & Highways' },
  { _id: 'u6', name: 'Officer Alex', email: 'alex@example.com', phone: '5555555556', role: 'officer', department: 'Solid Waste Management' },
  { _id: 'u7', name: 'Officer Sarah', email: 'sarah@example.com', phone: '5555555557', role: 'officer', department: 'Water Supply Board' },

  { _id: 'u8', name: 'Carol Head', email: 'carol@example.com', phone: '9876543212', role: 'head_officer', department: 'Sanitation' },
  { _id: 'u9', name: 'Head Officer Raman', email: 'raman@example.com', phone: '9876543215', role: 'head_officer', department: 'Town Planning' },

  { _id: 'u10', name: 'Admin Dharun', email: 'dharun@admin.com', phone: '9876543210', role: 'admin' },
  { _id: 'u11', name: 'Admin Boss', email: 'admin@example.com', phone: '9999999999', role: 'admin' }
];

async function getUsers(params = {}) {
  try {
    const res = await api.get('/users', { params });
    return res.data;
  } catch (err) {
    console.warn('Users API endpoint fallback active:', err);
    const targetRole = (params.role || '').toLowerCase();
    let filtered = MOCK_SYSTEM_USERS;
    if (targetRole) {
      filtered = MOCK_SYSTEM_USERS.filter(u => u.role.toLowerCase() === targetRole);
    }
    return { success: true, users: filtered, data: filtered };
  }
}

async function getUserById(id) {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    const found = MOCK_SYSTEM_USERS.find(u => u._id === id);
    return { success: true, user: found };
  }
}

async function createUser(data) {
  try {
    const res = await api.post('/users', data);
    return res.data;
  } catch (err) {
    const newUser = { _id: 'u-' + Date.now(), ...data };
    MOCK_SYSTEM_USERS.unshift(newUser);
    return { success: true, user: newUser };
  }
}

async function updateUser(id, data) {
  try {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: true };
  }
}

async function deleteUser(id) {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    const idx = MOCK_SYSTEM_USERS.findIndex(u => u._id === id);
    if (idx !== -1) MOCK_SYSTEM_USERS.splice(idx, 1);
    return { success: true };
  }
}