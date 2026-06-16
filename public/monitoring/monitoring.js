let cameras = [];
let searchQuery = '';
let selectedCategory = '';
let selectedStatus = '';
let gridRendered = false;

async function loadCameras() {
  try {
    const { data } = await apiFetch('/cctvs');
    cameras = data;
    if (!gridRendered) {
      renderGrid();
      gridRendered = true;
    }
    applyFilters();
  } catch {
    alert('Gagal memuat data kamera.');
  }
}

function getFilteredIds() {
  let filtered = cameras;

  if (selectedStatus === 'offline') {
    filtered = filtered.filter(c => !c.is_live);
  } else if (selectedStatus) {
    filtered = filtered.filter(c => c.status === selectedStatus);
  } else {
    filtered = filtered.filter(c => c.is_live === true);
  }

  if (selectedCategory) {
    filtered = filtered.filter(c => c.category === selectedCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  }

  return new Set(filtered.map(c => c.id));
}

function renderGrid() {
  const grid = document.getElementById('camera-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  cameras.forEach(c => {
    const cell = document.createElement('div');
    cell.className = 'camera-cell';
    cell.dataset.id = c.id;

    if (c.stream_id && isValidYouTubeId(c.stream_id)) {
      cell.innerHTML = `
        <div class="camera-placeholder">
          <img src="/thumbnail-offline.svg" alt="Thumbnail ${escapeHtml(c.name)}" onerror="this.style.display='none'" />
          <div class="camera-placeholder-info">
            <p class="camera-placeholder-name">${escapeHtml(c.name)}</p>
            <span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(c.status)}</span>
          </div>
        </div>
      `;
      const iframe = document.createElement('iframe');
      iframe.dataset.src = `https://www.youtube.com/embed/${escapeHtml(c.stream_id)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.title = c.name;
      iframe.loading = 'lazy';
      cell.appendChild(iframe);
    } else {
      cell.classList.add('camera-placeholder');
      cell.innerHTML = `
        <img src="/thumbnail-offline.svg" alt="Thumbnail ${escapeHtml(c.name)}" onerror="this.style.display='none'" />
        <div class="camera-placeholder-info">
          <p class="camera-placeholder-name">${escapeHtml(c.name)}</p>
          <span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(c.status)}</span>
        </div>
      `;
    }

    fragment.appendChild(cell);
  });

  grid.replaceChildren(fragment);
  initLazyLoad();
  applyFilters();
}

function applyFilters() {
  const grid = document.getElementById('camera-grid');
  const count = document.getElementById('camera-count');
  if (!grid) return;

  const visibleIds = getFilteredIds();
  let visibleCount = 0;

  grid.querySelectorAll('.camera-cell').forEach(cell => {
    const id = parseInt(cell.dataset.id);
    const show = visibleIds.has(id);
    cell.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  const cols = visibleCount > 0 ? Math.ceil(Math.sqrt(visibleCount * (16/9))) : 1;
  const rows = visibleCount > 0 ? Math.ceil(visibleCount / cols) : 1;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  if (count) count.textContent = `${visibleCount} / ${cameras.length} kamera`;
}

function initLazyLoad() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          delete iframe.dataset.src;
        }
        observer.unobserve(iframe);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('.camera-cell iframe[data-src]').forEach(iframe => {
    observer.observe(iframe);
  });
}

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
document.getElementById('search')?.addEventListener('input', debounce((e) => {
  searchQuery = e.target.value;
  applyFilters();
}));

document.getElementById('category-filter')?.addEventListener('change', (e) => {
  selectedCategory = e.target.value;
  applyFilters();
});

document.getElementById('status-filter')?.addEventListener('change', (e) => {
  selectedStatus = e.target.value;
  applyFilters();
});

document.getElementById('logout-btn')?.addEventListener('click', logout);

renderCategoryFilters();
renderStatusFilters();
loadCameras();
loadUserInfo();

// Auto-hide filter bar after 3 seconds
let filterTimeout = null;

function showFilterBar() {
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    filterBar.classList.remove('hidden');
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      filterBar.classList.add('hidden');
    }, 3000);
  }
}

function keepFilterBarVisible() {
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    filterBar.classList.remove('hidden');
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      filterBar.classList.add('hidden');
    }, 3000);
  }
}

document.querySelector('.filter-bar')?.addEventListener('mouseenter', showFilterBar);
document.querySelector('.monitoring-container')?.addEventListener('mousemove', showFilterBar);
document.getElementById('search')?.addEventListener('input', keepFilterBarVisible);
document.getElementById('category-filter')?.addEventListener('change', keepFilterBarVisible);
document.getElementById('status-filter')?.addEventListener('change', keepFilterBarVisible);

showFilterBar();
