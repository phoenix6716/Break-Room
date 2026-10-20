/* Verify every generated image through the real game, not just file existence. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const base = process.env.ARCADE_TEST_URL || 'http://127.0.0.1:8000';
const assetRoot = path.resolve(__dirname, '../games/lowball/engine/icons/generated');
(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(assetRoot, 'manifest.json'), 'utf8'));
  const entries = [...Object.values(manifest.items), ...Object.values(manifest.utilities)];
  assert.equal(Object.keys(manifest.items).length, 100);
  assert.equal(Object.keys(manifest.utilities).length, 9);
  const hashes = new Set(entries.map(entry => {
    const data = fs.readFileSync(path.join(assetRoot, entry.file));
    assert.equal(data.subarray(1, 4).toString(), 'PNG');
    return crypto.createHash('sha256').update(data).digest('hex');
  }));
  assert.equal(hashes.size, 109, 'Every image must be an individual asset');
  const browser = await chromium.launch({executablePath: process.env.ARCADE_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox']});
  try {
    const page = await browser.newPage({reducedMotion: 'reduce'});
    const errors = [], failed = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {if(response.status() >= 400) failed.push(response.url());});
    await page.addInitScript(() => localStorage.setItem('pc_help_seen', '1'));
    await page.goto(`${base}/games/lowball/engine/index.html`);
    assert.deepEqual(await page.evaluate(() => ITEMS.map(item => item.name)), Object.keys(manifest.items));
    for (let index = 0; index < 100; index++) {
      const expected = await page.evaluate(index => {
        mode = 'unlimited'; deck = ITEMS.slice(); deckIndex = index; showItem();
        return {name: currentItem.name, source: LOWBALL_ART.source(currentItem)};
      }, index);
      const img = page.locator('#itemEmoji img');
      await img.evaluate(image => image.decode());
      assert.equal(await img.getAttribute('src'), expected.source, expected.name);
      assert.equal(await page.locator('#itemName').innerText(), expected.name);
      assert.deepEqual(await img.evaluate(image => [image.naturalWidth,image.naturalHeight]), [192,192]);
      assert.match(expected.source, /^icons\/generated\/.+\.png$/);
      assert.equal(await page.locator('#itemEmoji svg').count(), 0);
    }
    // Decode utilities that may be hidden (e.g. the lock when Unlimited is free).
    await page.evaluate(async () => {
      await Promise.all(Object.keys(LOWBALL_ART.utilities).map(async name => {
        const image = new Image(); image.src = LOWBALL_ART.source(name); await image.decode();
        if (image.naturalWidth !== 192 || image.naturalHeight !== 192) throw Error(name);
      }));
    });
    for (const [score, colour] of [[100,'#b8d957'],[80,'#f9d883'],[50,'#e9a16a'],[0,'#ee8578']]) {
      await page.evaluate(score => {document.getElementById('squares').innerHTML=squaresHTMLForScore(score);},score);
      assert.equal(await page.locator('#squares svg.gem').count(), 5);
      assert.equal(await page.locator('#squares img').count(), 0);
      assert.equal(await page.locator('#squares svg path').first().getAttribute('fill'), colour);
      // Saved completions and freshly finished rounds share the same gems.
      await page.evaluate(score => {document.getElementById('finalSquares').innerHTML=squaresHTMLForScore(score);},score);
      assert.equal(await page.locator('#finalSquares svg.gem').count(), 5);
      assert.equal(await page.locator('#finalSquares img').count(), 0);
      assert.equal(await page.locator('#finalSquares svg path').first().getAttribute('fill'), colour);
    }
    await page.locator('#soundBtn').click();
    assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'), 'false');
    assert.match(await page.locator('#soundBtn img').getAttribute('src'), /sound-off\.png$/);
    await page.reload();
    assert.match(await page.locator('#soundBtn img').getAttribute('src'), /sound-off\.png$/);
    await page.locator('#soundBtn').click();
    assert.match(await page.locator('#soundBtn img').getAttribute('src'), /sound-on\.png$/);
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(() => renderResult(currentItem.prices[country], country, false));
      assert.equal(await page.locator('#resultScore').innerText(), '100');
      assert.match(await page.locator('#resultFacts').innerText(), /Your guess[\s\S]*Actual price[\s\S]*Spot on/i);
      assert.equal(await page.locator('#squares svg.gem').count(), 5);
      assert(await page.locator('.result-note').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)<=12));
      assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
      await page.evaluate(()=>showItem());
      await page.locator('#itemEmoji img').evaluate(image=>image.decode());
      assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(failed, []);
    console.log('PASS: all 100 item PNGs and 5 utility PNGs decode; 109 archived image assets remain unique; all four faceted gem tiers on round/final screens; sound controls and reload; score/play layouts at four widths.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
