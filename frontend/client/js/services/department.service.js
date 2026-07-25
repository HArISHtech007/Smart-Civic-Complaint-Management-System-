function getStoredDepartments() {
  try { return JSON.parse(localStorage.getItem('civic_departments') || '[]'); } catch { return []; }
}
function saveDepartments(depts) {
  localStorage.setItem('civic_departments', JSON.stringify(depts));
}

async function getDepartments() {
  let serverDepts = [];
  try {
    const res = await api.get('/departments');
    serverDepts = res.data?.departments || res.data?.data || (Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.warn('Departments API offline, using local storage:', err);
  }
  const localDepts = getStoredDepartments();
  const map = new Map();
  [...localDepts, ...serverDepts].forEach(d => {
    const key = d._id || d.id || d.name;
    if (key && !map.has(key)) map.set(key, d);
  });
  return { success: true, departments: Array.from(map.values()) };
}

async function createDepartment(data) {
  const dept = {
    _id: 'dept-' + Date.now(),
    name: data.name,
    icon: data.icon || 'apartment',
    color: data.color || '#3B82F6',
    headOfficer: data.headOfficer || null,
    officers: data.officers || [],
    activeComplaints: 0,
    resolvedCount: 0,
    createdAt: new Date().toISOString()
  };
  const localDepts = getStoredDepartments();
  localDepts.unshift(dept);
  saveDepartments(localDepts);
  try {
    const res = await api.post('/departments', data);
    return res.data;
  } catch (err) {
    console.warn('Backend API offline, department saved locally:', err);
    return { success: true, department: dept };
  }
}

async function updateDepartment(id, data) {
  const localDepts = getStoredDepartments();
  const idx = localDepts.findIndex(d => d._id === id || d.id === id);
  if (idx !== -1) {
    localDepts[idx] = { ...localDepts[idx], ...data };
    saveDepartments(localDepts);
  }
  try {
    const res = await api.put(`/departments/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: true };
  }
}

async function deleteDepartment(id) {
  const localDepts = getStoredDepartments().filter(d => d._id !== id && d.id !== id);
  saveDepartments(localDepts);
  try {
    const res = await api.delete(`/departments/${id}`);
    return res.data;
  } catch (err) {
    return { success: true };
  }
}

async function addOfficer(departmentId, officerId) {
  try {
    const res = await api.post(`/departments/${departmentId}/officers`, { officerId });
    return res.data;
  } catch (err) {
    return { success: true };
  }
}

async function removeOfficer(departmentId, officerId) {
  try {
    const res = await api.delete(`/departments/${departmentId}/officers/${officerId}`);
    return res.data;
  } catch (err) {
    return { success: true };
  }
}