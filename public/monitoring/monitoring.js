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
let searchQuery = '';
let selectedCategory = '';
let selectedStatus = '';
let showFilters = false;
let toolbarTimeout = null;

const categories = [
  { value: '', label: 'Semua' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'public_facility', label: 'Public Facility' },
  { value: 'disaster', label: 'Disaster' },
  { value: 'security', label: 'Security' },
  { value: 'environment', label: 'Environment' },
];

const statuses = [
  { value: '', label: 'Semua Status' },
  { value: 'online', label: 'Online' },
  { value: 'warning', label: 'Warning' },
  { value: 'offline', label: 'Offline' },
];

async function loadCameras() {
  try {
    const { data } = await apiFetch('/cctvs');
    cameras = data;
    renderGrid();
  } catch {
    alert('Gagal memuat data kamera.');
  }
}

function getFilteredCameras() {
  let filtered = cameras;

  // Status filter (matches original logic)
  if (selectedStatus === 'offline') {
    filtered = filtered.filter(c => !c.is_live);
  } else if (selectedStatus) {
    filtered = filtered.filter(c => c.status === selectedStatus);
  } else {
    filtered = filtered.filter(c => c.is_live === true);
  }

  // Category filter
  if (selectedCategory) {
    filtered = filtered.filter(c => c.category === selectedCategory);
  }

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  }

  return filtered;
}

function renderGrid() {
  const grid = document.getElementById('camera-grid');
  const count = document.getElementById('camera-count');
  if (!grid) return;

  const filtered = getFilteredCameras();

  // Calculate grid dimensions
  const total = filtered.length;
  if (total === 0) {
    grid.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--color-text-secondary)">Tidak ada kamera ditemukan</div>';
    grid.style.gridTemplateColumns = '1fr';
    grid.style.gridTemplateRows = '1fr';
    if (count) count.textContent = `0 / ${cameras.length} kamera`;
    return;
  }

  const cols = Math.ceil(Math.sqrt(total * (16/9)));
  const rows = Math.ceil(total / cols);

  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  grid.innerHTML = filtered.map(c => {
    if (c.stream_id) {
      return `
        <div class="camera-cell">
          <iframe src="https://www.youtube.com/embed/${c.stream_id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
                  allow="autoplay; encrypted-media"
                  title="${c.name}"></iframe>
        </div>
      `;
    }

    return `
      <div class="camera-cell camera-placeholder">
        <img src="/thumbnail-offline.svg" alt="Thumbnail ${c.name}" onerror="this.style.display='none'" />
        <div class="camera-placeholder-info">
          <p class="camera-placeholder-name">${c.name}</p>
          <span class="status-badge ${c.status}">${c.status}</span>
        </div>
      </div>
    `;
  }).join('');

  if (count) count.textContent = `${filtered.length} / ${cameras.length} kamera`;
}

function toggleFilters() {
  showFilters = !showFilters;
  const filtersEl = document.getElementById('toolbar-filters');
  const toggleBtn = document.getElementById('toolbar-toggle');

  if (showFilters) {
    filtersEl?.classList.remove('hidden');
    toggleBtn?.classList.add('active');
  } else {
    filtersEl?.classList.add('hidden');
    toggleBtn?.classList.remove('active');
  }
}

function resetToolbarTimeout() {
  clearTimeout(toolbarTimeout);
  const toolbar = document.getElementById('toolbar');
  toolbar?.classList.remove('hidden');
  toolbarTimeout = setTimeout(() => {
    toolbar?.classList.add('hidden');
  }, 3000);
}

function renderCategoryFilters() {
  const selects = document.querySelectorAll('.category-filter');
  selects.forEach(select => {
    select.innerHTML = categories.map(c =>
      `<option value="${c.value}">${c.label}</option>`
    ).join('');
  });
}

function renderStatusFilters() {
  const selects = document.querySelectorAll('.status-filter');
  selects.forEach(select => {
    select.innerHTML = statuses.map(s =>
      `<option value="${s.value}">${s.label}</option>`
    ).join('');
  });
}

// Init
document.getElementById('toolbar-toggle')?.addEventListener('click', toggleFilters);

document.getElementById('search')?.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderGrid();
});

document.getElementById('category-filter')?.addEventListener('change', (e) => {
  selectedCategory = e.target.value;
  renderGrid();
});

document.getElementById('status-filter')?.addEventListener('change', (e) => {
  selectedStatus = e.target.value;
  renderGrid();
});

document.addEventListener('mousemove', resetToolbarTimeout);
document.addEventListener('pointermove', resetToolbarTimeout);

renderCategoryFilters();
renderStatusFilters();
loadCameras();
resetToolbarTimeout();
