const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const base = process.env.ARCADE_TEST_URL || 'http://127.0.0.1:8000';
const previews = path.resolve(__dirname, '../design/previews/stack-shell');
const fixed = new Date('2026-10-19T03:00:00Z');
const centre = r => r.x + r.width / 2;

async function checkLayout(page, width) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  for (const selector of ['.br-game-heading', '.quick-stats', '.br-mode-tabs', '#game-progress', '#game-panel']) {
    assert.ok(Math.abs(centre(await page.locator(selector).boundingBox()) - width / 2) < 1, `${selector} centred at ${width}`);
  }
  const head = await page.locator('.br-game-heading').boundingBox();
  const reset = await page.locator('.daily-reset-card').boundingBox();
  const modes = await page.locator('.br-mode-tabs').boundingBox();
  const board = await page.locator('#game-panel').boundingBox();
  assert.ok(reset.x >= 0 && reset.x + reset.width <= width);
  if (width >= 1100) {
    assert.equal(reset.y, head.y);
    assert.ok(reset.x >= board.x + board.width + 23);
  } else assert.ok(reset.y + reset.height <= modes.y);
  for (const selector of ['.br-game-title-group', '.quick-stats', '.br-game-tools']) {
    const box = await page.locator(selector).boundingBox();
    assert.ok(Math.abs(box.y + box.height / 2 - head.y - head.height / 2) < 1, 'Header stays in one row');
  }
  assert.equal(await page.locator('.daily-reset-card [data-daily-countdown]').innerText(), '10:00:00');
  assert.equal(await page.locator('.daily-reset-card').count(), 1);
}

(async () => {
  fs.mkdirSync(previews, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.ARCADE_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 650, 768, 1024, 1100, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      // Start before the freeze point: clock installation itself can advance time.
      await page.clock.install({ time: new Date(fixed.getTime() - 60_000) });
      await page.clock.pauseAt(fixed);
      await page.goto(`${base}/games/stack-up/index.html`);
      await checkLayout(page, width);
      assert.equal(await page.locator('#mode-unlimited').innerText(), 'Unlimited');
      assert.equal(await page.locator('#game-panel').getAttribute('aria-labelledby'), 'mode-daily');
      if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(previews, `${width}-ready.png`), fullPage: true });

      await page.locator('#game-menu-toggle').click();
      assert.ok(await page.locator('#game-menu').isVisible());
      assert.ok(await page.locator('main').evaluate(e => e.inert));
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'game-menu-toggle');
      for (const [button, dialog] of [['help-open', 'help-dialog'], ['stats-open', 'stats-dialog']]) {
        await page.locator(`#${button}`).click();
        assert.ok(await page.locator(`#${dialog}`).isVisible());
        assert.ok(await page.locator('main').evaluate(e => e.inert));
        await page.locator(`#${dialog} [data-close]`).first().press('Shift+Tab');
        assert.ok(await page.locator(`#${dialog} [data-close]`).last().evaluate(e => e === document.activeElement));
        if (width === 1440) await page.screenshot({ path: path.join(previews, `${dialog}.png`), fullPage: true });
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(() => document.activeElement.id), button);
        assert.equal(await page.locator('main').evaluate(e => e.inert), false);
      }

      await page.locator('[data-mode=daily]').click();
      await checkLayout(page, width);
      assert.equal(await page.locator('.sort-card').count(), 5);
      const fill = await page.locator('#timer-fill').boundingBox();
      assert.ok(fill.width > 30 && fill.height > 0, 'Real timer bar visible');
      if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(previews, `${width}-playing.png`), fullPage: true });
      const saved = await page.evaluate(() => localStorage.getItem('break-room:stack-up:daily:2026-10-19'));
      await page.locator('#mode-daily').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#game-panel').getAttribute('aria-labelledby'), 'mode-unlimited');
      assert.equal(await page.locator('#mode-unlimited').getAttribute('aria-selected'), 'true');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'mode-unlimited');
      await page.keyboard.press('Home');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'mode-daily');
      assert.equal(await page.evaluate(() => localStorage.getItem('break-room:stack-up:daily:2026-10-19')), saved);
      assert.equal(await page.locator('#timer').innerText(), '01:30');

      // An existing completed record must populate the new header and survive a refresh.
      // Use the engine's saved snapshot shape; no migration, reset flag or new storage key.
      await page.evaluate(() => {
        const key = 'break-room:stack-up:daily:2026-10-19', run = JSON.parse(localStorage.getItem(key));
        Object.assign(run, { round: 4, score: 3100, streak: 5, status: 'complete', results: Array.from({length: 5}, () => ({correct: true, points: 620, seconds: 90, mistakes: 0})) });
        localStorage.setItem(key, JSON.stringify(run));
      });
      await page.reload();
      assert.ok(await page.locator('#daily-summary').isVisible());
      assert.equal(await page.locator('#record-best').innerText(), '100');
      assert.equal(await page.locator('#record-streak').innerText(), '1');
      assert.equal(await page.locator('#record-played').innerText(), '1');
      assert.equal(await page.locator('#stat-best').innerText(), '100');
      await checkLayout(page, width);
      assert.ok(await page.locator('#record-best').evaluate(e => {
        const range = document.createRange(); range.selectNodeContents(e);
        return range.getBoundingClientRect().width <= e.parentElement.clientWidth - 4;
      }), 'Full real best score fits its header box');
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`PASS ${width}px: canonical centred shell, reset, header, menus/popups, real modes, saved state and score fit.`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
