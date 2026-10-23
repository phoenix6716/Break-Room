/* Real new/legacy journeys for the player-feedback release. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',fixed=new Date('2026-10-23T03:00:00Z'),day='2026-10-23';
async function sort(page){for(let value=1;value<=5;value++){const card=page.locator('.sort-card[data-value="'+value+'"]');let at=await card.evaluate(e=>[...e.parentElement.children].indexOf(e));while(at>value-1){await card.locator('button').first().click();at--;}}}
const dailyRaw=page=>page.evaluate(()=>localStorage.getItem(BREAK_ROOM_ALIBI.PREFIX+MIDNIGHT_ARCADE_CLOCK.dayKey()));
const selected=(process.env.ARCADE_TEST_GAMES||'').split(',').filter(Boolean),includes=id=>!selected.length||selected.includes(id);
if(selected.length&&!selected.some(id=>['alibi','stack-up'].includes(id)))throw Error('No Alibi or Stack Up flow requested.');
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [320,390,768,1100,1440]){
  const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.clock.setFixedTime(fixed);
  if(includes('alibi')){
  await p.goto(base+'/games/alibi/index.html');assert.equal(await p.locator('.alibi-timeline').count(),0);assert.match(await p.locator('.alibi-rule').innerText(),/FOLLOW THE EVIDENCE/);
  assert.equal(await p.locator('.alibi-catalogue>li').count(),4);assert.equal(await p.locator('.alibi-proof').count(),0);
  await p.locator('#toggle-notebook').click();await p.locator('#truth-note-0').selectOption('0');await p.locator('#exclude-note-0').click();await p.locator('#select-suspect-1').click();
  const draft=await dailyRaw(p);assert.equal(JSON.parse(draft).notes[0].objects[0],0);await p.reload();assert.equal(await dailyRaw(p),draft);assert.equal(await p.locator('#select-suspect-1').getAttribute('aria-pressed'),'true');
  await p.locator('#mode-unlimited').click();await p.locator('#mode-daily').click();assert.equal(await dailyRaw(p),draft);
  const mechanisms=new Set();
  for(let round=0;round<4;round++){
   const data=await p.evaluate(()=>{const id=document.querySelector('#engine-slot').dataset.caseId,p=[...ALIBI_CASES,...ALIBI_EVIDENCE_CASES].find(p=>p.id===id);return{mechanism:p.mechanism,culprit:BREAK_ROOM_ALIBI.solve(p)[0].culprit,n:p.n,reason:BREAK_ROOM_ALIBI.traceReason(p),name:p.names[BREAK_ROOM_ALIBI.solve(p)[0].culprit]};});mechanisms.add(data.mechanism);
   await p.locator('[data-choice="'+(round?data.culprit:(data.culprit+1)%data.n)+'"]').click();await p.locator('#confirm-accusation').click();
   assert.equal(await p.locator('.alibi-status.false').count(),0);assert.equal(await p.locator('.alibi-culprit').count(),1);const proof=await p.locator('.alibi-proof').innerText();assert(proof.includes(data.reason)&&proof.includes(data.name));assert.match(proof,/physical evidence/);
   const raw=await dailyRaw(p);await p.reload();assert.equal(await dailyRaw(p),raw);await p.locator('.alibi-full-reasoning summary').click();assert((await p.locator('.alibi-full-reasoning ol>li').count())>=3);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.locator('#next-case').click();
  }
  assert.equal(mechanisms.size,4);assert.equal(await p.locator('.arcade-score strong').innerText(),'75 / 100');await p.locator('#review-case-0').click();assert(await p.locator('#alibi-summary-review .alibi-key-evidence').isVisible());
  await p.goto(base+'/profile.html');await p.locator('#result-filter').selectOption('alibi');assert.match(await p.locator('.profile-result').innerText(),/75/);
  }
  if(includes('stack-up')){
  await p.goto(base+'/games/stack-up/index.html');assert.equal(await p.locator('#intro-screen').count(),0);assert(await p.locator('#game-interface').isVisible());assert.equal(await p.locator('.sort-card').count(),5);
  assert(!/10×|ten times/.test(await p.locator('body').innerText()));
  for(let round=0;round<5;round++){
   const current=await p.evaluate(()=>JSON.parse(localStorage.getItem('break-room:stack-up:daily:'+MIDNIGHT_ARCADE_CLOCK.dayKey())));assert.equal(current.scoreVersion,2);assert.equal(current.stacks[round].collection,'familiar');assert.equal(current.stacks[round].lane,round);
   await sort(p);await p.locator('#check-button').click();if(!round)assert.match(await p.locator('#result-detail').innerText(),/550 points/);await p.locator('#next-button').click();
  }
  assert.equal(await p.locator('#summary-score').innerText(),'3,100 points');assert.equal(await p.locator('#summary-arcade strong').innerText(),'100 / 100');assert.equal(await p.locator('#record-best').innerText(),'100');
  const saved=await p.evaluate(()=>localStorage.getItem('break-room:stack-up:daily:'+MIDNIGHT_ARCADE_CLOCK.dayKey()));await p.reload();assert(await p.locator('#daily-summary').isVisible());
  await p.locator('#summary-infinite').click();const id=await p.locator('#cards').getAttribute('data-stack-id');assert(id.startsWith('stack-familiar-'));
  await p.locator('#stack-topic').selectOption('challenge');assert.equal(await p.locator('#cards').getAttribute('data-stack-id'),id,'New topic waits for next stack');await sort(p);await p.locator('#check-button').click();assert.match(await p.locator('#result-detail').innerText(),/550 points/);await p.locator('#next-button').click();assert(!(await p.locator('#cards').getAttribute('data-stack-id')).startsWith('stack-familiar-'));
  await p.locator('#mode-daily').click();assert.equal(await p.evaluate(()=>localStorage.getItem('break-room:stack-up:daily:'+MIDNIGHT_ARCADE_CLOCK.dayKey())),saved);
  }
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);await ctx.close();console.log('PASS playtest changes '+width+'px: selected '+(selected.join(', ')||'alibi, stack-up')+' flows, save/reload/mode/score and layout checks.');
 }
 if(includes('stack-up')){
 const box={window:{}};vm.runInNewContext(fs.readFileSync('games/stack-up/stacks.js','utf8'),box);
 const legacy={version:2,day,round:0,score:0,streak:0,results:[],order:[5,4,3,2,1],deadline:fixed.getTime()+90000,mistakes:0,status:'playing',stacks:Array(5).fill(box.window.STACK_UP_STACKS[0])};
 const ctx=await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'reduce'}),p=await ctx.newPage();await p.clock.setFixedTime(fixed);await ctx.addInitScript(({legacy,day})=>{const k='break-room:stack-up:daily:'+day;if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify(legacy));},{legacy,day});await p.goto(base+'/games/stack-up/index.html');
 assert.match(await p.locator('#eyebrow').innerText(),/ORIGINAL SCORING/);await sort(p);await p.locator('#check-button').click();assert.match(await p.locator('#result-detail').innerText(),/5,500 points/);const stored=await p.evaluate(day=>JSON.parse(localStorage.getItem('break-room:stack-up:daily:'+day)),day);assert.equal(stored.scoreVersion,undefined);assert.equal(stored.score,5500);await ctx.close();
 }
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
