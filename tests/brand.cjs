/* Check only shared branding/navigation, never replay entire game sessions. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',version='tile05-20261025';
const games=['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock'];
const rootPages=['index.html','friends.html','profile.html','login.html','signup.html','forgot-password.html','reset-password.html','privacy.html','terms.html','contact.html','style-guide.html'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});await context.route('https://fonts.googleapis.com/**',r=>r.abort());await context.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
  for(const route of [...rootPages,...games.map(id=>'games/'+id+'/index.html')]){
   await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});
   const brand=p.locator('header a.br-brand'),image=brand.locator('.br-brand__image');
   assert.equal(await brand.count(),1,route+' one brand link');assert.match(await brand.getAttribute('aria-label'),/Break Room/);
   await image.evaluate(i=>i.decode());assert.equal(await image.getAttribute('alt'),'Break Room');assert.match(await image.getAttribute('src'),new RegExp('break-room-wordmark.png\\?v='+version+'$'));
   const b=await brand.boundingBox();assert(b.width>100&&b.height>=44&&b.x>=0&&b.x+b.width<=width,route+' visible logo');
   const overlap=await p.locator('header').first().evaluate(header=>{
    const a=header.querySelector('.br-brand').getBoundingClientRect();
    return [...header.querySelectorAll('a,button')].filter(e=>!e.closest('.br-brand')&&!e.closest('.game-menu')&&e.getClientRects().length).some(e=>{const b=e.getBoundingClientRect();return Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;});
   });assert.equal(overlap,false,route+' logo overlaps navigation');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow');
   assert.match(await p.locator('link[rel=icon]').getAttribute('href'),/break-room-icon\.svg\?v=tile05-20261025$/);
   if(route.startsWith('games/')){await p.locator('#game-menu-toggle').click();await p.locator('#game-menu-close').waitFor({state:'visible'});await p.keyboard.press('Escape');assert(await p.locator('#game-menu').isHidden());assert(await p.locator('#game-menu-toggle').evaluate(e=>e===document.activeElement));}
   if(route==='index.html'||route==='games/laser/index.html'){fs.mkdirSync('.artifacts/brand',{recursive:true});await p.screenshot({path:'.artifacts/brand/'+(route==='index.html'?'home':'game')+'-'+width+'.png'});}
   await brand.click();await p.waitForURL(u=>u.pathname.endsWith('/index.html')&&!u.pathname.includes('/games/'));
  }
  assert.deepEqual(errors,[]);await context.close();console.log('PASS option05 branding '+width+'px: all ten game headers, account/profile/Friends/legal pages, accessible home links, image loading, icon, no overlaps, drawer focus and no overflow.');
 }
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}}),p=await context.newPage();
 for(const route of ['index.html','login.html','friends.html','profile.html','games/laser/index.html']){
  await p.goto(base+'/'+route);const img=p.locator('header .br-brand__image');assert(await img.isVisible());assert(await img.evaluate(i=>i.complete&&i.naturalWidth>0));assert.match(await p.locator('header a.br-brand').getAttribute('href'),/index\.html$/);
 }
 await context.close();console.log('PASS option05 branding without JavaScript; existing page labels and links remain accessible.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
