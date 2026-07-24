async function getDepartments() {
  const res = await api.get('/departments');
  return res.data;
}
async function createDepartment(data) {
  const res = await api.post('/departments', data);
  return res.data;
}
async function updateDepartment(id, data) {
  const res = await api.put(`/departments/${id}`, data);
  return res.data;
}
async function deleteDepartment(id) {
  const res = await api.delete(`/departments/${id}`);
  return res.data;
}
async function addOfficer(departmentId, officerId) {
  const res = await api.post(`/departments/${departmentId}/officers`, { officerId });
  return res.data;
}
async function removeOfficer(departmentId, officerId) {
  const res = await api.delete(`/departments/${departmentId}/officers/${officerId}`);
  return res.data;
}