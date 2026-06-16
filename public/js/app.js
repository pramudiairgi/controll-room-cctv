const API_BASE = '/api';

// Shared data
const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'public_facility', label: 'Public Facility' },
  { value: 'disaster', label: 'Disaster' },
  { value: 'security', label: 'Security' },
  { value: 'environment', label: 'Environment' },
];

const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function isValidYouTubeId(id) {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// API client
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}
