/* Actual Lowball receipt, region and reload behavior across the dated price release. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',html=fs.readFileSync('games/lowball/engine/index.html','utf8');
const literal=html.match(/const ITEMS = (\[[\s\S]*?\n\]);/)[1],selector=html.slice(html.indexOf('function mulberry32'),html.indexOf('let deck = []'));
const pick=vm.runInNewContext('const ITEMS='+literal+',ROUNDS_PER_DAY=4;let selectedDay=0;const dayNumber=()=>selectedDay;\n'+selector+'\n(d)=>{selectedDay=d;return pickDailyItems()}');
let date,stampIndex;
for(let i=23;i<123;i++){const names=pick(i).map(x=>x.name);if(names.includes('Standard stamp')){date=new Date(Date.UTC(2026,9,1+i)).toISOString().slice(0,10);stampIndex=names.indexOf('Standard stamp');break;}}
assert(date);
const priceBox={};vm.runInNewContext(fs.readFileSync('games/lowball/engine/reference-prices.js','utf8'),priceBox);
const P=priceBox.BREAK_ROOM_LOWBALL_PRICES,baseline=JSON.parse(JSON.stringify(vm.runInNewContext(literal))),scopedItems=['Movie ticket popcorn combo','Pint of beer','Uber short ride','Band-Aids box'].map(name=>P.current(baseline.find(x=>x.name===name),'2026-10-24'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [320,390,768,1100,1440]){
   for(const legacy of [false,true]){
    const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.clock.setFixedTime(new Date(date+'T01:00:00Z'));
    await context.addInitScript(({date,stampIndex,legacy})=>{
     localStorage.setItem('pc_help_seen','1');localStorage.setItem('pc_sound','0');localStorage.setItem('pc_country','AU');
     if(legacy&&!sessionStorage.getItem('legacy-loaded')){
      localStorage.setItem('pc_progress',JSON.stringify({day:date,idx:stampIndex,scores:Array(stampIndex).fill(0),guesses:Array(stampIndex).fill(999),pending:null}));
      sessionStorage.setItem('legacy-loaded','1');
     }
    },{date,stampIndex,legacy});
    await page.goto(base+'/games/lowball/index.html');let f=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();await f.locator('#submitBtn').waitFor();
    if(!legacy)for(let i=0;i<stampIndex;i++){await f.locator('#guessInput').fill('10');await f.locator('#submitBtn').click();await f.locator('#nextBtn').click();}
    assert.equal(await f.locator('#itemName').innerText(),'Standard stamp');
    const price=legacy?1.70:1.85;
    const before=await f.evaluate(()=>JSON.parse(localStorage.getItem('pc_progress')));
    assert.equal(before.items[stampIndex].prices.AU,price,'Freeze the old or reviewed target before input');
    if(!legacy){
     await f.locator('#cselectBtn').click();await f.locator('#cselectList [data-code="US"]').click();
     assert.match(await f.locator('#itemDetail').innerText(),/USPS.*1 oz/);
     await f.locator('#cselectBtn').click();await f.locator('#cselectList [data-code="AU"]').click();
     assert.match(await f.locator('#itemDetail').innerText(),/Australia Post.*250g/);
    }
    await f.locator('#guessInput').fill(String(price));await f.locator('#submitBtn').click();
    assert.equal(await f.locator('#resultScore').innerText(),'100');
    const receipt=await f.locator('#resultFacts').innerText();
    assert.match(receipt,/Reference price/i);assert.match(receipt,legacy?/not independently verified/:/22 Oct 2026/);
    if(!legacy)assert.match(await f.locator('#resultFacts a').getAttribute('href'),/^https:\/\/auspost.com.au\//);
    assert(!receipt.includes('15 Oct 2026'));
    const saved=await f.evaluate(()=>localStorage.getItem('pc_progress'));
    await page.reload();f=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();await f.locator('#resultArea.show').waitFor();
    assert.equal(await f.locator('#resultFacts').innerText(),receipt,'Pending receipt retains its target and evidence');
    assert.equal(await f.evaluate(()=>localStorage.getItem('pc_progress')),saved);
    await f.locator('#unlimitedModeBtn').click();await f.locator('#normalModeBtn').click();
    assert.equal(await f.locator('#resultFacts').innerText(),receipt,'Practice does not replace the Daily receipt');
    assert.equal(await f.evaluate(()=>localStorage.getItem('pc_progress')),saved);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.equal(await f.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);await context.close();
   }
   const scopedContext=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),scopedPage=await scopedContext.newPage(),scopedErrors=[];
   scopedPage.on('pageerror',e=>scopedErrors.push(e.message));
   await scopedPage.clock.setFixedTime(new Date(date+'T01:00:00Z'));
   await scopedContext.addInitScript(({date,scopedItems})=>{
    localStorage.setItem('pc_help_seen','1');localStorage.setItem('pc_sound','0');localStorage.setItem('pc_country','UK');
    localStorage.setItem('pc_progress',JSON.stringify({day:date,idx:0,scores:[],guesses:[],pending:null,items:scopedItems}));
   },{date,scopedItems});
   await scopedPage.goto(base+'/games/lowball/index.html');
   const sf=await(await scopedPage.locator('#lowball-game-frame').elementHandle()).contentFrame();
   await sf.locator('#submitBtn').waitFor();
   for(const [i,item]of scopedItems.entries()){
    assert.equal(await sf.locator('#itemName').innerText(),P.label(item));
    assert.match(await sf.locator('#itemDetail').innerText(),/Reference checked 22 Oct 2026/);
    assert.equal(await sf.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Scoped details must fit');
    await sf.locator('#guessInput').fill(String(item.prices.UK));await sf.locator('#submitBtn').click();
    assert.equal(await sf.locator('#resultScore').innerText(),'100');
    if(i===0){assert.equal(await sf.locator('#resultFacts a').count(),2);assert.match(await sf.locator('#resultFacts a').nth(1).getAttribute('href'),/BAR-PRICE-LIST/);}
    if(i<scopedItems.length-1)await sf.locator('#nextBtn').click();
   }
   assert.deepEqual(scopedErrors,[]);await scopedContext.close();
   console.log('PASS Lowball price release '+width+'px: fresh/legacy drafts, all-day snapshots, region scope, pending receipt reload and practice isolation.');
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
