let cameras = [];
let map = null;
let markers = [];
let selectedCamera = null;
let selectedStatus = '';

function renderCategoryFilters() {
  const select = document.getElementById('category-filter');
  if (select) {
    select.innerHTML = CATEGORIES.map(c =>
      `<option value="${c.value}">${escapeHtml(c.label)}</option>`
    ).join('');
  }
}

function renderStatusFilters() {
  const select = document.getElementById('status-filter');
  if (select) {
    select.innerHTML = STATUSES.map(s =>
      `<option value="${s.value}">${escapeHtml(s.label)}</option>`
    ).join('');
  }
}

async function loadCameras() {
  try {
    const { data } = await apiFetch('/cctvs');
    cameras = data;
    renderStats();
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
    const matchStatus = !selectedStatus || c.status === selectedStatus;
    return matchSearch && matchCategory && matchStatus;
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

function createPinIcon(status) {
  const html = `
    <div class="map-pin">
      ${status === 'online' ? '<div class="pulse-ring"></div>' : ''}
      <img src="/icons/cctv-icon.png" width="32" height="32" draggable="false" />
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    tooltipAnchor: [0, -34],
  });
}

function renderMap() {
  if (!map) {
    map = L.map('map', { zoomControl: false }).setView([-6.2088, 106.8456], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
  }

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const bounds = L.latLngBounds();
  const filtered = getFilteredCameras();
  filtered.forEach(c => {
    if (c.latitude && c.longitude) {
      const marker = L.marker([c.latitude, c.longitude], {
        icon: createPinIcon(c.status),
      }).addTo(map);

      marker.on('click', () => selectCamera(c.id));
      marker.bindTooltip(escapeHtml(c.name));
      markers.push(marker);
      bounds.extend([c.latitude, c.longitude]);
    }
  });

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }
}

function selectCamera(id) {
  selectedCamera = cameras.find(c => c.id === id);
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

  const videoHtml = c.stream_id && isValidYouTubeId(c.stream_id)
    ? `<div class="video-container">
        <iframe src="https://www.youtube.com/embed/${escapeHtml(c.stream_id)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
                allow="autoplay; encrypted-media"></iframe>
      </div>`
    : '';

  panel.innerHTML = `
    <div class="detail-header">
      <h3>${escapeHtml(c.name)}</h3>
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
        <span>${escapeHtml(c.location || 'Tidak diketahui')}</span>
      </div>
      <div class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2"/>
        </svg>
        <span style="color: ${statusColor}; text-transform: capitalize">${escapeHtml(c.status)}</span>
      </div>
      <div class="meta-item">${escapeHtml(c.category.replace('_', ' '))}</div>
    </div>
    ${videoHtml}
  `;

  document.getElementById('close-detail')?.addEventListener('click', closeDetail);

  panel.classList.add('open');
  overlay.classList.add('visible');
}

function closeDetail() {
  selectedCamera = null;
  document.getElementById('detail-panel')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('visible');
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
const handleSearch = debounce(() => {
  renderMap();
});

document.getElementById('search')?.addEventListener('input', handleSearch);

document.getElementById('category-filter')?.addEventListener('change', () => {
  renderMap();
});

document.getElementById('status-filter')?.addEventListener('change', (e) => {
  selectedStatus = e.target.value;
  renderMap();
});

document.getElementById('overlay')?.addEventListener('click', closeDetail);
document.getElementById('logout-btn')?.addEventListener('click', logout);

renderCategoryFilters();
renderStatusFilters();
loadCameras();
loadUserInfo();
