const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright'),{stackRun,qs}=require('./profile-records.cjs');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});fs.mkdirSync('design/previews/arcade-score',{recursive:true});
 try{for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});await page.clock.setFixedTime(new Date('2026-10-20T03:00:00Z'));
  await page.goto(base+'/profile.html');assert.equal(await page.locator('#arcade-average').innerText(),'—');
  const fixture={pc_help_seen:'1',pc_history:{'19':75},pc_last:'2026-10-20',pc_last_avg:'75',pc_played:'1',pc_streak:'1',pc_best:'1',
   'break-room:lowball:daily-reset:2026-10-19':'1','break-room:stake:daily-reset:2026-10-19':'1',
   'stake:d:2026-10-20':{b:[1,1,1,1,1],p:[0,0,0,0,0],qs,rv:false},
   'break-room:stack-up:daily:2026-10-20':stackRun('2026-10-20',15500)};
  await page.evaluate(f=>{for(const[k,v]of Object.entries(f))localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));},fixture);
  const before=await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))));
  await page.reload();assert.equal(await page.locator('#arcade-average').innerText(),'75');
  assert.match(await page.locator('#arcade-basis').innerText(),/3 of 4 games · 3 saved Daily results/);
  assert.deepEqual(await page.locator('.profile-game-arcade>strong').allTextContents(),['75 / 100','100 / 100','50 / 100','— / 100']);
  await page.locator('.profile-scoring summary').click();assert.match(await page.locator('.profile-scoring').innerText(),/31,000/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const after=await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))));assert.equal(after,before);
  if([390,1440].includes(width))await page.screenshot({path:`design/previews/arcade-score/profile-${width}.png`,fullPage:true});
  await page.goto(base+'/games/stake/index.html');assert.equal(await page.locator('.stake-results .big').innerText(),'+5 chips');assert.equal(await page.locator('.stake-results .arcade-score>strong').innerText(),'100 / 100');
  await page.getByRole('button',{name:'Copy result',exact:true}).click();await page.locator('[role=status]').filter({hasText:'Copied.'}).waitFor();const stakeShare=await page.evaluate(()=>navigator.clipboard.readText());assert.match(stakeShare,/ = \+5/);assert.match(stakeShare,/Arcade score: 100\/100/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if([390,1440].includes(width))await page.screenshot({path:`design/previews/arcade-score/stake-${width}.png`,fullPage:true});
  await page.goto(base+'/games/stack-up/index.html');assert.equal(await page.locator('#summary-score').innerText(),'15,500 points');assert.equal(await page.locator('#summary-arcade strong').innerText(),'50 / 100');
  await page.locator('#summary-copy').click();await page.locator('#share-status').filter({hasText:'Copied!'}).waitFor();const stackShare=await page.evaluate(()=>navigator.clipboard.readText());assert.match(stackShare,/15500 points/);assert.match(stackShare,/Arcade score: 50\/100/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if([390,1440].includes(width))await page.screenshot({path:`design/previews/arcade-score/stack-up-${width}.png`,fullPage:true});
  await page.goto(base+'/games/lowball/index.html');const frame=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();await frame.locator('#finalScreen.show').waitFor();assert.equal(await frame.locator('#finalTotal').innerText(),'75');assert.equal(await frame.locator('#final-score-label').textContent(),'Arcade score / 100');
  assert.equal(await frame.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto(base+'/profile.html');assert.equal(await page.locator('#arcade-average').innerText(),'75');assert.deepEqual(errors,[]);
  await context.close();console.log(`PASS ${width}px: common scores/average match completed game results, low-bet perfect Stake keeps +5 chips, 15,500 Stack points remains 50/100, clipboard includes both scales, Lowball unchanged, no overflow/errors or profile writes.`);
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
