const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const url=base+'/games/stack-up/index.html';
async function reorder(page,values){
 for(let i=0;i<values.length;i++){
  let at=await page.locator(`.sort-card[data-value="${values[i]}"]`).evaluate(el=>[...el.parentNode.children].indexOf(el));
  while(at>i){await page.locator(`.sort-card[data-value="${values[i]}"] button`).first().click();at--;}
 }
}
async function frozen(browser,width=1440,time='2026-10-19T03:00:00Z'){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();await page.clock.install({time:new Date(time)});await page.clock.pauseAt(new Date(time));
 await page.goto(url);return{context,page};
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});const errors=[];
 try{
  for(const width of [320,390,768,1440]){
   const {context,page}=await frozen(browser,width);page.on('pageerror',e=>errors.push(e.message));
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   await page.locator('#help-open').click();assert(await page.locator('#help-dialog').isVisible());await page.keyboard.press('Escape');assert(await page.locator('#help-open').evaluate(el=>el===document.activeElement));
   await page.locator('#game-menu-toggle').click();await page.keyboard.press('Escape');
   await page.locator('[data-mode=daily]').click();assert.equal(await page.locator('.sort-card').count(),5);
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   const original=await page.locator('.sort-card').first().getAttribute('data-value');
   await page.locator('.sort-card').first().focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.sort-card').nth(1).getAttribute('data-value'),original);
   await page.locator('.sort-card').nth(1).locator('button').first().click();assert.equal(await page.locator('.sort-card').first().getAttribute('data-value'),original);
   await page.reload();assert(await page.locator('#game-interface').isVisible());assert.equal(await page.locator('.sort-card').first().getAttribute('data-value'),original);
   for(let round=0;round<5;round++){
    await reorder(page,[1,2,3,4,5]);await page.locator('#check-button').click();assert(await page.locator('#result-modal').isVisible());
    if(round===0){await page.reload();assert(await page.locator('#result-modal').isVisible());await page.locator('#result-close').click();await page.locator('#check-button').click();}
    await page.locator('#next-button').click();
   }
   assert(await page.locator('#daily-summary').isVisible());assert.equal(await page.locator('#record-played').innerText(),'1');assert.equal(await page.locator('#stat-perfect').innerText(),'1');
   assert.equal(await page.locator('#summary-score').innerText(),'3,100 points');
   await page.reload();assert(await page.locator('#daily-summary').isVisible());assert.equal(await page.locator('#record-played').innerText(),'1');
   await page.locator('[data-mode=daily]').click();assert(await page.locator('#daily-summary').isVisible());
   await page.locator('#summary-copy').click();await page.locator('#share-status').filter({hasText:'Copied!'}).waitFor();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Stack Up 2026-10-19 🟩🟩🟩🟩🟩 3100 points/);
   await page.locator('#summary-infinite').click();await reorder(page,[5,4,3,2,1]);await page.locator('#check-button').click();assert.equal(await page.locator('#run-score').innerText(),'-30');
   await reorder(page,[1,2,3,4,5]);await page.locator('#check-button').click();await page.locator('#next-button').click();assert.equal(await page.locator('#round-label').innerText(),'STACK #2');assert.equal(await page.locator('#record-played').innerText(),'1');
   await page.locator('#stats-open').click();await page.keyboard.press('Shift+Tab');assert(await page.locator('#stats-dialog [data-close]').last().evaluate(el=>el===document.activeElement));await page.keyboard.press('Escape');
   await context.close();console.log(`PASS ${width}px: keyboard/button sorting, refresh/resume, five perfect daily stacks, results/share, no replay, Infinite and dialogs.`);
  }
  {
   const {context,page}=await frozen(browser);await page.locator('[data-mode=daily]').click();
   // Real drag/drop changes the order and persists it.
   const first=await page.locator('.sort-card').first().getAttribute('data-value');
   await page.locator('.sort-card').first().dragTo(page.locator('.sort-card').nth(2));assert.equal(await page.locator('.sort-card').nth(2).getAttribute('data-value'),first);
   await reorder(page,[5,4,3,2,1]);await page.locator('#check-button').click();assert.equal(await page.locator('#run-score').innerText(),'-30');
   await page.clock.runFor(91000);assert(await page.locator('#result-modal').isVisible());assert.equal(await page.locator('#run-score').innerText(),'-70');assert.match(await page.locator('#correct-order').innerText(),/Correct order:/);
   await page.reload();assert.equal(await page.locator('#run-score').innerText(),'-70');await page.locator('#next-button').click();assert.equal(await page.locator('#round-label').innerText(),'ROUND 2 / 5');
   await page.clock.runFor(31000);await page.reload();assert.equal(await page.locator('#timer').innerText(),'00:59');
   await page.locator('[data-mode=infinite]').click();await page.clock.runFor(60000);await page.locator('[data-mode=daily]').click();assert.match(await page.locator('#result-kicker').innerText(),/TIME RAN OUT/);
   await context.close();console.log('PASS: desktop drag, negative scores, timeout persisted once, wall-clock reload and mode switching cannot reset Daily.');
  }
  {
   const {context,page}=await frozen(browser,390,'2026-10-19T12:59:58Z');
   await page.locator('[data-mode=daily]').click();await page.clock.runFor(3000);assert.equal(await page.locator('#intro-screen').count(),0);assert(await page.locator('#game-interface').isVisible());assert(await page.locator('#day-notice').isVisible());
   await page.locator('[data-mode=daily]').click();assert.equal(await page.locator('#round-label').innerText(),'ROUND 1 / 5');assert.match(await page.locator('#timer').innerText(),/01:2[89]/);
   const keys=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('break-room:stack-up:daily:')));assert(keys.some(k=>k.endsWith('2026-10-19')));assert(keys.some(k=>k.endsWith('2026-10-20')));
   await context.close();console.log('PASS: Sydney midnight offers a fresh daily and preserves yesterday’s run.');
  }
  {
   const context=await browser.newContext({viewport:{width:390,height:1000},hasTouch:true,isMobile:true});const page=await context.newPage();await page.goto(url);await page.locator('[data-mode=infinite]').tap();const value=await page.locator('.sort-card').first().getAttribute('data-value');await page.locator('.sort-card').first().locator('button').last().tap();assert.equal(await page.locator('.sort-card').nth(1).getAttribute('data-value'),value);await context.close();console.log('PASS: touch sorting controls.');
  }
  {
   const context=await browser.newContext();await context.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('unavailable')};Storage.prototype.setItem=()=>{throw Error('unavailable')};});const page=await context.newPage();await page.goto(url);assert(await page.locator('#save-warning').isVisible());await page.locator('[data-mode=infinite]').click();assert.equal(await page.locator('.sort-card').count(),5);await context.close();console.log('PASS: storage failure gives feedback and keeps practice playable.');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
