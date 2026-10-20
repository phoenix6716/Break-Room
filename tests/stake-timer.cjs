const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
async function open(browser,width=390){const c=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const p=await c.newPage();await p.clock.install({time:new Date('2026-10-19T03:00:00Z')});await p.clock.pauseAt(new Date('2026-10-19T03:00:00Z'));await p.goto(base+'/games/stake/index.html');return{c,p};}
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [320,390,768,1440]){
  const {c,p}=await open(browser,width);const errors=[];p.on('pageerror',e=>errors.push(e.message));
  assert.equal(await p.locator('.stake-question-timer').count(),0);await p.clock.runFor(60000);assert.equal(await p.evaluate(()=>run.p.length),0);
  await p.getByRole('button',{name:'Bet 3 chips',exact:true}).click();assert.equal(await p.locator('#question-time').innerText(),'00:30');
  await p.clock.runFor(12000);assert.equal(await p.locator('#question-time').innerText(),'00:18');
  const deadline=await p.evaluate(()=>run.deadline);await p.reload();assert.equal(await p.evaluate(()=>run.deadline),deadline);assert.equal(await p.locator('#question-time').innerText(),'00:18');
  await p.locator('#help-popup-open').click();await p.clock.runFor(18000);assert(await p.locator('#help-popup').isVisible());await p.keyboard.press('Escape');
  assert.match(await p.locator('.banner').innerText(),/Time’s up\. You lose 3 chips/);assert.equal(await p.evaluate(()=>sc(run)),-3);assert.deepEqual(await p.evaluate(()=>run.p),[-1]);
  await p.clock.runFor(35000);assert.equal(await p.evaluate(()=>run.p.length),1);assert.equal(await p.evaluate(()=>sc(run)),-3);
  await p.reload();assert.match(await p.locator('.banner').innerText(),/Time’s up/);await p.getByRole('button',{name:'Next question',exact:true}).click();
  for(const bet of [2,1,3,2]){await p.getByRole('button',{name:`Bet ${bet} ${bet===1?'chip':'chips'}`,exact:true}).click();assert.equal(await p.locator('#question-time').innerText(),'00:30');await p.clock.runFor(30000);assert.match(await p.locator('.banner').innerText(),/Time’s up/);await p.getByRole('button',{name:bet===2&&await p.evaluate(()=>run.p.length===5)?'See results':'Next question',exact:true}).click();}
  assert.match(await p.locator('#app .big').innerText(),/-11 chips/);assert.equal(await p.evaluate(()=>run.p.length),5);assert.equal(await p.locator('#stake-played').innerText(),'1');
  await p.reload();assert.match(await p.locator('#app .big').innerText(),/-11 chips/);await p.locator('#stats-popup-open').click();assert.equal(await p.locator('#stat-last').innerText(),'-11 chips');
  assert.equal(await p.locator('.game-popup').filter({has:p.locator('#stats-popup-title')}).evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 253, 245)');await p.keyboard.press('Escape');
  await p.getByRole('tab',{name:'Unlimited',exact:true}).click();await p.getByRole('button',{name:'Bet 2 chips',exact:true}).click();await p.clock.runFor(30000);assert.match(await p.locator('.banner').innerText(),/Time’s up/);assert.equal(await p.evaluate(()=>sc(unl)),-2);assert.equal(await p.locator('#stake-played').innerText(),'1');
  assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));assert.deepEqual(errors,[]);await c.close();console.log(`PASS ${width}px: 30-second deadlines, reload, popup timeout, five losses, totals/stats and Unlimited.`);
 }
 {
  const {c,p}=await open(browser);await p.locator('.chip').first().click();await p.clock.runFor(10000);await p.getByRole('tab',{name:'Unlimited',exact:true}).click();await p.clock.runFor(20000);await p.getByRole('tab',{name:'Daily',exact:true}).click();assert.match(await p.locator('.banner').innerText(),/Time’s up/);
  await p.getByRole('button',{name:'Next question',exact:true}).click();await p.locator('.chip').first().click();const correct=await p.evaluate(()=>run.qs[run.p.length].a);await p.locator('button.opt').nth(correct).click();assert.equal(await p.evaluate(()=>sc(run)),0);await p.clock.runFor(35000);assert.equal(await p.evaluate(()=>sc(run)),0);
  await p.getByRole('button',{name:'Next question',exact:true}).click();await p.locator('.chip').first().click();await p.clock.setSystemTime(new Date(await p.evaluate(()=>Date.now()+31000)));await p.evaluate(()=>document.querySelector('button.opt').click());assert.match(await p.locator('.banner').innerText(),/Time’s up/);assert.equal(await p.evaluate(()=>run.p.at(-1)),-1);
  await c.close();console.log('PASS: mode switching cannot pause Daily; answered questions stop the clock; late clicks count as timeouts.');
 }
 {
  const {c,p}=await open(browser,1440);
  const styles=el=>{const s=getComputedStyle(el),h=getComputedStyle(el.querySelector('h2'));return {background:s.backgroundColor,border:s.borderColor,width:s.borderTopWidth,radius:s.borderRadius,shadow:s.boxShadow,align:s.textAlign,titleFont:h.fontFamily,titleSize:h.fontSize}};
  await p.goto(base+'/games/stack-up/index.html');await p.locator('#help-open').click();const reference=await p.locator('#help-dialog .dialog-card').evaluate(styles);
  await p.goto(base+'/games/stake/index.html');for(const type of ['help','stats']){await p.locator(`#${type}-popup-open`).click();assert.deepEqual(await p.locator(`#${type}-popup .game-popup`).evaluate(styles),reference);assert.equal(await p.locator(`#${type}-popup .game-popup`).evaluate(e=>getComputedStyle(e,'::before').content),'none');await p.keyboard.press('Shift+Tab');assert(await p.locator(`#${type}-popup [data-popup-close]`).last().evaluate(e=>e===document.activeElement));await p.keyboard.press('Escape');assert(await p.locator(`#${type}-popup-open`).evaluate(e=>e===document.activeElement));}
  await c.close();console.log('PASS: both Stake popups visually match Stack Up, with focus trapping and restoration.');
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
