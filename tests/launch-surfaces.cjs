/* Public page, drawer and dialog checks; game-flow suites exercise the engines. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const games=['laser','stack-up','stake','alibi','pack','bouncer','prior','lowball','inner-clock'];
const pages=['index.html','friends.html','profile.html','login.html','signup.html','forgot-password.html','reset-password.html','account.html','privacy.html','terms.html','contact.html',...games.map(id=>'games/'+id+'/index.html')];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 const inventory=[];
 try{
  for(const width of [320,390,768,1100,1440]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   await context.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
   for(const route of pages){
    await page.goto(base+'/'+route);await page.waitForLoadState('networkidle');
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),route+' fits '+width);
    assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(244, 237, 220)',route+' paper background');
    assert.equal(await page.locator('img').evaluateAll(els=>els.filter(el=>!el.complete||el.naturalWidth===0).map(el=>el.src)).then(a=>a.length),0,route+' image loads');
    const oldTheme=await page.locator('button,input,select').evaluateAll(els=>els.filter(el=>el.getClientRects().length).filter(el=>['rgb(19, 11, 50)','rgb(23, 13, 57)','rgb(45, 27, 102)','rgb(26, 16, 66)'].includes(getComputedStyle(el).backgroundColor)).map(el=>el.outerHTML.slice(0,150)));
    assert.deepEqual(oldTheme,[],route+' no old purple controls');
    if(route==='index.html')assert.deepEqual(await page.locator('.game-card .play-button').evaluateAll(els=>els.map(el=>el.getAttribute('href').split('/')[1])),games);
    if(await page.locator('#game-menu-toggle').count()){
     await page.locator('#game-menu-toggle').click();
     assert.equal(await page.locator('#game-menu').getByText('COMING SOON',{exact:true}).count(),0);
     assert.deepEqual(await page.locator('#game-menu a').evaluateAll(els=>els.map(el=>el.getAttribute('href')).filter(h=>/games\/[^/]+\/index.html$/.test(h)).map(h=>h.match(/games\/([^/]+)\//)[1])),games);
     await page.keyboard.press('Escape');assert(await page.locator('#game-menu').isHidden());
     assert(await page.locator('#game-menu-toggle').evaluate(el=>el===document.activeElement));
    }
    for(const id of ['help-popup-open','stats-popup-open']){
     const control=page.locator('#'+id);if(!await control.count())continue;
     await control.click();const modal=page.locator('.game-popup-backdrop:not([hidden]),.dialog-backdrop:not([hidden])').first();
     await modal.waitFor();assert.equal(await modal.locator('.game-popup,.dialog-card').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 253, 245)');
     await page.keyboard.press('Escape');assert(await modal.isHidden());assert(await control.evaluate(el=>el===document.activeElement));
    }
    inventory.push({route,width,buttons:await page.locator('button').count(),images:await page.locator('img').count()});
   }
   assert.deepEqual(errors,[]);await context.close();console.log('PASS public surfaces, assets, menus and dialogs at '+width+'px');
  }
  fs.mkdirSync('.artifacts',{recursive:true});fs.writeFileSync('.artifacts/launch-surfaces.json',JSON.stringify(inventory,null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
