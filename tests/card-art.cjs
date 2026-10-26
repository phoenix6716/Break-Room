/* Only the homepage artwork and the links surrounding it. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',ids=['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [320,390,768,1100,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];await context.route('https://fonts.googleapis.com/**',r=>r.abort());page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base+'/index.html');assert.equal(await page.locator('.game-card-image').count(),10);assert.equal(await page.locator('.game-art svg,.game-art .art-label,.game-art .art-stamp').count(),0);
  for(let i=0;i<ids.length;i++){
   const card=page.locator('.game-card').nth(i),img=card.locator('.game-card-image');await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());assert.equal(await img.getAttribute('alt'),'');assert.equal(await img.getAttribute('aria-hidden'),'true');assert.match(await img.getAttribute('src'),new RegExp('/'+ids[i]+'-pixel.webp\\?v=pixel-20261026$'));
   assert.equal(await card.locator('.play-button').getAttribute('href'),'games/'+ids[i]+'/index.html');
   const detail=await img.evaluate(i=>{const b=i.getBoundingClientRect();return {width:b.width,height:b.height,nw:i.naturalWidth,nh:i.naturalHeight,fit:getComputedStyle(i).objectFit,render:getComputedStyle(i).imageRendering};});
   assert(detail.nw>=350&&detail.nh>=260);const frame=await card.locator('.game-art').boundingBox(),expectedHeight=width<=540?126:width<=1050?155:172;assert.equal(frame.height,expectedHeight,'Original artwork height at '+width+'px');assert.equal(detail.fit,'contain');assert.equal(detail.render,'pixelated');
   assert(detail.width>0&&detail.height>0,'Artwork remains visible inside its original frame');
   assert(await card.locator('h3').isVisible());assert((await card.locator('h3').innerText()).trim().length>0);
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  await page.evaluate(()=>scrollTo(0,0));fs.mkdirSync('.artifacts/card-art',{recursive:true});await page.screenshot({path:'.artifacts/card-art/home-'+width+'.png',fullPage:true});
  if(width===1440){await page.evaluate(()=>scrollTo(0,document.querySelector('.game-grid').getBoundingClientRect().top+scrollY));const buffer=await page.screenshot({type:'jpeg',quality:60});console.log('CARD_PREVIEW '+buffer.toString('base64'));}
  await page.locator('.game-card').first().locator('.play-button').click();await page.waitForURL('**/games/laser/index.html');assert(await page.locator('#game-menu-toggle').isVisible());await page.locator('header a.brand').click();await page.waitForURL(u=>u.pathname.endsWith('/index.html')&&!u.pathname.includes('/games/'));await context.close();
  console.log('PASS homepage card art '+width+'px: all ten exports decode, complete motifs fit, original 126/155/172px frames, readable headings, correct game links, no overflow/errors and home navigation works.');
 }
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:1000}}),p=await context.newPage();await p.goto(base+'/index.html');for(const img of await p.locator('.game-card-image').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());assert(await img.isVisible());}assert.equal(await p.locator('.game-card .play-button').count(),10);await context.close();console.log('PASS homepage artwork and all game links remain available without JavaScript.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
