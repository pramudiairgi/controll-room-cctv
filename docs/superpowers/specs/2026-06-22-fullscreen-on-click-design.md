# Design Spec: Fullscreen on Click — Monitoring Mode

**Date:** 2026-06-22
**Status:** Approved
**Scope:** Monitoring mode camera grid

## Summary

Add CSS fullscreen feature to monitoring mode. Click a camera cell → it expands to fill the entire viewport. Click again anywhere → returns to grid. No animation, instant snap.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Fullscreen method | CSS `position: fixed` + `z-index` | No browser permission popup, predictable YouTube iframe behavior, grid stays in DOM |
| Exit trigger | Click anywhere on the cell | Simplest UX, no need to hunt for close button |
| Animation | None | Instant response, no distraction |
| Navbar behavior | Hide in fullscreen, show on exit | Clean view, no clutter |
| ESC key | Supported | Standard keyboard shortcut, natural fallback |
| Event handling | Event delegation on grid | Single listener, no per-cell setup |

## Changes

### `public/monitoring/monitoring.js`

**New state variable:**
```js
let fullscreenCameraId = null; // null = grid mode, number = fullscreen mode
```

**New functions:**

```js
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
```

**New event listeners:**

Event delegation on grid:
```js
document.getElementById('camera-grid')?.addEventListener('click', e => {
  const cell = e.target.closest('.camera-cell');
  if (!cell) return;
  if (fullscreenCameraId === null) {
    enterFullscreen(parseInt(cell.dataset.id));
  } else {
    exitFullscreen();
  }
});
```

Keyboard ESC:
```js
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && fullscreenCameraId !== null) {
    exitFullscreen();
  }
});
```

### `public/monitoring/monitoring.css`

```css
.camera-cell.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  cursor: pointer;
}
```

### `public/monitoring/index.html`

No changes required.

## How It Works

1. **Grid mode** (default): All cameras displayed in 16:9 grid layout
2. **Click a cell**: `enterFullscreen(id)` adds `.fullscreen` class → cell becomes `position: fixed; inset: 0` covering entire viewport. Navbar hides.
3. **Click again**: `exitFullscreen()` removes `.fullscreen` class → cell returns to its grid position. Navbar reappears via `showNavbar()`.
4. **ESC key**: Same as click — calls `exitFullscreen()`.

## Edge Cases

- **YouTube iframe clicks**: Iframe has `pointer-events: none` (existing CSS), so clicks always hit the cell element, not YouTube.
- **Filtering while fullscreen**: Not affected — `applyFilters()` only changes `display` property on cells, fullscreen cell stays fullscreen.
- **Window resize while fullscreen**: No issue — fullscreen cell uses `100vw/100vh` which adapts automatically.

## Total Impact

~15 new lines of code across 2 files. Zero HTML changes. Zero dependencies.
