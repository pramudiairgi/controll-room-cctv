/* ============================================================
   MONITORING — Camera grid + auto-hide navbar
   ============================================================ */

let cameras = [];
let searchQuery = '';
let selectedCategory = '';
let selectedStatus = '';
let gridRendered = false;
let fullscreenCameraId = null;

// ── Load data ──────────────────────────────────────────────
async function loadCameras() {
  try {
    const { data } = await apiFetch('/cctvs');
    cameras = data;
    if (!gridRendered) {
      buildGrid();
      gridRendered = true;
    }
    applyFilters();
  } catch {
    alert('Failed to load camera data.');
  }
}

// ── Filter logic ───────────────────────────────────────────
function getFilteredIds() {
  let filtered = cameras;

  if (selectedStatus) {
    filtered = filtered.filter(c => c.status === selectedStatus);
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

// ── Build grid (once) ──────────────────────────────────────
function buildGrid() {
  const grid = document.getElementById('camera-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  cameras.forEach(c => {
    const cell = document.createElement('div');
    cell.className = 'camera-cell';
    cell.dataset.id = c.id;

    if (c.stream_id && isValidYouTubeId(c.stream_id)) {
      const iframe = document.createElement('iframe');
      iframe.dataset.src = `https://www.youtube-nocookie.com/embed/${escapeHtml(c.stream_id)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&fs=0&cc_load_policy=0&playsinline=1&disablekb=1&title=0`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.title = c.name;
      cell.appendChild(iframe);

      const overlay = document.createElement('div');
      overlay.className = 'yt-overlay';
      cell.appendChild(overlay);
    } else {
      cell.classList.add('camera-placeholder');
      cell.innerHTML = `
        <img src="/thumbnail-offline.svg" alt="${escapeHtml(c.name)}" onerror="this.style.display='none'" />
        <div class="camera-placeholder-info">
          <p class="camera-placeholder-name">${escapeHtml(c.name)}</p>
          <span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(c.status)}</span>
        </div>
      `;
    }

    fragment.appendChild(cell);
  });

  grid.replaceChildren(fragment);
  lazyLoad();
}

function enterFullscreen(cameraId) {
  const cell = document.querySelector(`.camera-cell[data-id="${cameraId}"]`);
  if (!cell) return;
  fullscreenCameraId = cameraId;
  cell.classList.add('fullscreen');
  document.getElementById('navbar')?.classList.add('hidden');
}

function exitFullscreen() {
  if (fullscreenCameraId === null) return;
  const cell = document.querySelector(`.camera-cell[data-id="${fullscreenCameraId}"]`);
  if (cell) cell.classList.remove('fullscreen');
  fullscreenCameraId = null;
  showNavbar();
}

// ── Apply filters (show/hide only, no re-render) ───────────
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

  // Calculate optimal grid layout — exact 16:9 cells
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetAspect = 16 / 9;
  const isMobile = vw <= 768;
  const maxCols = isMobile ? 2 : 4;

  let cols, rows;
  if (visibleCount <= 1) {
    cols = 1;
    rows = 1;
  } else {
    // Find layout where cells are closest to 16:9
    let bestDiff = Infinity;
    cols = 1;
    rows = visibleCount;

    for (let c = 1; c <= Math.min(visibleCount, maxCols); c++) {
      const r = Math.ceil(visibleCount / c);
      const cellW = vw / c;
      const cellH = vh / r;
      const aspect = cellW / cellH;
      const diff = Math.abs(aspect - targetAspect);

      if (diff < bestDiff) {
        bestDiff = diff;
        cols = c;
        rows = r;
      }
    }
  }

  // Use exact 16:9 cell dimensions
  const cellW = vw / cols;
  const cellH = cellW * (9 / 16);

  grid.style.gridTemplateColumns = `repeat(${cols}, ${cellW}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${cellH}px)`;

  if (count) count.textContent = `${visibleCount} / ${cameras.length} cameras`;
}

// ── Lazy-load iframes ──────────────────────────────────────
function lazyLoad() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.src) {
          el.src = el.dataset.src;
          delete el.dataset.src;
        }
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '300px' });

  document.querySelectorAll('.camera-cell iframe[data-src]').forEach(el => {
    observer.observe(el);
  });
}

// ── Filter dropdowns ───────────────────────────────────────
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

// ── Auth ───────────────────────────────────────────────────
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
    // Ignore
  }
}

// ── Auto-hide navbar ───────────────────────────────────────
const NAVBAR_HIDE_DELAY = 3000;
let navbarTimeout = null;

function showNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.classList.remove('hidden');
  clearTimeout(navbarTimeout);
  navbarTimeout = setTimeout(() => navbar.classList.add('hidden'), NAVBAR_HIDE_DELAY);
}

// ── Event listeners ────────────────────────────────────────
document.getElementById('search')?.addEventListener('input', debounce(e => {
  searchQuery = e.target.value;
  applyFilters();
}));

document.getElementById('category-filter')?.addEventListener('change', e => {
  selectedCategory = e.target.value;
  applyFilters();
});

document.getElementById('status-filter')?.addEventListener('change', e => {
  selectedStatus = e.target.value;
  applyFilters();
});

document.getElementById('logout-btn')?.addEventListener('click', logout);

// Keep navbar visible while interacting
document.getElementById('navbar')?.addEventListener('mouseenter', showNavbar);
document.addEventListener('mousemove', showNavbar);
document.getElementById('search')?.addEventListener('focus', showNavbar);
document.getElementById('category-filter')?.addEventListener('focus', showNavbar);
document.getElementById('status-filter')?.addEventListener('focus', showNavbar);
document.getElementById('search')?.addEventListener('input', showNavbar);
document.getElementById('category-filter')?.addEventListener('change', showNavbar);
document.getElementById('status-filter')?.addEventListener('change', showNavbar);

// ── Fullscreen click & ESC ──────────────────────────────────
document.getElementById('camera-grid')?.addEventListener('click', e => {
  const cell = e.target.closest('.camera-cell');
  if (!cell) return;
  if (fullscreenCameraId === null) {
    enterFullscreen(parseInt(cell.dataset.id));
  } else {
    exitFullscreen();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && fullscreenCameraId !== null) {
    exitFullscreen();
  }
});

// ── Init ───────────────────────────────────────────────────
renderCategoryFilters();
renderStatusFilters();
loadCameras();
loadUserInfo();
showNavbar();

window.addEventListener('resize', debounce(applyFilters, 150));
