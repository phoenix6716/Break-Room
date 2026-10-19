/* Run against the local static server: BASE_URL=http://127.0.0.1:8026 node tests/game-template.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:8026';
const root = path.resolve(__dirname, '..');
const previews = path.join(root, 'design/previews/game-template');

(async () => {
  fs.mkdirSync(previews, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 768, 1100, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(`${base}/games/_template/index.html`);
      await page.locator('[data-daily-countdown]').filter({ hasText: /^\d\d:\d\d:\d\d$/ }).waitFor();
      assert.equal(await page.locator('#game-title').textContent(), '[TITLE]');
      assert.equal(await page.locator('#engine-slot h2').textContent(), '[GAME AREA]');
      assert.equal(await page.locator('[data-summary-stat]').allTextContents().then(a => a.join('')), '———');
      const boxes = await page.evaluate(() => {
        const box = selector => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, right: r.right, bottom: r.bottom, centre: r.x + r.width / 2 };
        };
        return { overflow: document.documentElement.scrollWidth > innerWidth,
          header: box('.br-game-heading'), stats: box('.quick-stats'), modes: box('.br-mode-tabs'),
          board: box('.br-game-board'), progress: box('.br-game-progress'), sound: box('.br-audio-slot'), reset: box('.br-reset-rail') };
      });
      assert.equal(boxes.overflow, false, `${width}: horizontal overflow`);
      for (const key of ['header', 'stats', 'modes', 'board', 'progress', 'sound']) {
        assert.ok(Math.abs(boxes[key].centre - width / 2) < 1, `${width}: ${key} centred`);
      }
      if (width >= 1100) {
        assert.ok(boxes.reset.x >= boxes.board.right + 23);
        assert.equal(boxes.reset.y, boxes.header.y);
      } else {
        assert.ok(boxes.reset.bottom <= boxes.modes.y);
        assert.ok(boxes.reset.right <= width);
      }
      await page.evaluate(() => {
        window.observedModes = [];
        document.addEventListener('break-room:mode-change', e => observedModes.push(e.detail.mode));
      });
      await page.locator('#mode-unlimited').click();
      assert.equal(await page.locator('#game-panel').getAttribute('aria-labelledby'), 'mode-unlimited');
      assert.match(await page.locator('#mode-description').textContent(), /^Unlimited/);
      await page.locator('#mode-unlimited').press('ArrowLeft');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'mode-daily');
      await page.locator('#mode-daily').press('End');
      await page.locator('#mode-unlimited').press('Home');
      assert.deepEqual(await page.evaluate(() => observedModes), ['unlimited', 'daily', 'unlimited', 'daily']);

      await page.locator('#game-menu-toggle').click();
      assert.equal(await page.locator('#game-menu').getAttribute('aria-hidden'), 'false');
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'game-menu-toggle');

      for (const [button, popup] of [['help-popup-open', 'help-popup'], ['stats-popup-open', 'stats-popup']]) {
        await page.locator(`#${button}`).click();
        assert.equal(await page.locator(`#${popup}`).isVisible(), true);
        assert.equal(await page.locator('main').evaluate(e => e.inert), true);
        const controls = page.locator(`#${popup} [data-popup-close]`);
        await controls.first().press('Shift+Tab');
        assert.equal(await controls.last().evaluate(e => e === document.activeElement), true);
        await controls.last().press('Tab');
        assert.equal(await controls.first().evaluate(e => e === document.activeElement), true);
        if (width === 1440) await page.screenshot({ path: path.join(previews, `${popup}.png`), fullPage: true });
        await page.keyboard.press('Escape');
        assert.equal(await page.locator(`#${popup}`).isVisible(), false);
        assert.equal(await page.evaluate(() => document.activeElement.id), button);
        assert.equal(await page.locator('main').evaluate(e => e.inert), false);
      }
      await page.locator('#help-popup-open').click();
      await page.locator('#help-popup .popup-done').click();
      assert.equal(await page.locator('#help-popup').isVisible(), false);
      await page.locator('#stats-popup-open').click();
      await page.locator('#stats-popup').click({ position: { x: 2, y: 2 } });
      assert.equal(await page.locator('#stats-popup').isVisible(), false);
      assert.equal(await page.evaluate(() => localStorage.length), 0, 'Template must not invent saved progress');
      assert.deepEqual(errors, []);
      if ([390, 1440].includes(width)) {
        await page.screenshot({ path: path.join(previews, width === 390 ? 'mobile.png' : 'desktop.png'), fullPage: true });
      }
      // Check downloaded-copy links and local dependencies without relying on server directory indexes.
      for (const url of await page.locator('[href],[src]').evaluateAll(elements => elements.map(e => e.getAttribute('href') || e.getAttribute('src')))) {
        if (/^(https?:|data:|#)/.test(url)) continue;
        const target = path.resolve(root, 'games/_template', url.split('#')[0]);
        assert.ok(fs.existsSync(target), `Missing template dependency/link: ${url}`);
        if (!path.extname(target)) assert.fail(`Use an explicit file link: ${url}`);
      }
      await page.close();
      console.log(`Template passed at ${width}px`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
