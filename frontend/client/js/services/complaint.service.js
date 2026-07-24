async function submitComplaint(formData) {
  const res = await api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}
async function getAllComplaints(params = {}) {
  const res = await api.get('/complaints', { params });
  return res.data;
}
async function getMyComplaints(params = {}) {
  const res = await api.get('/complaints/my', { params });
  return res.data;
}
async function getComplaintById(id) {
  const res = await api.get(`/complaints/${id}`);
  return res.data;
}
async function updateComplaintStatus(id, status, notes) {
  const res = await api.patch(`/complaints/${id}/status`, { status, notes });
  return res.data;
}
async function assignComplaint(id, officerId) {
  const res = await api.patch(`/complaints/${id}/assign`, { officerId });
  return res.data;
}
async function uploadProof(id, formData) {
  const res = await api.post(`/complaints/${id}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}
async function getComplaintStats(params = {}) {
  const res = await api.get('/complaints/stats', { params });
  return res.data;
}
async function deleteComplaint(id) {
  const res = await api.delete(`/complaints/${id}`);
  return res.data;
}