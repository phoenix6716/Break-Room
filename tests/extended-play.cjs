/* Extended actual-engine sessions, independent practice state and responsive controls. */
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8037',fixed=new Date('2026-10-20T03:00:00Z');
const games={};
const native=p=>p.evaluate(()=>JSON.stringify(Object.entries(localStorage).filter(([k])=>['break-room:pack:daily:','break-room:prior:daily:','break-room:stack-up:daily:','stake:d:','pc_progress','pc_history','pc_played','pc_last_avg'].some(prefix=>k.startsWith(prefix))).sort()));
async function selectBag(p,mask){const buttons=p.locator('.pack-item');for(let i=0;i<await buttons.count();i++){const b=buttons.nth(i);if((await b.getAttribute('aria-pressed')==='true')!==!!(mask&(1<<i)))await b.click();}}
games.pack=async(p,width)=>{
 await p.goto(base+'/games/pack/index.html');await p.locator('.pack-item').first().click();const saved=await native(p);await p.locator('#mode-unlimited').click();const ids=new Set();
 for(let i=0;i<30;i++){
  const id=await p.locator('#engine-slot').getAttribute('data-puzzle-id');assert(!ids.has(id),'Pack must not repeat an available bag in a session');ids.add(id);
  const bag=await p.evaluate(id=>PACK_PUZZLES.find(b=>b.id===id),id);if(i>=6)assert.equal(bag.difficulty,'hard');
  if(i===5){await p.locator('#pack-difficulty').selectOption('hard');assert.equal(await p.locator('#engine-slot').getAttribute('data-puzzle-id'),id,'Changing next difficulty cannot discard a current bag');}
  if(i===0){await selectBag(p,1);await p.locator('#clear-bag').click();assert(await p.locator('#lock-bag').isDisabled());assert.match(await p.locator('#capacity-remaining').innerText(),/left in your bag/);}
  const best=await p.evaluate(b=>BREAK_ROOM_PACK.solve(b).mask,bag);await selectBag(p,i===0?1:best);await p.locator('#lock-bag').click();assert.match(await p.locator('.practice-summary').innerText(),new RegExp('^'+(i+1)+' bags?'));
  if(i===12){await p.locator('#mode-daily').click();assert.equal(await native(p),saved);await p.locator('#mode-unlimited').click();assert(await p.locator('#next-bag').isVisible());assert.equal(await p.locator('#engine-slot').getAttribute('data-puzzle-id'),id);await p.screenshot({path:'/tmp/br-extended-pack-'+width+'.png',fullPage:true});}
  await p.locator('#next-bag').click();
 }
 assert.equal(await native(p),saved);assert.match(await p.locator('.practice-summary').innerText(),/30 bags/);assert.equal(await p.locator('[data-summary-stat=played]').innerText(),'0');
};
games.prior=async(p,width)=>{
 await p.goto((process.env.ARCADE_LEGACY_TEST_URL||base)+'/games/prior/index.html');await p.locator('[data-choice="0"]').click();const saved=await native(p);await p.locator('#mode-unlimited').click();const pairs=new Set();let last=[];
 for(let i=0;i<30;i++){
  const ids=(await p.locator('#engine-slot').getAttribute('data-pair-ids')).split('|'),key=ids.slice().sort().join('|');assert(!pairs.has(key));pairs.add(key);assert(ids.every(id=>!last.includes(id)),'Prior avoids immediately repeating an event');last=ids;
  if(i>=6)assert.equal(await p.locator('#engine-slot').getAttribute('data-difficulty'),'hard');
  if(i===5){await p.locator('#prior-difficulty').selectOption('hard');assert.equal(await p.locator('#engine-slot').getAttribute('data-pair-ids'),ids.join('|'));}
  assert.equal(await p.locator('.prior-year,.prior-notes a').count(),0);
  const answer=await p.evaluate(ids=>{const events=ids.map(id=>PRIOR_EVENTS.find(e=>e.id===id));return BREAK_ROOM_PRIOR.answer(events);},ids);await p.locator('[data-choice="'+(i%3===0?1-answer:answer)+'"]').click();assert.equal(await p.locator('.prior-year').count(),2);assert.equal(await p.locator('.prior-notes a').count(),2);assert.equal(await p.locator('[data-choice]:disabled').count(),2);
  if(i===12){await p.locator('#mode-daily').click();assert.equal(await native(p),saved);await p.locator('#mode-unlimited').click();assert.equal(await p.locator('#engine-slot').getAttribute('data-pair-ids'),ids.join('|'));assert(await p.locator('#next-pair').isVisible());await p.screenshot({path:'/tmp/br-extended-prior-'+width+'.png',fullPage:true});}
  await p.locator('#next-pair').click();
 }
 assert.equal(await native(p),saved);assert.match(await p.locator('.practice-summary').innerText(),/30 pairs · 66.7% correct/);assert.equal(await p.locator('[data-summary-stat=played]').innerText(),'0');
};
async function sortStack(p){for(let value=1;value<=5;value++){let at=await p.locator('.sort-card[data-value="'+value+'"]').evaluate(e=>[...e.parentNode.children].indexOf(e));while(at>value-1){await p.locator('.sort-card[data-value="'+value+'"] button').first().click();at--;}}}
games.stack=async(p,width)=>{
 await p.goto(base+'/games/stack-up/index.html');await p.locator('[data-mode=daily]').click();for(let i=0;i<5;i++){await sortStack(p);await p.locator('#check-button').click();await p.locator('#next-button').click();}const saved=await native(p);await p.locator('[data-mode=infinite]').click();const ids=new Set();
 for(let i=0;i<30;i++){
  const id=await p.locator('#cards').getAttribute('data-stack-id');assert(!ids.has(id));ids.add(id);
  if(i===19){await p.locator('#stack-topic').selectOption('AIRPORTS');assert.equal(await p.locator('#cards').getAttribute('data-stack-id'),id);}
  if(i>=20)assert.equal(await p.locator('#category-tag').innerText(),'AIRPORTS');
  if(i===12){const order=await p.locator('.sort-card').evaluateAll(nodes=>nodes.map(e=>e.dataset.value));await p.clock.runFor(2500);await p.locator('[data-mode=daily]').click();assert.equal(await native(p),saved);await p.locator('[data-mode=infinite]').click();assert.equal(await p.locator('#cards').getAttribute('data-stack-id'),id);assert.deepEqual(await p.locator('.sort-card').evaluateAll(nodes=>nodes.map(e=>e.dataset.value)),order);assert.match(await p.locator('#timer').innerText(),/01:2[78]/);await p.screenshot({path:'/tmp/br-extended-stack-'+width+'.png',fullPage:true});}
  if(i===29){await p.clock.runFor(91000);assert.match(await p.locator('#result-title').innerText(),/clock/);}else{await sortStack(p);if(i===0)await p.locator('.sort-card').first().press('Enter');else await p.locator('#check-button').click();}
  await p.locator('#next-button').click();
 }
 assert.match(await p.locator('.practice-summary').innerText(),/30 stacks · 29 cleared/);assert.equal(await native(p),saved);assert.equal(await p.locator('#record-played').innerText(),'1');
};
games.stake=async(p,width)=>{
 await p.goto((process.env.ARCADE_LEGACY_TEST_URL||base)+'/games/stake/index.html');for(let i=0;i<5;i++){await p.locator('.chip').first().click();const a=await p.evaluate(()=>getQ(run,run.p.length).a);await p.locator('button.opt').nth(a).click();await p.locator('.next-question').click();}const saved=await native(p),daily=await p.evaluate(()=>run.qs.map(q=>q.q));await p.getByRole('tab',{name:'Unlimited',exact:true}).click();const questions=new Set(),category=await p.evaluate(()=>Object.entries(BANK.reduce((a,q)=>(a[q.c]=(a[q.c]||0)+1,a),{})).sort((a,b)=>b[1]-a[1])[0][0]);
 for(let i=0;i<30;i++){
  const q=await p.evaluate(()=>getQ(unl,unl.p.length));assert(!questions.has(q.q));questions.add(q.q);assert(!daily.includes(q.q));if(i>=20)assert.equal(q.c,category);
  if(i===19){await p.locator('#stake-topic').selectOption(category);assert.equal(await p.evaluate(()=>getQ(unl,unl.p.length).q),q.q);}
  await p.getByRole('button',{name:'Bet '+(i%3+1)+' '+(i%3===0?'chip':'chips'),exact:true}).click();
  if(i===12){const deadline=await p.evaluate(()=>unl.deadline);await p.clock.runFor(9000);await p.getByRole('tab',{name:'Daily',exact:true}).click();await p.getByRole('tab',{name:'Unlimited',exact:true}).click();assert.equal(await p.evaluate(()=>unl.deadline),deadline);assert.equal(await p.locator('#question-time').innerText(),'00:21');await p.screenshot({path:'/tmp/br-extended-stake-'+width+'.png',fullPage:true});}
  if(i===29){await p.clock.runFor(30000);assert.match(await p.locator('.banner').innerText(),/Time’s up/);}else await p.locator('button.opt').nth(i%3===0?(q.a+1)%3:q.a).click();
  await p.locator('.next-question').click();
 }
 assert.equal(await p.evaluate(()=>unl.p.length),30);const accuracy=await p.evaluate(()=>BREAK_ROOM_SCORE.format(BREAK_ROOM_SCORE.stake(unl.b,unl.p,unl.qs.slice(0,unl.p.length).map(q=>q.a))));assert.match(await p.locator('.practice-summary').innerText(),/30 answered/);assert((await p.locator('.practice-summary').innerText()).includes(accuracy+'% chips on right answers'));assert.equal(await native(p),saved);
};
games.lowball=async(p,width)=>{
 await p.addInitScript(()=>{localStorage.setItem('pc_help_seen','1');localStorage.setItem('pc_sound','0');});await p.goto(base+'/games/lowball/index.html');const f=await(await p.locator('iframe').elementHandle()).contentFrame();await f.locator('#guessInput').fill('12.34');await f.locator('#unlimitedModeBtn').click();await f.locator('#normalModeBtn').click();assert.equal(await f.locator('#guessInput').inputValue(),'12.34','Daily draft survives a mode switch');
 for(let i=0;i<4;i++){const price=await f.evaluate(()=>currentItem.prices[country]);await f.locator('#guessInput').fill(String(price));await f.locator('#guessInput').press('Enter');await f.locator('#nextBtn').click();}const saved=await native(p),daily=await f.evaluate(()=>pickDailyItems().map(item=>item.name));await f.locator('#playAgainBtn').click();const names=new Set();
 for(let i=0;i<30;i++){
  const name=await f.locator('#itemName').innerText();assert(!names.has(name));assert(!daily.includes(name));names.add(name);
  const price=await f.evaluate(()=>currentItem.prices[country]);await f.locator('#guessInput').fill(String(i%2===0?price*1.4:price));await f.locator('#guessInput').press('Enter');assert.equal(await f.evaluate(()=>roundScores.length),i+1);assert.match(await f.locator('.practice-summary').innerText(),new RegExp('^'+(i+1)+' priced'));
  if(i===10){await f.evaluate(()=>submitGuess());assert.equal(await f.evaluate(()=>roundScores.length),i+1,'Repeated submission is ignored after reveal');}
  if(i===12){const receipt=await f.locator('#resultFacts').innerText();await f.locator('#normalModeBtn').click();assert.equal(await native(p),saved);await f.locator('#unlimitedModeBtn').click();assert.equal(await f.locator('#resultFacts').innerText(),receipt);assert.equal(await f.evaluate(()=>roundScores.length),i+1);await p.screenshot({path:'/tmp/br-extended-lowball-'+width+'.png',fullPage:true});}
  if(i<29)await f.locator('#nextBtn').click();
 }
 await f.locator('#finish-practice').click();assert.equal(await f.locator('#finalTitle').innerText(),'30 items priced');assert.equal(await f.locator('#finalTotal').innerText(),'80');assert.equal(await native(p),saved);await f.locator('#playAgainBtn').click();
 for(let i=0;i<3;i++){const name=await f.locator('#itemName').innerText();assert(!names.has(name),'A new session continues the unplayed item pool');names.add(name);const price=await f.evaluate(()=>currentItem.prices[country]);await f.locator('#guessInput').fill(String(price));await f.locator('#guessInput').press('Enter');await f.locator('#nextBtn').click();}
 assert.match(await f.locator('.practice-summary').innerText(),/3 priced · 100 \/ 100 average/);assert.equal(await native(p),saved);assert.equal(await f.locator('#soundBtn').count(),1);
};
// GAME_SESSIONS
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{for(const width of [320,390,768,1100,1440])for(const [name,play]of Object.entries(games)){
 if(process.env.ONLY_GAME&&process.env.ONLY_GAME!==name)continue;const c=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});await p.clock.install({time:fixed});await p.clock.pauseAt(new Date(fixed.getTime()+1000));await p.clock.setSystemTime(fixed);await play(p,width);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal overflow');assert.deepEqual(errors,[]);await c.close();console.log(`PASS extended ${name} ${width}px: 30 actual rounds, variation, clear feedback, mode continuity and unchanged Daily records.`);
}}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
