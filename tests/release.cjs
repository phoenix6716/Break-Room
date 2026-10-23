/* Public artifact routes, real friends guest state and local profile. */
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base);assert.equal(await page.locator('.game-grid>.game-card').count(),6);
  await page.goto(base+'/friends.html');await page.locator('#friend-guest').waitFor();
  assert.equal(await page.locator('#comparison-game option[value="alibi"],#comparison-game option[value="bouncer"],#comparison-game option[value="prior"]').count(),0);
  assert.equal(await page.locator('.prototype-notice,.feed-scores').count(),0,'No example friends or scores ship');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto(base+'/games/lowball/index.html');const frame=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();
  await frame.locator('#itemName').waitFor();assert.equal(await frame.evaluate(()=>shareLink()),'\n'+base+'/games/lowball/index.html','Lowball result links must retain the hosted project path');
  const social=await frame.locator('meta[property="og:url"]').getAttribute('content');assert.ok(social.startsWith('https://')&&!social.includes('YOURDOMAIN'));
  await page.goto(base+'/profile.html');assert.ok(await page.locator('#profile-empty').isVisible());assert.equal(await page.locator('.profile-game').count(),6);assert.equal(await page.locator('#today-count').innerText(),'0 / 6');
  assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${width}px: shipped routes load below the project path, real friends guest state and profile work and no asset/JavaScript errors or overflow.`);
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
