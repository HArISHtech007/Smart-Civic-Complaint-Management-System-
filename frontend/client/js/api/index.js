const API_BASE_URL = 'http://localhost:5000/api';
const AI_SERVICE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('civic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('civic_token');
        localStorage.removeItem('civic_role');
        localStorage.removeItem('civic_user');
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
          window.location.href = '/login.html';
        }
      }
      if (error.response.status === 403) {
        window.location.href = '/403.html';
      }
    }
    return Promise.reject(error);
  }
);