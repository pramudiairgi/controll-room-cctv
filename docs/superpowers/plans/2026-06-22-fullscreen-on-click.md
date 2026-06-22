# Fullscreen on Click — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CSS fullscreen on click to monitoring mode — click a camera cell to expand it to viewport, click again to return.

**Architecture:** CSS `position: fixed` approach — no Fullscreen API, no animation. Single state variable tracks which cell is fullscreen. Event delegation on grid handles clicks. ESC key exits fullscreen.

**Tech Stack:** Vanilla HTML/CSS/JS (no framework, no build step)

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `public/monitoring/monitoring.css` | Modify | Add `.camera-cell.fullscreen` rule |
| `public/monitoring/monitoring.js` | Modify | Add state, functions, event listeners |
| `public/monitoring/index.html` | No change | — |

---

### Task 1: Add CSS fullscreen rule

**Files:**
- Modify: `public/monitoring/monitoring.css:26` (after `.camera-cell` block)

- [ ] **Step 1: Add fullscreen CSS class**

Add after the `.camera-cell` rule block (after line 26):

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

- [ ] **Step 2: Verify CSS is syntactically valid**

Run: `grep -A 7 "\.camera-cell\.fullscreen" public/monitoring/monitoring.css`
Expected: The 7-line block above appears correctly.

- [ ] **Step 3: Commit**

```bash
git add public/monitoring/monitoring.css
git commit -m "feat(monitoring): add CSS fullscreen class for camera cell"
```

---

### Task 2: Add JS state and fullscreen functions

**Files:**
- Modify: `public/monitoring/monitoring.js:9` (after `let gridRendered = false;`)
- Modify: `public/monitoring/monitoring.js:88` (after `buildGrid()` function)

- [ ] **Step 1: Add state variable**

Add after line 9 (`let gridRendered = false;`):

```js
let fullscreenCameraId = null;
```

- [ ] **Step 2: Add enterFullscreen function**

Add after the `buildGrid()` function (after line 88):

```js
function enterFullscreen(cameraId) {
  const cell = document.querySelector(`.camera-cell[data-id="${cameraId}"]`);
  if (!cell) return;
  fullscreenCameraId = cameraId;
  cell.classList.add('fullscreen');
  document.getElementById('navbar')?.classList.add('hidden');
}
```

- [ ] **Step 3: Add exitFullscreen function**

Add immediately after `enterFullscreen`:

```js
function exitFullscreen() {
  if (fullscreenCameraId === null) return;
  const cell = document.querySelector(`.camera-cell[data-id="${fullscreenCameraId}"]`);
  if (cell) cell.classList.remove('fullscreen');
  fullscreenCameraId = null;
  showNavbar();
}
```

- [ ] **Step 4: Verify JS syntax**

Run: `node --check public/monitoring/monitoring.js`
Expected: No output (no syntax errors)

- [ ] **Step 5: Commit**

```bash
git add public/monitoring/monitoring.js
git commit -m "feat(monitoring): add fullscreen state and enter/exit functions"
```

---

### Task 3: Add event listeners

**Files:**
- Modify: `public/monitoring/monitoring.js:246` (after existing event listeners, before init)

- [ ] **Step 1: Add click event delegation on grid**

Add after the last event listener block (after line 246, before `// ── Init`):

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

- [ ] **Step 2: Add ESC key listener**

Add immediately after the grid click listener:

```js
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && fullscreenCameraId !== null) {
    exitFullscreen();
  }
});
```

- [ ] **Step 3: Verify JS syntax**

Run: `node --check public/monitoring/monitoring.js`
Expected: No output (no syntax errors)

- [ ] **Step 4: Commit**

```bash
git add public/monitoring/monitoring.js
git commit -m "feat(monitoring): add click and ESC key listeners for fullscreen"
```

---

### Task 4: Manual verification

- [ ] **Step 1: Open monitoring page in browser**

Navigate to the monitoring page. Verify the camera grid loads as before.

- [ ] **Step 2: Test enter fullscreen**

Click on any camera cell. Verify:
- Cell expands to fill entire viewport (100vw x 100vh)
- Cell is positioned fixed, covering all other cells
- Navbar is hidden
- Cursor shows as pointer

- [ ] **Step 3: Test exit fullscreen via click**

While in fullscreen, click anywhere on the cell. Verify:
- Cell returns to its grid position
- Grid layout is restored
- Navbar reappears

- [ ] **Step 4: Test exit fullscreen via ESC**

Enter fullscreen again, then press ESC. Verify:
- Same behavior as click exit

- [ ] **Step 5: Test with YouTube camera**

Click a camera with a valid YouTube stream. Verify:
- YouTube iframe plays in fullscreen
- Click on the fullscreen cell exits (iframe has pointer-events: none, so clicks reach the cell)

- [ ] **Step 6: Final commit (if any fixes needed)**

If any issues were found and fixed during testing:
```bash
git add public/monitoring/monitoring.js public/monitoring/monitoring.css
git commit -m "fix(monitoring): fullscreen on click adjustments from testing"
```
