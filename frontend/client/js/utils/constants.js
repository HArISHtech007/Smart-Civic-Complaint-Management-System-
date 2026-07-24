const ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  HEAD_OFFICER: 'head_officer',
  ADMIN: 'admin'
};

const SEVERITY = {
  CRITICAL: { value: 'critical', label: 'Critical', color: 'var(--danger-red)', glow: 'var(--critical-glow)', deadline: '24 hours', icon: 'error' },
  HIGH: { value: 'high', label: 'High', color: 'var(--warning-amber)', glow: 'var(--high-glow)', deadline: '3 days', icon: 'warning' },
  MEDIUM: { value: 'medium', label: 'Medium', color: 'var(--primary-blue)', glow: 'var(--medium-glow)', deadline: '7 days', icon: 'info' },
  LOW: { value: 'low', label: 'Low', color: 'var(--success-green)', glow: 'var(--low-glow)', deadline: '14 days', icon: 'check_circle' }
};

const STATUS = {
  SUBMITTED: { value: 'submitted', label: 'Submitted', color: 'var(--status-submitted)', icon: 'circle' },
  UNDER_REVIEW: { value: 'under_review', label: 'Under Review', color: 'var(--status-under-review)', icon: 'search' },
  ASSIGNED: { value: 'assigned', label: 'Assigned', color: 'var(--status-assigned)', icon: 'person_pin' },
  IN_PROGRESS: { value: 'in_progress', label: 'In Progress', color: 'var(--status-in-progress)', icon: 'engineering' },
  RESOLVED: { value: 'resolved', label: 'Resolved', color: 'var(--status-resolved)', icon: 'check_circle' },
  CLOSED: { value: 'closed', label: 'Closed', color: 'var(--status-closed)', icon: 'lock' }
};

const STATUS_FLOW = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];

const DEPARTMENTS = [
  { id: 'roads', name: 'Roads & Highways Department', icon: 'road', color: '#3B82F6' },
  { id: 'waste', name: 'Solid Waste Management', icon: 'delete', color: '#10B981' },
  { id: 'water', name: 'Water Supply & Drainage Board', icon: 'water_drop', color: '#06B6D4' },
  { id: 'lighting', name: 'Street Lighting Department', icon: 'light', color: '#F59E0B' },
  { id: 'planning', name: 'Town Planning Department', icon: 'apartment', color: '#8B5CF6' },
  { id: 'parks', name: 'Parks & Horticulture Department', icon: 'park', color: '#EC4899' }
];

const ISSUE_CATEGORIES = [
  'Pothole', 'Garbage Overflow', 'Water Leakage', 'Drainage Blockage',
  'Broken Street Light', 'Illegal Dumping', 'Fallen Tree', 'Road Damage',
  'Other'
];

function getSeverityConfig(value) {
  return SEVERITY[value?.toUpperCase()] || SEVERITY.MEDIUM;
}

function getStatusConfig(value) {
  return STATUS[value?.toUpperCase()] || STATUS.SUBMITTED;
}

function getDepartment(id) {
  return DEPARTMENTS.find(d => d.id === id);
}

function getStatusIndex(value) {
  return STATUS_FLOW.indexOf(value);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
}

function generateId() {
  return 'CIV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}