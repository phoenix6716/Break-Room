const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.ARCADE_TEST_URL || 'http://127.0.0.1:8000';
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.ARCADE_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
 try {
  for (const width of [390, 1440]) {
   const context = await browser.newContext({ viewport: { width, height: 900 } });
   const page = await context.newPage();
   for (const route of ['friends.html', 'profile.html']) {
    await page.goto(base + '/' + route);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    for (const link of await nav.locator('a').all()) {
     const current = await link.getAttribute('aria-current') === 'page';
     await link.hover();
     const state = await link.evaluate(el => {
      const s = getComputedStyle(el);
      return { background: s.backgroundColor, color: s.color, underline: s.borderBottomColor };
     });
     assert.equal(state.color, 'rgb(23, 38, 58)', 'Navigation text stays navy');
     if (!current) assert.equal(state.background, 'rgb(249, 226, 167)', 'Navigation hover uses warm yellow');
     else assert.equal(state.underline, 'rgb(238, 101, 87)', 'Current-page coral marker survives hover');
     await link.focus();
     await page.keyboard.press('Tab');
     await page.keyboard.press('Shift+Tab');
     assert(await link.evaluate(el => el.matches(':focus-visible')), 'Keyboard focus is visible');
     assert.equal(await link.evaluate(el => getComputedStyle(el).outlineColor), 'rgb(238, 101, 87)', 'Keyboard focus stays coral');
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
   }
   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Friends', exact: true }).click();
   await page.waitForURL('**/friends.html');
   await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Profile', exact: true }).click();
   await page.waitForURL('**/profile.html');
   await context.close();
   console.log('PASS navigation theme: hover, active marker, keyboard focus and Friends/Profile links at ' + width + 'px');
  }
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
