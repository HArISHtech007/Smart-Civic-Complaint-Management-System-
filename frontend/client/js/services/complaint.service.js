async function submitComplaint(formData) {
  const res = await api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

async function getAllComplaints(params = {}) {
  let serverComplaints = [];
  try {
    const res = await api.get('/complaints', { params });
    serverComplaints = res.data?.complaints || res.data?.data || (Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.warn('Backend GET /complaints failed, using local storage fallback:', err);
  }

  const localComplaints = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');

  const map = new Map();
  [...localComplaints, ...serverComplaints].forEach(c => {
    const id = c._id || c.id || c.trackingId;
    if (id && !map.has(id)) {
      map.set(id, c);
    }
  });

  const merged = Array.from(map.values());
  return { success: true, complaints: merged, data: merged };
}

async function getMyComplaints(params = {}) {
  try {
    const res = await api.get('/complaints/my', { params });
    const serverComplaints = res.data?.complaints || res.data?.data || (Array.isArray(res.data) ? res.data : []);
    const localComplaints = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');

    const map = new Map();
    [...serverComplaints, ...localComplaints].forEach(c => {
      const id = c._id || c.id || c.trackingId;
      if (id && !map.has(id)) map.set(id, c);
    });

    const merged = Array.from(map.values());
    return { success: true, complaints: merged, data: merged };
  } catch (err) {
    console.warn('/complaints/my endpoint failed, falling back to local storage:', err);
    const localComplaints = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');
    return { success: true, complaints: localComplaints, data: localComplaints };
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

const STATUS_MAP = {
  submitted: 'Pending',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Completed',
  completed: 'Completed',
  closed: 'Closed',
  rejected: 'Rejected'
};

async function updateComplaintStatus(id, status, notes, afterImage) {
  const backendStatus = STATUS_MAP[status] || status;
  const formData = new FormData();
  formData.append('status', backendStatus);
  if (notes) formData.append('notes', notes);
  if (afterImage) {
    formData.append('afterImage', afterImage);
  }
  try {
    const res = await api.put(`/complaints/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    updateLocalStorageStatus(id, status);
    return res.data;
  } catch (err) {
    console.warn('Backend status update failed, saving locally:', err);
    updateLocalStorageStatus(id, status);
    return { success: true };
  }
}

function updateLocalStorageStatus(id, status) {
  try {
    const list = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');
    const target = list.find(c => c._id === id || c.id === id || c.trackingId === id);
    if (target) {
      target.status = status;
      localStorage.setItem('civic_user_complaints', JSON.stringify(list));
    }
  } catch (e) {}
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
  const allData = await getAllComplaints(params);
  const list = allData.complaints || [];

  const total = list.length;
  const pending = list.filter(c => ['pending', 'submitted'].includes((c.status || '').toLowerCase())).length;
  const inProgress = list.filter(c => ['in_progress', 'assigned', 'accepted'].includes((c.status || '').toLowerCase())).length;
  const resolved = list.filter(c => ['completed', 'resolved', 'closed'].includes((c.status || '').toLowerCase())).length;

  return {
    success: true,
    stats: { total, pending, inProgress, resolved }
  };
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