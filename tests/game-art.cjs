/* Check actual decorative objects at four widths, plus delayed blind-clock artwork. Native play/save/review is covered by game-scenes and each game's suite. */
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const ids=['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','lowball','inner-clock'];
async function view(page,id){await page.goto(base+'/games/'+id+'/index.html');const p=id==='lowball'?await(await page.locator('iframe').elementHandle()).contentFrame():page;await p.locator('body[data-game-art-ready=true]').waitFor();return p;}
async function settle(p){await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const width of [320,390,768,1440]){
  const c=await browser.newContext({viewport:{width,height:1100},reducedMotion:'reduce'});await c.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));
  for(const id of ids){
   const page=await c.newPage(),errors=[];page.on('pageerror',x=>errors.push(x.message));const p=await view(page,id);await settle(p);
   await p.locator('.native-game-art').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,id+' overflow at '+width);
   if(id==='stack-up'){
    assert.equal(await p.locator('.card-symbol img').count(),await p.locator('.sort-card').count());
    const before=await p.locator('.sort-card').evaluateAll(es=>es.map(e=>[e.querySelector('.card-name').textContent,e.querySelector('img').src]).sort());
    await p.locator('.sort-card button:not(:disabled)').first().click();await settle(p);
    assert.deepEqual(await p.locator('.sort-card').evaluateAll(es=>es.map(e=>[e.querySelector('.card-name').textContent,e.querySelector('img').src]).sort()),before,'art follows names rather than rank');
   }
   if(id==='seating-chart'){
    const src=await p.locator('.sc-pool .native-portrait').evaluateAll(es=>es.map(e=>e.src));assert(src.length>=4);assert.equal(new Set(src).size,src.length);
    await p.locator('#guest-0').click();await p.locator('#seat-0').click();await settle(p);
    assert.equal(await p.locator('#seat-0 img').getAttribute('src'),await p.locator('#guest-0 img').getAttribute('src'));
   }
   if(id==='shift-work')assert.equal(await p.locator('.sw-piece img').count(),await p.locator('.sw-piece').count());
   if(id==='laser')assert(await p.locator('.laser-bullseye img').count());
   if(id==='time-drop'){assert.equal(await p.locator('#era-tag img').count(),1);}
   if(id==='clue-ladder'){assert(await p.locator('.cl-climber img').count());assert(await p.locator('.native-lock').count());}
   if(id==='hidden-gem'){assert(await p.locator('img.hg-topic-art.large').count());await p.locator('#start-question').click();await settle(p);assert(await p.locator('img.hg-topic-art').count());}
   if(id==='inner-clock'){await p.locator('body[data-clock-art-loaded=true]').waitFor();assert((await p.locator('.clock-dial').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('stopwatch.svg'));}
   if(id==='lowball')assert((await p.locator('.shelf-price-tag').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('price-tag.svg'));
   assert.deepEqual(errors,[]);await page.close();
  }await c.close();console.log('PASS custom objects: '+width+'px, decoded artwork, native label identities and controls.');
 }
 const c=await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'reduce'}),page=await c.newPage();let release;
 const delayed=new Promise(r=>release=r);await page.route('**/timing/stopwatch.svg*',async route=>{await delayed;await route.continue();});
 await page.goto(base+'/games/inner-clock/index.html',{waitUntil:'domcontentloaded'});await page.locator('body[data-game-art-ready=true]').waitFor();
 await page.locator('#clock-action').click();const html=await page.locator('#engine-slot').innerHTML();release();await page.waitForTimeout(200);
 assert.equal(await page.locator('body').getAttribute('data-clock-art-loaded'),null,'late decoding gives no timing cue');
 assert.equal(await page.locator('#engine-slot').innerHTML(),html);
 assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
 await page.locator('#clock-action').click();await page.locator('body[data-clock-art-loaded=true]').waitFor();
 await c.close();console.log('PASS delayed stopwatch decoding waits for the stopped attempt.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
