async function getUsers(params = {}) {
  const res = await api.get('/users', { params });
  return res.data;
}
async function getUserById(id) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}
async function createUser(data) {
  const res = await api.post('/users', data);
  return res.data;
}
async function updateUser(id, data) {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
}
async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}