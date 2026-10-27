/* Verify downloaded-file links, portable daily preservation and free Lowball Unlimited. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {readFileSync,existsSync}=require('node:fs');
const path=require('node:path');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/index.html');
  const day=await page.evaluate(()=>window.MIDNIGHT_ARCADE_CLOCK.dayKey());
  await page.evaluate(day=>{
   const date=new Date(day+'T00:00:00Z'),previous=new Date(+date-86400000);
   const unpad=d=>`${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
   const index=Math.floor((date-Date.UTC(2026,9,1))/86400000);
   localStorage.setItem('pc_help_seen','1');
   localStorage.setItem('pc_last',unpad(date));localStorage.setItem('pc_played','3');
   localStorage.setItem('pc_last_avg','90');localStorage.setItem('pc_streak','3');localStorage.setItem('pc_best','3');
   localStorage.setItem('pc_history',JSON.stringify({[index-1]:70,[index]:90}));
   localStorage.setItem('pc_progress',JSON.stringify({day:unpad(date),idx:2,scores:[80,90],guesses:[10,10]}));
   localStorage.setItem('stake:d:'+day,JSON.stringify({b:[1,1,1,1,1],p:[0,0,0,0,0]}));
   localStorage.setItem('stake:d:'+previous.toISOString().slice(0,10),JSON.stringify({b:[1,1,1,1,1],p:[0,0,0,0,0]}));
  },day);
  await page.goto(base+'/games/lowball/engine/index.html');
  assert(await page.locator('#finalScreen').evaluate(e=>e.classList.contains('show')),'Completed Daily survives on a fresh browser without old reset flags');
  assert.equal(await page.locator('#playedVal').innerText(),'3');
  assert.equal(await page.evaluate(()=>Object.keys(loadHistory()).length),2);
  await page.evaluate(()=>{const d=new Date();const previous=window.MIDNIGHT_ARCADE_CLOCK.previousDay(window.MIDNIGHT_ARCADE_CLOCK.dayKey());const [y,m,day]=previous.split('-').map(Number);localStorage.setItem('pc_last',`${y}-${m}-${day}`);});
  await page.reload();assert.equal(await page.locator('#guessInput').isVisible(),true);
  await page.locator('#guessInput').fill('10');await page.locator('#submitBtn').click();
  await page.reload();assert(await page.locator('#resultArea').evaluate(e=>e.classList.contains('show')));
  await page.locator('#unlimitedModeBtn').click();assert(await page.locator('#guessInput').isVisible());
  assert.equal(await page.evaluate(()=>mode),'unlimited');
  assert.equal(await page.evaluate(()=>safeGet('pc_pro','')),'');
  await page.locator('#guessInput').fill('10');await page.locator('#submitBtn').click();
  assert(await page.locator('#resultArea').evaluate(e=>e.classList.contains('show')));
  assert.equal(await page.evaluate(()=>loadStats().played),3);
  await page.goto((process.env.ARCADE_LEGACY_TEST_URL||base)+'/games/stake/index.html');
  assert.equal(await page.evaluate(()=>run.p.length),5,'Restored Stake Daily is never replay-reset');
  assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('stake:d:')).length),2);
  await page.evaluate(day=>localStorage.removeItem('stake:d:'+day),day);await page.reload();
  assert.equal(await page.locator('.chip').count(),3);
  await page.locator('.chip').first().click();await page.reload();assert.equal(await page.locator('button.opt').count(),3);
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:950});
   await page.goto(base+'/games/lowball/engine/index.html');
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  }
  assert.deepEqual(errors,[]);await context.close();
  const homepage=readFileSync('index.html','utf8');
  for(const game of ['lowball','stake']){
   const target=`games/${game}/index.html`;
   assert(homepage.includes(`href="${target}"`));assert(existsSync(path.resolve(target)));
   const context=await browser.newContext();const tab=await context.newPage();
   await tab.goto(base+'/index.html');await tab.locator(`a[href="${target}"]`).click();
   assert(tab.url().endsWith('/'+target));
   if(game==='stake')assert.equal(await tab.locator('.chip').count(),3);
   else await tab.frameLocator('iframe').locator('#guessInput').waitFor({state:'visible'});
   await context.close();
  }
  // Managed Chromium blocks file:// navigation. Verify explicit file targets above,
  // and exercise the same card links through HTTP rather than bypass browser policy.
  console.log('PASS: explicit HTML link targets and card navigation, restored Dailies survive without reset flags, preserved history, reload persistence, free Unlimited and responsive Lowball mat.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
