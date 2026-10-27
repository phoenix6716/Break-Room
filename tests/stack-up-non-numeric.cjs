/* New non-numeric filters and captured time-unit save compatibility. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',fixed=new Date('2026-10-23T03:00:00Z'),day='2026-10-23';
async function sort(page){for(let value=1;value<=5;value++){const card=page.locator('.sort-card[data-value="'+value+'"]');let at=await card.evaluate(e=>[...e.parentElement.children].indexOf(e));while(at>value-1){await card.locator('button').first().click();at--;}}}
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const ctx=await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage(),width=390,errors=[];
 p.on('pageerror',e=>errors.push(e.message));await p.clock.setFixedTime(fixed);await p.goto(base+'/games/stack-up/index.html');
 const originalDaily=await p.evaluate(day=>localStorage.getItem('break-room:stack-up:daily:'+day),day);
   if(width===390){
   await p.locator('[data-mode=infinite]').click();
   const topics=await p.locator('#stack-topic option').evaluateAll(options=>options.map(o=>o.value));
   assert(!topics.some(t=>['NUMBER SENSE','PERIODIC TABLE','METALS','MATERIALS','GEOGRAPHY','AIRPORTS'].includes(t)));
   for(const topic of topics){
    await p.locator('#stack-topic').selectOption(topic);
    await sort(p);await p.locator('#check-button').click();await p.locator('#next-button').click();
    const s=await p.evaluate(()=>{
     const id=document.getElementById('cards').dataset.stackId,overrides=new Map(STACK_UP_REPLACEMENT_STACKS.map(s=>[s.id,s]));
     return [...STACK_UP_STACKS.map(s=>overrides.get(s.id)||s),...STACK_UP_FAMILIAR_STACKS].find(s=>s.id===id);
    });
    assert(s);assert(!/atomic number|melting point|density|surface area|latitude|longitude|field elevation|lengths of time|fortnight|Monday-to-Sunday|months in order/i.test(s.prompt));
    assert.notEqual(s.category,'NUMBER SENSE');
    if(topic==='familiar')assert.equal(s.collection,'familiar');else if(topic==='challenge')assert.notEqual(s.collection,'familiar');else if(topic!=='all')assert.equal(s.category,topic);
   }
   console.log('PASS Stack Up every Unlimited filter uses the replacement content, with settings applied on the next stack.');
  }

 assert.equal(await p.evaluate(day=>localStorage.getItem('break-room:stack-up:daily:'+day),day),originalDaily,'Practice never edits Daily');
 assert.deepEqual(errors,[]);await ctx.close();
  if(true){
 const archived={window:{}};vm.runInNewContext(fs.readFileSync('content/archive/2026-10-27/stack-up-familiar-stacks.js','utf8'),archived);
 const retired=archived.window.STACK_UP_FAMILIAR_STACKS.find(s=>/lengths of time/.test(s.prompt));
 const preserved={version:2,scoreVersion:2,day,round:0,score:0,streak:0,results:[],order:[5,4,3,2,1],deadline:fixed.getTime()+90000,mistakes:0,status:'playing',stacks:Array(5).fill(retired)};
 const ctx=await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage();await p.clock.setFixedTime(fixed);
 await ctx.addInitScript(({run,day})=>{const k='break-room:stack-up:daily:'+day;if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify(run));},{run:preserved,day});
 await p.goto(base+'/games/stack-up/index.html');assert.equal(await p.locator('#prompt').innerText(),retired.prompt);
 const snapshots=JSON.stringify(preserved.stacks);
 for(let round=0;round<5;round++){await sort(p);await p.locator('#check-button').click();await p.locator('#next-button').click();}
 assert.equal(await p.locator('#summary-score').innerText(),'3,100 points');
 assert.equal(await p.evaluate(day=>JSON.stringify(JSON.parse(localStorage.getItem('break-room:stack-up:daily:'+day)).stacks),day),snapshots);
 await p.reload();assert(await p.locator('#daily-summary').isVisible());await ctx.close();
 console.log('PASS Stack Up old time-unit Daily snapshots still complete and retain their original questions and scoring.');
 }


 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
