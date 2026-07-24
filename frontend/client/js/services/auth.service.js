async function register(data) {
  return api.post('/auth/register', data);
}
async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  const userData = res.data.user || res.data.data || res.data;
  const userRole = (userData?.role || 'citizen').toLowerCase();
  if (res.data.token) {
    localStorage.setItem('civic_token', res.data.token);
    localStorage.setItem('civic_role', userRole);
    localStorage.setItem('civic_user', JSON.stringify(userData));
  }
  return res.data;
}
async function logout() {
  try { await api.post('/auth/logout'); } catch (e) {}
  localStorage.removeItem('civic_token');
  localStorage.removeItem('civic_role');
  localStorage.removeItem('civic_user');
  window.location.href = '/login.html';
}
async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}
function getToken() {
  return localStorage.getItem('civic_token');
}
function getUser() {
  try { return JSON.parse(localStorage.getItem('civic_user')); } catch { return null; }
}
function getRole() {
  return localStorage.getItem('civic_role');
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
  const role = getRole();
  if (!roles.includes(role)) {
    window.location.href = '/403.html';
    return false;
  }
  return true;
}
function getRedirectUrl(role) {
  const map = {
    citizen: '/citizen/dashboard.html',
    officer: '/officer/dashboard.html',
    head_officer: '/head-officer/dashboard.html',
    admin: '/admin/dashboard.html'
  };
  return map[role] || '/citizen/dashboard.html';
}