let cameras = [];
let searchQuery = '';
let selectedCategory = '';
let selectedStatus = '';
let showFilters = false;
let toolbarTimeout = null;

async function loadCameras() {
  try {
    const { data } = await apiFetch('/cctvs');
    cameras = data;
    renderStats();
    renderGrid();
  } catch {
    alert('Gagal memuat data kamera.');
  }
}

function getFilteredCameras() {
  let filtered = cameras;

  // Status filter
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
    if (c.stream_id && isValidYouTubeId(c.stream_id)) {
      return `
        <div class="camera-cell">
          <iframe src="https://www.youtube.com/embed/${escapeHtml(c.stream_id)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
                  allow="autoplay; encrypted-media"
                  title="${escapeHtml(c.name)}"></iframe>
        </div>
      `;
    }

    return `
      <div class="camera-cell camera-placeholder">
        <img src="/thumbnail-offline.svg" alt="Thumbnail ${escapeHtml(c.name)}" onerror="this.style.display='none'" />
        <div class="camera-placeholder-info">
          <p class="camera-placeholder-name">${escapeHtml(c.name)}</p>
          <span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(c.status)}</span>
        </div>
      </div>
    `;
  }).join('');

  if (count) count.textContent = `${filtered.length} / ${cameras.length} kamera`;
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
  const filterGroup = document.querySelector('.filter-group');
  filterGroup?.classList.remove('hidden');
  toolbarTimeout = setTimeout(() => {
    filterGroup?.classList.add('hidden');
  }, 3000);
}

function renderCategoryFilters() {
  const selects = document.querySelectorAll('.category-filter');
  selects.forEach(select => {
    select.innerHTML = CATEGORIES.map(c =>
      `<option value="${c.value}">${escapeHtml(c.label)}</option>`
    ).join('');
  });
}

function renderStatusFilters() {
  const selects = document.querySelectorAll('.status-filter');
  selects.forEach(select => {
    select.innerHTML = STATUSES.map(s =>
      `<option value="${s.value}">${escapeHtml(s.label)}</option>`
    ).join('');
  });
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
document.getElementById('toolbar-toggle')?.addEventListener('click', toggleFilters);

document.getElementById('search')?.addEventListener('input', debounce((e) => {
  searchQuery = e.target.value;
  renderGrid();
}));

document.getElementById('category-filter')?.addEventListener('change', (e) => {
  selectedCategory = e.target.value;
  renderGrid();
});

document.getElementById('status-filter')?.addEventListener('change', (e) => {
  selectedStatus = e.target.value;
  renderGrid();
});

document.getElementById('overlay')?.addEventListener('click', () => {
  selectedCamera = null;
  document.getElementById('detail-panel')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('visible');
});

document.getElementById('logout-btn')?.addEventListener('click', logout);

document.addEventListener('mousemove', resetToolbarTimeout);
document.addEventListener('pointermove', resetToolbarTimeout);

renderCategoryFilters();
renderStatusFilters();
loadCameras();
loadUserInfo();
resetToolbarTimeout();
