/* Shared social-page top bar: geometry, navigation, keyboard and no-JS fallback. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const pages=['leagues.html','friends.html','profile.html'],labels=['Home','Leagues','Friends','Profile'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [320,390,480,481,540,650,768,820,821,900,1050,1100,1440]){
  const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  for(const route of pages){
   await p.goto(base+'/'+route);const header=p.locator('header.hub-topbar'),nav=header.getByRole('navigation',{name:'Main navigation'});
   assert.equal(await header.count(),1);assert.deepEqual(await nav.getByRole('link').allTextContents(),labels);
   assert.equal(await nav.locator('[aria-current=page]').count(),1);assert.equal(await nav.locator('[aria-current=page]').getAttribute('href'),route);
   const logo=header.locator('.br-brand__image');await logo.evaluate(i=>i.decode());assert.equal(await logo.getAttribute('alt'),'Break Room');
   const brand=await header.locator('.brand').boundingBox();if(width>480)assert(Math.abs(brand.x+brand.width/2-width/2)<1,'Centred logo '+width+' '+route);
   const current=await nav.locator('[aria-current=page]').evaluate(a=>{const s=getComputedStyle(a,'::after');return{height:s.height,color:s.backgroundColor};});
   assert.equal(current.height,'4px');assert.equal(current.color,'rgb(238, 101, 87)');
   for(const label of ['LOG IN','ACCOUNT']){
    await header.locator('.login').evaluate((a,label)=>a.textContent=label,label);
    const rects=await header.locator('a').evaluateAll(links=>links.map(a=>{const r=a.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
    for(const r of rects){assert(r.height>=44&&r.width>=44,'Accessible target '+route+' '+width);assert(r.x>=0&&r.x+r.width<=width+1,'Visible target '+width);}
    for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];assert(!(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1),'Overlapping header links '+route+' '+width);}
   }
   assert.equal(new URL(await header.locator('.login').getAttribute('href'),base+'/').href,base+'/login.html');
   assert.equal(await header.locator('.avatar').getAttribute('href'),'profile.html');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Page overflow '+route+' '+width);
   await p.keyboard.press('Tab');await nav.getByRole('link',{name:'Home',exact:true}).focus();
   assert.equal(await nav.getByRole('link',{name:'Home',exact:true}).evaluate(a=>getComputedStyle(a).outlineStyle),'solid');
   if([390,1440].includes(width)){await p.locator('body').click({position:{x:1,y:1}});fs.mkdirSync('.artifacts/social-topbar',{recursive:true});await p.screenshot({path:'.artifacts/social-topbar/'+route.replace('.html','')+'-'+width+'.png'});}
  }
  await p.goto(base+'/leagues.html');await p.locator('header nav a[href="friends.html"]').click();await p.waitForURL('**/friends.html');
  await p.locator('header nav a[href="profile.html"]').click();await p.waitForURL('**/profile.html');
  await p.locator('header nav a[href="leagues.html"]').click();await p.waitForURL('**/leagues.html');
  await p.locator('header .login').click();await p.waitForURL('**/login.html');
  assert.deepEqual(errors,[]);await ctx.close();console.log('PASS social top bar '+width+'px: current-page underline, logo, account widths, keyboard, links and no overlaps/overflow.');
 }
 const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}}),p=await ctx.newPage();
 for(const route of pages){await p.goto(base+'/'+route);const header=p.locator('header.hub-topbar');assert(await header.locator('.br-brand__image').isVisible());assert.equal(await header.getByRole('navigation').getByRole('link').count(),4);assert.equal(new URL(await header.locator('.login').getAttribute('href'),base+'/').href,base+'/login.html');await header.locator('.brand').click();await p.waitForURL('**/index.html');}
 await ctx.close();console.log('PASS social top bar without JavaScript: approved logo, navigation and account links remain usable.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
