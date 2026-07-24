async function getDashboardStats() {
  const res = await api.get('/analytics/dashboard');
  return res.data;
}
async function getComplaintChart(params = {}) {
  const res = await api.get('/analytics/complaints-chart', { params });
  return res.data;
}
async function getDepartmentPerformance() {
  const res = await api.get('/analytics/department-performance');
  return res.data;
}
async function getResolutionTrend() {
  const res = await api.get('/analytics/resolution-trend');
  return res.data;
}