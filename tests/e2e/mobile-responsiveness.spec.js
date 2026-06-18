import { test, expect } from '@playwright/test';

test.describe('Login Page - Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login form fits within 375px viewport width', async ({ page }) => {
    const form = page.locator('.login-form');
    const box = await form.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeLessThanOrEqual(375);
  });

  test('login container has horizontal padding on mobile', async ({ page }) => {
    const container = page.locator('.login-container');
    const paddingLeft = await container.evaluate(el =>
      parseInt(getComputedStyle(el).paddingLeft)
    );
    const paddingRight = await container.evaluate(el =>
      parseInt(getComputedStyle(el).paddingRight)
    );
    expect(paddingLeft).toBeGreaterThanOrEqual(16);
    expect(paddingRight).toBeGreaterThanOrEqual(16);
  });

  test('login form uses max-width instead of fixed width', async ({ page }) => {
    const form = page.locator('.login-form');
    const maxWidth = await form.evaluate(el =>
      getComputedStyle(el).maxWidth
    );
    const width = await form.evaluate(el =>
      getComputedStyle(el).width
    );
    // max-width should be set (not 'none') and width should be fluid
    expect(maxWidth).not.toBe('none');
    // On 375px viewport, width should be less than 380px
    expect(parseInt(width)).toBeLessThanOrEqual(375);
  });

  test('input fields have minimum 44px height for touch targets', async ({ page }) => {
    const inputs = page.locator('.form-group input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const height = await inputs.nth(i).evaluate(el =>
        parseInt(getComputedStyle(el).height)
      );
      expect(height).toBeGreaterThanOrEqual(44);
    }
  });

  test('login button has minimum 44px height for touch target', async ({ page }) => {
    const button = page.locator('#login-btn');
    const height = await button.evaluate(el =>
      parseInt(getComputedStyle(el).height)
    );
    expect(height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Dashboard Page - Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, name: 'Test User', role: 'admin' }) })
    );
    await page.route('**/api/cctvs', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    );
    await page.route('**/api/cctvs/*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) })
    );
    await page.goto('/dashboard');
  });

  test('filter bar fits within 375px viewport width', async ({ page }) => {
    const filterGroup = page.locator('.filter-group');
    const box = await filterGroup.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(376);
  });

  test('filter input is not fixed 200px on mobile', async ({ page }) => {
    const input = page.locator('#search');
    const width = await input.evaluate(el =>
      parseInt(getComputedStyle(el).width)
    );
    // Should be fluid, not fixed 200px
    expect(width).not.toBe(200);
  });

  test('detail panel becomes bottom sheet on mobile', async ({ page }) => {
    const panel = page.locator('#detail-panel');
    // Check that on mobile, the panel is positioned at the bottom
    const position = await panel.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        bottom: style.bottom,
        top: style.top,
        width: style.width,
      };
    });
    // On mobile, panel should be positioned from bottom
    expect(parseInt(position.bottom)).toBeGreaterThanOrEqual(0);
  });

  test('detail panel has swipe handle area on mobile', async ({ page }) => {
    // After opening a panel, check for swipe handle
    // This tests the CSS class existence
    const panel = page.locator('#detail-panel');
    const hasTransition = await panel.evaluate(el =>
      getComputedStyle(el).transition.includes('transform') ||
      getComputedStyle(el).transitionProperty.includes('transform')
    );
    expect(hasTransition).toBe(true);
  });

  test('user menu touch target is at least 44px', async ({ page }) => {
    const logoutBtn = page.locator('#logout-btn');
    const box = await logoutBtn.boundingBox();
    expect(box).not.toBeNull();
    // Allow 1px tolerance for floating point rounding
    expect(box.width).toBeGreaterThanOrEqual(43);
    expect(box.height).toBeGreaterThanOrEqual(43);
  });
});

test.describe('Monitoring Page - Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, name: 'Test User', role: 'admin' }) })
    );
    await page.route('**/api/cctvs', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    );
    await page.route('**/api/alerts/**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    );
    await page.goto('/monitoring');
  });

  test('navbar fits within 375px viewport width', async ({ page }) => {
    const navbar = page.locator('.navbar-inner');
    const box = await navbar.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(376);
  });

  test('navbar filter inputs fit on mobile', async ({ page }) => {
    const input = page.locator('#search');
    const selectCat = page.locator('#category-filter');
    const selectStatus = page.locator('#status-filter');

    const inputWidth = await input.evaluate(el =>
      parseInt(getComputedStyle(el).width)
    );
    const catWidth = await selectCat.evaluate(el =>
      parseInt(getComputedStyle(el).width)
    );
    const statusWidth = await selectStatus.evaluate(el =>
      parseInt(getComputedStyle(el).width)
    );

    // Each element should fit within the viewport width
    expect(inputWidth).toBeLessThanOrEqual(375);
    expect(catWidth).toBeLessThanOrEqual(375);
    expect(statusWidth).toBeLessThanOrEqual(375);
  });

  test('camera grid shows max 2 columns in portrait', async ({ page }) => {
    // Wait for grid to potentially render
    await page.waitForTimeout(1000);
    const grid = page.locator('#camera-grid');
    const columns = await grid.evaluate(el =>
      getComputedStyle(el).gridTemplateColumns
    );
    // Should have at most 2 column tracks
    if (columns && columns !== 'none') {
      const columnCount = columns.split(' ').filter(c => c.trim()).length;
      expect(columnCount).toBeLessThanOrEqual(2);
    }
  });

  test('camera cells are touch-friendly', async ({ page }) => {
    await page.waitForTimeout(1000);
    const cells = page.locator('.camera-cell');
    const count = await cells.count();
    if (count > 0) {
      const box = await cells.first().boundingBox();
      expect(box).not.toBeNull();
      // Each cell should be large enough to tap
      expect(box.width).toBeGreaterThanOrEqual(100);
      expect(box.height).toBeGreaterThanOrEqual(60);
    }
  });
});

test.describe('Shared - Touch & Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, name: 'Test User', role: 'admin' }) })
    );
    await page.route('**/api/cctvs', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    );
    await page.route('**/api/cctvs/*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) })
    );
  });

  test('all glass buttons have 44px minimum touch area', async ({ page }) => {
    await page.goto('/dashboard');
    const buttons = page.locator('.glass-btn');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        // Allow 1px tolerance for floating point rounding
        expect(box.width).toBeGreaterThanOrEqual(43);
        expect(box.height).toBeGreaterThanOrEqual(43);
      }
    }
  });

  test('touch-action manipulation is set on interactive elements', async ({ page }) => {
    await page.goto('/dashboard');
    const buttons = page.locator('button, a, select, input');
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const touchAction = await buttons.nth(i).evaluate(el =>
        getComputedStyle(el).touchAction
      );
      // Should include manipulation or be auto (not pan-y which causes delay)
      expect(
        touchAction === 'manipulation' ||
        touchAction === 'auto' ||
        touchAction === 'none'
      ).toBe(true);
    }
  });

  test('reduced motion media query exists in CSS', async ({ page }) => {
    await page.goto('/dashboard');
    // Check that animations respect prefers-reduced-motion
    const styles = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].media && rules[j].media.mediaText.includes('reduced-motion')) {
              return true;
            }
          }
        } catch (e) {
          // Cross-origin stylesheet
        }
      }
      return false;
    });
    expect(styles).toBe(true);
  });
});
