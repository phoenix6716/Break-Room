const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const {stackRun,qs}=require('./profile-records.cjs');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const fixed=new Date('2026-10-20T03:00:00Z');
async function reorder(page){for(let value=1;value<=5;value++){let at=await page.locator(`.sort-card[data-value="${value}"]`).evaluate(e=>[...e.parentElement.children].indexOf(e));while(at>value-1){await page.locator(`.sort-card[data-value="${value}"] button`).first().click();at--;}}}
const snapshot=page=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});fs.mkdirSync('design/previews/profile',{recursive:true});
 try{
  for(const width of [320,390,768,1100,1440]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});await page.clock.install({time:fixed});await page.clock.pauseAt(new Date(fixed.getTime()+1000));await page.clock.setSystemTime(fixed);
   await page.goto(base+'/profile.html');assert(await page.locator('#profile-empty').isVisible());assert.equal(await page.locator('#total-runs').innerText(),'0');assert.equal(await page.locator('.profile-achievement.earned').count(),0);
   assert.equal(await page.locator('.profile-game').count(),9);assert.equal(await page.locator('.friend-code').count(),0);assert.equal(await page.locator('.profile-game [href*="pixel-pairs"]').count(),0);
   if(width===1440)await page.screenshot({path:'design/previews/profile/empty-desktop.png',fullPage:true});
   const fixture={pc_played:'120',pc_last:'2026-10-20',pc_last_avg:'100',pc_history:{},'insert-coin:attempt:2026-10-20:pixel-pairs':{score:84}};
   for(let i=0;i<14;i++){
    const date=new Date(Date.UTC(2026,9,20-i)).toISOString().slice(0,10);fixture.pc_history[19-i]=i===0?100:50+i;
    fixture['stake:d:'+date]={b:[3,3,3,3,3],p:i%2?[1,1,1,1,1]:[0,0,0,0,0],qs};
    fixture['break-room:stack-up:daily:'+date]=stackRun(date,i%2?-2000:31000);
   }
   await page.evaluate(f=>{for(const [key,value]of Object.entries(f))localStorage.setItem(key,typeof value==='string'?value:JSON.stringify(value));},fixture);
   const before=await snapshot(page);await page.reload();
   assert.equal(await page.locator('#total-runs').innerText(),'148');assert.equal(await page.locator('#today-count').innerText(),'3 / 9');assert.equal(await page.locator('#overall-streak').innerText(),'14 days');
   assert.equal(await page.locator('.profile-achievement.earned').count(),6);assert.equal(await page.locator('.activity-day[data-count="3"]').count(),14);
   assert.equal(await page.locator('.profile-result').count(),10);await page.locator('#more-results').click();assert.equal(await page.locator('.profile-result').count(),20);
   await page.locator('#result-filter').selectOption('stake');assert.equal(await page.locator('.profile-result').count(),10);assert.equal(await page.locator('.profile-result:not([data-game=stake])').count(),0);await page.locator('#more-results').click();assert.equal(await page.locator('.profile-result').count(),14);assert.equal(await page.locator('#more-results').isVisible(),false);
   await page.locator('#result-filter').selectOption('all');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   for(const card of await page.locator('.profile-game').all()){
    assert.ok(await card.locator('a').getAttribute('href').then(h=>h.endsWith('/index.html')));
    assert.ok(await card.locator('.profile-metrics').evaluate(e=>e.scrollWidth<=e.clientWidth));
   }
   assert.deepEqual(await snapshot(page),before,'Viewing/filtering profile must not write or migrate any save');
   if([390,1440].includes(width))await page.screenshot({path:`design/previews/profile/${width===390?'mobile':'desktop'}.png`,fullPage:true});
   // A storage event refreshes another open tab; stale streaks clear after the shared Sydney day changes.
   await page.evaluate(()=>{localStorage.removeItem('stake:d:2026-10-20');window.dispatchEvent(new StorageEvent('storage',{key:'stake:d:2026-10-20'}));});
   assert.equal(await page.locator('#today-count').innerText(),'2 / 9');
   await page.clock.setSystemTime(new Date(fixed.getTime()+86400000*2));await page.clock.runFor(30000);assert.equal(await page.locator('#today-count').innerText(),'0 / 9');assert.equal(await page.locator('#overall-streak').innerText(),'0 days');
   assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${width}px: empty/populated profile, exact real-format stats, six earned achievements, filters/pagination, live refresh/day rollover, read-only saves and no overflow/errors.`);
  }
  // Actual engines write the records: profile has no game-engine imports or sample scores.
  {
   const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();await page.clock.install({time:fixed});await page.clock.pauseAt(new Date(fixed.getTime()+1000));await page.clock.setSystemTime(fixed);
   await page.goto(base+'/games/lowball/index.html');let frame=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();await page.clock.runFor(1000);if(await frame.locator('#helpClose').isVisible())await frame.locator('#helpClose').click();
   for(let i=0;i<4;i++){await frame.locator('#guessInput').fill(String(await frame.evaluate(()=>currentItem.prices[country])));await frame.locator('#submitBtn').click();await frame.locator('#nextBtn').click();}
   await page.goto(base+'/games/stake/index.html');
   for(let i=0;i<5;i++){await page.getByRole('button',{name:'Bet 3 chips',exact:true}).click();const answer=await page.evaluate(()=>run.qs[run.p.length].a);await page.locator('button.opt').nth(answer).click();await page.getByRole('button',{name:i===4?'See results':'Next question',exact:true}).click();}
   // Verify legacy answers against the existing engine, rather than testing against a copied fixture.
   await page.addScriptTag({url:base+'/profile-records.js'});
   assert.ok(await page.evaluate(()=>Array.from({length:40},(_,i)=>new Date(Date.UTC(2026,8,1+i)).toISOString().slice(0,10)).every(day=>JSON.stringify(dayQs(day,164).map(q=>q.a))===JSON.stringify(BREAK_ROOM_RECORDS.legacyStakeAnswers(day)))));
   const legacy=await page.evaluate(()=>({day:'2026-10-19',b:[1,2,3,1,2],p:[0,1,-1,2,1]}));
   const legacyScore=await page.evaluate(r=>sc({...r,qs:dayQs(r.day,164)}),legacy);
   await page.evaluate(r=>localStorage.setItem('stake:d:'+r.day,JSON.stringify({b:r.b,p:r.p})),legacy);
   await page.goto(base+'/games/stack-up/index.html');await page.locator('[data-mode=daily]').click();
   for(let i=0;i<5;i++){await reorder(page);await page.locator('#check-button').click();await page.locator('#next-button').click();}
   const before=await snapshot(page);await page.goto(base+'/profile.html');
   assert.equal(await page.locator('#total-runs').innerText(),'4');assert.equal(await page.locator('#today-count').innerText(),'3 / 9');
   const actual=await page.evaluate(()=>BREAK_ROOM_RECORDS.read(localStorage));
   assert.equal(actual.games[0].best,100);assert.equal(actual.games[1].best,15);assert.equal(actual.games[2].best,3100);assert.equal(actual.records.find(r=>r.game==='stake'&&r.date==='2026-10-19').score,legacyScore);
   assert.deepEqual(await snapshot(page),before);await page.reload();assert.equal(await page.locator('#total-runs').innerText(),'4');
   await page.screenshot({path:'design/previews/profile/actual-completions.png',fullPage:true});
   // Practice is deliberately excluded, including real runs from each engine.
   await page.goto(base+'/games/stake/index.html');await page.getByRole('tab',{name:'Unlimited',exact:true}).click();await page.getByRole('button',{name:'Bet 3 chips',exact:true}).click();await page.locator('button.opt').first().click();
   await page.goto(base+'/games/stack-up/index.html');await page.locator('[data-mode=infinite]').click();await reorder(page);await page.locator('#check-button').click();await page.locator('#next-button').click();
   await page.goto(base+'/profile.html');assert.equal(await page.locator('#total-runs').innerText(),'4');await context.close();console.log('PASS: full real Lowball/Stake/Stack Up Dailies populate exact profile scores; legacy Stake answers match 40 engine dates; practice excluded; saves unchanged.');
  }
  {
   const context=await browser.newContext(),page=await context.newPage();await context.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('Blocked')}});});await page.goto(base+'/profile.html');assert(await page.locator('#storage-warning').isVisible());assert.equal(await page.locator('#profile-content').isVisible(),false);await context.close();console.log('PASS: denied storage shows an honest warning rather than invented empty stats.');
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
