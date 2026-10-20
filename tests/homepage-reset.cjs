const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900}});
   await context.route('https://fonts.googleapis.com/**',r=>r.abort());
   const page=await context.newPage();
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.game-grid')).display==='grid');
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('.arcade-marquee,.home-ticker,.stat-grid').count(),0);
   assert.equal(await page.locator('.game-grid>.game-card').count(),10);
   const columns=await page.locator('.game-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
   assert.equal(columns,width<=820?2:3);
   assert.equal(await page.locator('.coming-stamp').count(),6);
   assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   const top=(await page.locator('.game-card').first().boundingBox()).y;
   assert.ok(top<650,`Game grid too far down at ${width}px: ${top}`);
   assert.ok(await page.locator('.game-card p').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=14));
   assert.match(await page.locator('#daily-reset-countdown').innerText(),/^\d{2}:\d{2}:\d{2}$/);
   console.log(`PASS ${width}px: one intro, shared clock, original grid, 14px descriptions, first game at ${Math.round(top)}px, no overflow.`);
   await context.close();
  }
  for(const timezoneId of ['UTC','America/Los_Angeles','Asia/Tokyo','Australia/Sydney']){
   const context=await browser.newContext({timezoneId});
   await context.route('https://fonts.googleapis.com/**',r=>r.abort());
   await context.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));
   for(const route of ['/','/games/stake/','/games/lowball/engine/index.html']){
    const page=await context.newPage();
    await page.clock.install({time:new Date('2026-10-18T12:59:58Z')});
    await page.clock.pauseAt(new Date('2026-10-18T12:59:59Z'));
    await page.goto(base+route,{waitUntil:'domcontentloaded'});
    assert.equal(await page.evaluate(()=>window.MIDNIGHT_ARCADE_CLOCK.dayKey()),'2026-10-18');
    assert.equal(await page.evaluate(()=>window.MIDNIGHT_ARCADE_CLOCK.countdown()),'00:00:01');
    if(route==='/')assert.equal(await page.locator('#daily-reset-countdown').innerText(),'00:00:01');
    if(route==='/games/stake/'){
     assert.equal(await page.evaluate(()=>run.date),'2026-10-18');
     assert.equal(await page.evaluate(()=>cd()),'00:00:01');
     await page.evaluate(()=>{
      for(const date of ['2026-10-17','2026-10-18'])localStorage.setItem('stake:d:'+date,JSON.stringify({b:[1,1,1,1,1],p:[0,0,0,0,0]}));
      document.getElementById('stats-popup-open').click();
     });
     assert.equal(await page.locator('#stat-streak').innerText(),'2');
    }
    if(route.includes('/engine/')){
     assert.equal(await page.evaluate(()=>getTodayKey()),'2026-10-18');
     assert.ok((await page.locator('#nextDaily').innerText()).includes('00:00:01'));
     await page.evaluate(()=>{document.getElementById('guessInput').value='10';document.getElementById('submitBtn').click()});
    }
    await page.clock.runFor(2000);
    assert.equal(await page.evaluate(()=>window.MIDNIGHT_ARCADE_CLOCK.dayKey()),'2026-10-19');
    if(route==='/')assert.equal(await page.locator('#daily-reset-countdown').innerText(),'23:59:59');
    if(route==='/games/stake/'){
     assert.equal(await page.evaluate(()=>run.date),'2026-10-19');
     assert.equal(await page.evaluate(()=>cd()),'23:59:59');
     await page.evaluate(()=>document.getElementById('stats-popup-open').click());
     assert.equal(await page.locator('#stat-streak').innerText(),'2');
    }
    if(route.includes('/engine/')){
     assert.ok(await page.locator('#nextDaily').evaluate(el=>el.classList.contains('ready')));
     await Promise.all([page.waitForEvent('load'),page.evaluate(()=>document.getElementById('nextBtn').click())]);
     assert.equal(await page.evaluate(()=>loadedDayKey),'2026-10-19');
     assert.equal(await page.evaluate(()=>roundScores.length),0);
    }
    await page.close();
   }
   await context.close();
   console.log(`PASS ${timezoneId}: homepage, Stake, and Lowball share midnight; rollover, Stake streaks, and stale Lowball submission protection work.`);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
