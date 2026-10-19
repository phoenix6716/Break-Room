/* Code artwork must cover the full item pool and remain usable without image files. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.ARCADE_TEST_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({executablePath: '/usr/bin/chromium', args: ['--no-sandbox']});
  try {
    const page = await browser.newPage({reducedMotion: 'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => localStorage.setItem('pc_help_seen', '1'));
    await page.route('**/*.png', route => route.abort());
    await page.goto(`${base}/games/lowball/engine/index.html`);
    const audit = await page.evaluate(() => {
      const malformed = ITEMS.filter(item => {
        const host = document.createElement('div');
        host.innerHTML = LOWBALL_ART.markup(item);
        return !host.querySelector('svg path,svg rect,svg circle') || host.querySelector('image,img,script');
      }).map(item => item.name);
      return {malformed, fallback: LOWBALL_ART.kind({name: 'New product without artwork'}), peanut: LOWBALL_ART.kind({name: 'Peanut butter'})};
    });
    assert.deepEqual(audit, {malformed: [], fallback: 'parcel', peanut: 'jar'});
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({width, height: 1000});
      await page.evaluate(() => renderResult(currentItem.prices[country], country, false));
      assert.equal(await page.locator('#resultScore').innerText(), '100');
      assert.match(await page.locator('#resultFacts').innerText(), /Your guess[\s\S]*Actual price[\s\S]*Spot on/i);
      assert.equal(await page.locator('#squares svg').count(), 5);
      assert(await page.locator('.result-note').evaluate(el => parseFloat(getComputedStyle(el).fontSize) <= 12));
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
      await page.evaluate(() => showItem());
      assert.equal(await page.locator('#itemEmoji svg').count(), 1);
    }
    assert.deepEqual(errors, []);
    console.log('Lowball: all item artwork renders with PNG requests blocked; score receipts fit four widths.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
