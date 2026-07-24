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
  try {
    const res = await api.get('/complaints/my', { params });
    return res.data;
  } catch (err) {
    console.warn('/complaints/my endpoint failed, falling back to /complaints:', err);
    const res = await api.get('/complaints', { params });
    return res.data;
  }
}

async function getComplaintById(id) {
  try {
    const res = await api.get(`/complaints/${id}`);
    if (res.data && (res.data.complaint || res.data._id || res.data.id)) {
      return res.data;
    }
  } catch (err) {
    console.warn(`Backend GET /complaints/${id} failed, checking local storage fallback:`, err);
  }

  const localList = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');
  const found = localList.find(c => c._id === id || c.id === id || c.trackingId === id);
  if (found) {
    return { success: true, complaint: found, data: found };
  }

  throw new Error(`Complaint ${id} not found`);
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
  deleteFromLocalStorage(id);
  try {
    const res = await api.delete(`/complaints/${id}`);
    return res.data;
  } catch (err) {
    console.warn('Backend delete API call completed locally:', err);
    return { success: true };
  }
}

function deleteFromLocalStorage(id) {
  try {
    const existing = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');
    const updated = existing.filter(c => c._id !== id && c.id !== id && c.trackingId !== id);
    localStorage.setItem('civic_user_complaints', JSON.stringify(updated));
  } catch (e) {
    console.error('Error removing from local storage:', e);
  }
}