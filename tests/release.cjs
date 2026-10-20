/* Public artifact routing and the remaining disabled friends prototype. */
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base);assert.equal(await page.locator('.game-grid>.game-card').count(),9);
  for(const name of ['friends']){
   await page.goto(base+'/'+name+'.html');assert.ok(await page.locator('.prototype-notice').isVisible());
   assert.ok(await page.locator('fieldset.prototype-form').evaluate(fieldset=>fieldset.disabled));
   assert.equal(await page.locator('form').evaluate(form=>[...new FormData(form).keys()].length),0,'No prototype credentials/friend code enter a request');
   for(const input of await page.locator('form input').all())assert.ok(await input.isDisabled());
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await page.goto(base+'/games/lowball/index.html');const frame=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();
  await frame.locator('#itemName').waitFor();assert.equal(await frame.evaluate(()=>shareLink()),'\n'+base+'/games/lowball/index.html','Lowball result links must retain the hosted project path');
  const social=await frame.locator('meta[property="og:url"]').getAttribute('content');assert.ok(social.startsWith('https://')&&!social.includes('YOURDOMAIN'));
  await page.goto(base+'/profile.html');assert.ok(await page.locator('#profile-empty').isVisible());
  assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${width}px: shipped routes load below the project path, prototype forms cannot submit credentials, notices are visible, profile works and no asset/JavaScript errors or overflow.`);
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
