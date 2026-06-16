let cameras = [];
let searchQuery = '';
let selectedCategory = '';
let selectedStatus = '';

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
          <div class="camera-placeholder">
            <img src="/thumbnail-offline.svg" alt="Thumbnail ${escapeHtml(c.name)}" onerror="this.style.display='none'" />
            <div class="camera-placeholder-info">
              <p class="camera-placeholder-name">${escapeHtml(c.name)}</p>
              <span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(c.status)}</span>
            </div>
          </div>
          <iframe data-src="https://www.youtube.com/embed/${escapeHtml(c.stream_id)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
                  allow="autoplay; encrypted-media"
                  title="${escapeHtml(c.name)}"
                  loading="lazy"></iframe>
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

  initLazyLoad();
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

document.querySelector('.filter-bar')?.addEventListener('mouseenter', showFilterBar);
document.querySelector('.monitoring-container')?.addEventListener('mousemove', showFilterBar);

showFilterBar();
