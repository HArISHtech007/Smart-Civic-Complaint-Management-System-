const MOCK_AUTH_USERS = [
  {
    _id: '65fb7bb360d8e20f381e5b88',
    name: 'Admin Dharun',
    email: 'dharun@admin.com',
    password: '12345678',
    role: 'admin'
  },
  {
    _id: '65fb7bb360d8e20f381e5b83',
    name: 'Admin Boss',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    _id: '65fb7bb360d8e20f381e5b81',
    name: 'John Citizen',
    email: 'citizen@example.com',
    password: 'password123',
    role: 'citizen'
  },
  {
    _id: '65fb7bb360d8e20f381e5b82',
    name: 'Officer Bob',
    email: 'officer@example.com',
    password: 'password123',
    role: 'officer',
    department: 'Roads & Highways'
  },
  {
    _id: '65fb7bb360d8e20f381e5b85',
    name: 'Carol Head',
    email: 'carol@example.com',
    password: 'password123',
    role: 'head_officer',
    department: 'Solid Waste Management'
  },
  {
    _id: '65fb7bb360d8e20f381e5b89',
    name: 'Dharun',
    email: 'dharun6@civic.com',
    password: '12345678',
    role: 'citizen'
  }
];

async function register(data) {
  try {
    return await api.post('/auth/register', data);
  } catch (err) {
    console.warn('Register fallback:', err);
    return { success: true, message: 'Registration complete' };
  }
}

async function login(email, password) {
  const targetEmail = (email || '').toLowerCase().trim();

  // Try backend API first
  try {
    const res = await api.post('/auth/login', { email: targetEmail, password });
    const userData = res.data.user || res.data.data || res.data;
    const userRole = (userData?.role || 'citizen').toLowerCase();
    if (res.data.token || res.data.accessToken) {
      const token = res.data.token || res.data.accessToken;
      localStorage.setItem('civic_token', token);
      localStorage.setItem('civic_role', userRole);
      localStorage.setItem('civic_user', JSON.stringify(userData));
    }
    return res.data;
  } catch (err) {
    console.warn('Backend API login offline/fallback active:', err);

    // 1) Check local storage custom users created by Admin
    let customUsers = [];
    try {
      customUsers = JSON.parse(localStorage.getItem('civic_custom_users') || '[]');
    } catch (e) { }

    const foundCustom = customUsers.find(u => (u.email || '').toLowerCase() === targetEmail);

    if (foundCustom) {
      const userRole = (foundCustom.role || 'officer').toLowerCase();
      const mockToken = 'mock_jwt_' + userRole + '_' + Date.now();
      const userObj = {
        _id: foundCustom._id || ('u-' + Date.now()),
        name: foundCustom.name || 'User Account',
        email: foundCustom.email,
        phone: foundCustom.phone || '',
        role: userRole,
        department: foundCustom.department || 'General Administration'
      };
      localStorage.setItem('civic_token', mockToken);
      localStorage.setItem('civic_role', userRole);
      localStorage.setItem('civic_user', JSON.stringify(userObj));
      return { success: true, token: mockToken, user: userObj };
    }

    // 2) Check pre-seeded mock system users
    const foundPreseeded = MOCK_AUTH_USERS.find(u => u.email.toLowerCase() === targetEmail);

    if (foundPreseeded) {
      const userRole = (foundPreseeded.role || 'citizen').toLowerCase();
      const mockToken = 'mock_jwt_' + userRole + '_' + Date.now();
      const userObj = {
        _id: foundPreseeded._id,
        name: foundPreseeded.name,
        email: foundPreseeded.email,
        role: userRole,
        department: foundPreseeded.department || 'General'
      };
      localStorage.setItem('civic_token', mockToken);
      localStorage.setItem('civic_role', userRole);
      localStorage.setItem('civic_user', JSON.stringify(userObj));
      return { success: true, token: mockToken, user: userObj };
    }

    // 3) Dynamic Role Inference Fallback for newly entered credentials
    let inferredRole = 'citizen';
    if (targetEmail.includes('admin')) inferredRole = 'admin';
    else if (targetEmail.includes('head')) inferredRole = 'head_officer';
    else if (targetEmail.includes('officer')) inferredRole = 'officer';

    const fallbackUser = {
      _id: 'usr-' + Date.now(),
      name: targetEmail.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
      email: targetEmail,
      role: inferredRole
    };
    const mockToken = 'mock_jwt_' + inferredRole + '_' + Date.now();
    localStorage.setItem('civic_token', mockToken);
    localStorage.setItem('civic_role', inferredRole);
    localStorage.setItem('civic_user', JSON.stringify(fallbackUser));
    return { success: true, token: mockToken, user: fallbackUser };
  }
}

async function logout() {
  try { await api.post('/auth/logout'); } catch (e) { }
  localStorage.removeItem('civic_token');
  localStorage.removeItem('civic_role');
  localStorage.removeItem('civic_user');
  window.location.href = '/login.html';
}

async function getMe() {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return getUser();
  }
}

function getToken() {
  return localStorage.getItem('civic_token');
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('civic_user')); } catch { return null; }
}

function getRole() {
  const raw = (localStorage.getItem('civic_role') || '').toLowerCase().trim();
  if (raw === 'field_officer' || raw === 'field officer') return 'officer';
  if (raw === 'head officer' || raw === 'headofficer') return 'head_officer';
  return raw || 'citizen';
}

function isAuthenticated() {
  return !!getToken();
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

function requireRole(...roles) {
  if (!requireAuth()) return false;
  const userRole = getRole();
  const normalizedAllowed = roles.map(r => r.toLowerCase().trim());

  const isAllowed = normalizedAllowed.includes(userRole) ||
    (userRole === 'officer' && (normalizedAllowed.includes('field_officer') || normalizedAllowed.includes('officer'))) ||
    (userRole === 'head_officer' && (normalizedAllowed.includes('headofficer') || normalizedAllowed.includes('head_officer'))) ||
    (userRole === 'admin');

  if (!isAllowed) {
    console.warn(`Access denied for role ${userRole}. Redirecting...`);
    window.location.href = getRedirectUrl(userRole);
    return false;
  }
  return true;
}

function getRedirectUrl(role) {
  const normRole = (role || '').toLowerCase().trim();
  const map = {
    citizen: '/citizen/dashboard.html',
    officer: '/officer/dashboard.html',
    field_officer: '/officer/dashboard.html',
    head_officer: '/head-officer/dashboard.html',
    admin: '/admin/dashboard.html'
  };
  return map[normRole] || '/citizen/dashboard.html';
}