const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.env.ARCADE_TEST_URL || 'http://127.0.0.1:8000';

async function reorder(page, values) {
  for (let index = 0; index < values.length; index++) {
    const card = page.locator(`.sort-card[data-value="${values[index]}"]`);
    let at = await card.evaluate(e => [...e.parentElement.children].indexOf(e));
    while (at > index) { await card.locator('button').first().click(); at--; }
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.ARCADE_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      const fixed = new Date('2026-10-19T03:00:00Z');
      await page.clock.install({ time: fixed }); await page.clock.pauseAt(fixed);
      await page.goto(base + '/games/stack-up/index.html');
      for (const mode of ['daily', 'infinite']) {
        await page.locator(`[data-mode=${mode}]`).click();
        await reorder(page, [1, 3, 2, 4, 5]);
        await page.locator('#check-button').click();
        await page.locator('.sort-card').first().focus();
        const states = await page.locator('.sort-card').evaluateAll(cards => cards.map(card => ({
          correct: card.classList.contains('correct'), wrong: card.classList.contains('wrong'),
          background: getComputedStyle(card).backgroundColor, number: card.querySelector('.card-number').textContent,
          description: card.getAttribute('aria-description')
        })));
        assert.deepEqual(states.map(s => s.correct), [true, false, false, true, true]);
        assert.deepEqual(states.map(s => s.wrong), [false, true, true, false, false]);
        for (const state of states) {
          assert.equal(state.background, state.correct ? 'rgb(216, 236, 145)' : 'rgb(249, 213, 204)');
          assert.match(state.number, state.correct ? /✓/ : /✕/);
          assert.equal(state.description, state.correct ? 'Correct position' : 'Incorrect position');
        }
        assert.match(await page.locator('#message').innerText(), /3 of 5 cards in the right position/);
        const messageBox=await page.locator('#message').boundingBox(), buttonBox=await page.locator('#check-button').boundingBox();
        assert.ok(width<=650?messageBox.y+messageBox.height<=buttonBox.y:messageBox.x+messageBox.width<=buttonBox.x, 'Feedback text never overlaps the submit button');
        const loss = 30;
        assert.equal(await page.locator('#run-score').innerText(), String(-loss));
        assert.equal(await page.locator('#result-modal').isVisible(), false);
        if (width === 1440 && mode === 'daily') {
          fs.mkdirSync('design/previews/stack-shell', { recursive: true });
          await page.screenshot({ path: 'design/previews/stack-shell/position-feedback.png', fullPage: true });
        }
        await page.clock.runFor(600);
        await page.locator('#check-button').click();
        await page.clock.runFor(700);
        assert.equal(await page.locator('.sort-card.correct,.sort-card.wrong').count(), 5, 'Resubmission restarts the flash');
        await page.clock.runFor(500);
        assert.equal(await page.locator('.sort-card.correct,.sort-card.wrong').count(), 0);
        assert.equal(await page.locator('[aria-description]').count(), 0);
        assert.deepEqual(await page.locator('.card-number').allTextContents(), ['01', '02', '03', '04', '05']);
        assert.equal(await page.locator('#timer').innerText(), '01:29', 'The clock continues during feedback');
        assert.equal(await page.locator('#run-score').innerText(), String(-loss * 2));
        await page.locator('#check-button').click();
        await page.locator('.sort-card').first().locator('button').last().click();
        assert.equal(await page.locator('.sort-card.correct,.sort-card.wrong').count(), 0, 'Sorting clears stale positions immediately');
        await reorder(page, [1, 2, 3, 4, 5]);
        await page.locator('#check-button').click();
        assert.ok(await page.locator('#result-modal').isVisible(), 'A correct stack still completes normally');
        assert.equal(await page.locator('.sort-card.correct,.sort-card.wrong').count(), 0);
        await page.locator('#next-button').click();
        assert.equal(await page.locator('.sort-card.correct,.sort-card.wrong').count(), 0, 'No feedback leaks into the next stack');
      }
      assert.deepEqual(errors, []);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.close();
      console.log(`PASS ${width}px: per-card colours/checks, accessible position feedback, transient/repeated flashes, live timer, clearing on movement, Daily/Unlimited and normal completion.`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
