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
        assert.equal(await page.locator('#run-score').innerText(), '0');
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
        assert.equal(await page.locator('#run-score').innerText(), '0');
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
    for (const width of [390, 1440]) {
      const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'no-preference',hasTouch:width===390,isMobile:width===390}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.setFixedTime(new Date('2026-10-19T03:00:00Z'));await page.goto(base+'/games/stack-up/index.html');await page.locator('[data-mode=daily]').click();
      const movement=await page.evaluate(()=>{
        const first=document.querySelector('.sort-card'),value=first.dataset.value,before=first.getBoundingClientRect();first.querySelector('button:last-child').click();
        const card=document.querySelector(`[data-value="${value}"]`),animations=document.querySelectorAll('.sort-card');let moving=0;for(const c of animations)for(const a of c.getAnimations())if(a.effect.getTiming().duration===260){a.pause();a.currentTime=0;moving++;}
        const start=card.getBoundingClientRect();for(const c of animations)for(const a of c.getAnimations())if(a.effect.getTiming().duration===260)a.currentTime=130;
        const middle=card.getBoundingClientRect();return{value,moving,before:{x:before.x,y:before.y},start:{x:start.x,y:start.y},middle:{x:middle.x,y:middle.y},position:[...document.querySelectorAll('.sort-card')].indexOf(card),focused:card===document.activeElement};
      });
      assert(movement.moving>=2,'Both moving cards slide');assert.equal(movement.position,1);assert(movement.focused);assert(Math.hypot(movement.start.x-movement.before.x,movement.start.y-movement.before.y)<2,'The animation starts at the old displayed position');assert(Math.hypot(movement.middle.x-movement.start.x,movement.middle.y-movement.start.y)>5,'An intermediate animation frame moves towards the destination');
      await page.evaluate(async()=>{const all=[...document.querySelectorAll('.sort-card')].flatMap(c=>c.getAnimations()).filter(a=>a.effect.getTiming().duration===260);all.forEach(a=>a.finish());await Promise.allSettled(all.map(a=>a.finished));});
      const rapid=await page.evaluate(value=>{for(let i=0;i<2;i++)document.querySelector(`[data-value="${value}"]`).dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));const card=document.querySelector(`[data-value="${value}"]`),saved=JSON.parse(localStorage.getItem('break-room:stack-up:daily:'+MIDNIGHT_ARCADE_CLOCK.dayKey()));return{position:[...card.parentElement.children].indexOf(card),focused:card===document.activeElement,saved:saved.order.indexOf(Number(value))};},movement.value);assert.equal(rapid.position,3);assert.equal(rapid.saved,3);assert(rapid.focused);
      await page.evaluate(async()=>{const all=[...document.querySelectorAll('.sort-card')].flatMap(c=>c.getAnimations()).filter(a=>a.effect.getTiming().duration===260);all.forEach(a=>a.finish());await Promise.allSettled(all.map(a=>a.finished));});
      if(width===390){const scale=await page.evaluate(()=>{const last=document.querySelector('.sort-card:last-child'),v=last.dataset.value;last.querySelector('button:first-child').click();const card=document.querySelector(`[data-value="${v}"]`),animation=card.getAnimations().find(a=>a.effect.getTiming().duration===260);return animation.effect.getKeyframes()[0].transform;});assert.match(scale,/scale\((?:[12]\.[5-9]|2)/,'The full-width mobile card animates its width when changing rows');}
      await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true})));assert.equal(await page.locator('.sort-card.reordering').count(),0,'Reduced motion skips positional animation');
      await page.locator('[data-mode=infinite]').click();assert.equal(await page.locator('#stack-topic').inputValue(),'all');await page.locator('#stack-topic').selectOption('familiar');await page.locator('[data-mode=daily]').click();await page.locator('[data-mode=infinite]').click();assert.equal(await page.locator('#stack-topic').inputValue(),'familiar','A selected topic survives mode switching');await page.reload();await page.locator('[data-mode=infinite]').click();assert.equal(await page.locator('#stack-topic').inputValue(),'all','A fresh session defaults to All topics');
      assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await context.close();console.log(`PASS ${width}px: actual swap/intermediate frames, rapid keyboard moves, mobile row resizing, reduced motion, saved order/focus and All topics default.`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
