const API_BASE = '/api';

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
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

let cameras = [];
let map = null;
let markers = [];
let selectedCamera = null;

const categories = [
  { value: '', label: 'Semua' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'public_facility', label: 'Public Facility' },
  { value: 'disaster', label: 'Disaster' },
  { value: 'security', label: 'Security' },
  { value: 'environment', label: 'Environment' },
];

function renderCategoryFilters() {
  const selects = document.querySelectorAll('.category-filter');
  selects.forEach(select => {
    select.innerHTML = categories.map(c =>
      `<option value="${c.value}">${c.label}</option>`
    ).join('');
  });
}

async function loadCameras() {
  try {
    const { data } = await apiFetch('/cctvs');
    cameras = data;
    renderStats();
    renderCameraList();
    renderMap();
  } catch {
    alert('Gagal memuat data kamera. Pastikan server backend berjalan.');
  }
}

function getFilteredCameras() {
  const search = document.getElementById('search')?.value?.toLowerCase() || '';
  const category = document.getElementById('category-filter')?.value || '';

  return cameras.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search) ||
      (c.location && c.location.toLowerCase().includes(search));
    const matchCategory = !category || c.category === category;
    return matchSearch && matchCategory;
  });
}

function renderStats() {
  const onlineCount = cameras.filter(c => c.status === 'online').length;
  const warningCount = cameras.filter(c => c.status === 'warning').length;
  const offlineCount = cameras.filter(c => c.status === 'offline').length;

  const statsEl = document.getElementById('stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-item">
        <span class="stat-dot online"></span>
        <span>${onlineCount} Online</span>
      </div>
      <div class="stat-item">
        <span class="stat-dot warning"></span>
        <span>${warningCount} Warning</span>
      </div>
      <div class="stat-item">
        <span class="stat-dot offline"></span>
        <span>${offlineCount} Offline</span>
      </div>
    `;
  }
}

function renderCameraList() {
  const list = document.getElementById('camera-list');
  if (!list) return;

  const filtered = getFilteredCameras();

  list.innerHTML = filtered.map(c => `
    <div class="camera-item ${selectedCamera?.id === c.id ? 'active' : ''}"
         data-id="${c.id}">
      <div class="camera-info">
        <div class="camera-name">${c.name}</div>
        <div class="camera-location">${c.location || 'Tidak diketahui'}</div>
      </div>
      <span class="status-badge ${c.status}">${c.status}</span>
    </div>
  `).join('');

  list.querySelectorAll('.camera-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id);
      selectCamera(id);
    });
  });
}

function renderMap() {
  if (!map) {
    map = L.map('map').setView([-6.2088, 106.8456], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const filtered = getFilteredCameras();
  filtered.forEach(c => {
    if (c.latitude && c.longitude) {
      const color = c.status === 'online' ? '#22c55e' :
                    c.status === 'warning' ? '#f59e0b' : '#ef4444';

      const marker = L.circleMarker([c.latitude, c.longitude], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      marker.on('click', () => selectCamera(c.id));
      marker.bindTooltip(c.name);
      markers.push(marker);
    }
  });
}

function selectCamera(id) {
  selectedCamera = cameras.find(c => c.id === id);
  renderCameraList();
  renderDetailPanel();
}

function renderDetailPanel() {
  const panel = document.getElementById('detail-panel');
  const overlay = document.getElementById('overlay');

  if (!selectedCamera || !panel || !overlay) {
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    return;
  }

  const c = selectedCamera;
  const statusColor = c.status === 'online' ? 'var(--color-success)' :
                      c.status === 'warning' ? 'var(--color-warning)' : 'var(--color-error)';

  panel.innerHTML = `
    <div class="detail-header">
      <h3>${c.name}</h3>
      <button class="close-btn" id="close-detail">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
    <div class="detail-meta">
      <div class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>${c.location || 'Tidak diketahui'}</span>
      </div>
      <div class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2"/>
        </svg>
        <span style="color: ${statusColor}; text-transform: capitalize">${c.status}</span>
      </div>
      <div class="meta-item">${c.category.replace('_', ' ')}</div>
    </div>
    ${c.stream_id ? `
      <div class="video-container">
        <iframe src="https://www.youtube.com/embed/${c.stream_id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
                allow="autoplay; encrypted-media"></iframe>
      </div>
    ` : ''}
  `;

  document.getElementById('close-detail')?.addEventListener('click', closeDetail);

  panel.classList.add('open');
  overlay.classList.add('visible');
}

function closeDetail() {
  selectedCamera = null;
  document.getElementById('detail-panel')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('visible');
  renderCameraList();
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

async function loadUserInfo() {
  try {
    const { data } = await apiFetch('/auth/me');
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const avatarEl = document.getElementById('user-avatar');

    if (nameEl) nameEl.textContent = data.name;
    if (emailEl) emailEl.textContent = data.email;
    if (avatarEl) avatarEl.textContent = data.name?.charAt(0)?.toUpperCase() || 'U';
  } catch {
    // Ignore error
  }
}

// Init
document.getElementById('search')?.addEventListener('input', () => {
  renderCameraList();
  renderMap();
});

document.getElementById('category-filter')?.addEventListener('change', () => {
  renderCameraList();
  renderMap();
});

document.getElementById('overlay')?.addEventListener('click', closeDetail);
document.getElementById('logout-btn')?.addEventListener('click', logout);

renderCategoryFilters();
loadCameras();
loadUserInfo();
