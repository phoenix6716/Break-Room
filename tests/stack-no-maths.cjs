/* Stack Up retirement: new selection excludes maths; captured runs remain valid. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{chromium}=require('playwright');
const ctx={window:{}};for(const p of ['stacks','familiar-stacks'])vm.runInNewContext(fs.readFileSync('games/stack-up/'+p+'.js','utf8'),ctx);
const original=ctx.window.STACK_UP_STACKS,familiar=ctx.window.STACK_UP_FAMILIAR_STACKS,pool=[...original,...familiar],playable=pool.filter(s=>s.category!=='NUMBER SENSE');
assert.equal(familiar.length,160);assert.equal(playable.filter(s=>s.collection!=='familiar').length,134);
assert(familiar.every(s=>s.category!=='NUMBER SENSE'&&!/calculations|fractions|percentages|metric lengths|metric masses|decimal data sizes/.test(s.prompt)));
const audit=JSON.parse(fs.readFileSync('content/stack-up-familiar.json')).stacks,files=new Map();
vm.runInNewContext(fs.readFileSync('scripts/build-familiar-stacks.cjs','utf8'),{require:id=>{assert.equal(id,'node:fs');return {readFileSync:p=>fs.readFileSync(p,'utf8'),writeFileSync:(p,v)=>files.set(p,v)};}});
for(const [p,v]of files)assert.equal(v,fs.readFileSync(p,'utf8'),'Reproducible '+p);
for(const s of familiar){const a=audit.find(a=>a.id===s.id);assert.equal(s.cards.length,5);s.cards.forEach((c,i)=>{assert.equal(c.value,i+1);assert.equal(c.detail,'');assert.equal(c.name,a.ordered[i].name);assert(!i||a.ordered[i].value>a.ordered[i-1].value);});}
const source=fs.readFileSync('games/stack-up/stack-up.js','utf8'),calendar=source.split('\n').filter(l=>/^ function (seeded|shuffle|dailySet)\(/.test(l)).join('\n');
const select=vm.runInNewContext('const pool='+JSON.stringify(pool)+';\n'+calendar+'\n(day)=>dailySet(day).map(i=>pool[i])');
for(const start of ['2026-10-25','2026-11-20','2027-03-21']){const all=[];for(let i=0;i<32;i++){const day=new Date(Date.parse(start+'T00:00:00Z')+86400000*i).toISOString().slice(0,10),rows=select(day);assert.deepEqual(Array.from(rows,s=>s.lane),[0,1,2,3,4]);all.push(...rows.map(s=>s.id));}assert.equal(new Set(all).size,160);}
const draw=source.split('\n').find(l=>/^ function nextPracticeStack\(/.test(l));assert(draw);
for(const category of ['familiar','challenge','all','NUMBER SENSE',...new Set(playable.map(s=>s.category))]){
 let eligible;new Function('pool','playablePool','load','clock','dailySet','practiceCategory','stackDeck',draw+';return nextPracticeStack();')(pool,playable,()=>null,{dayKey:()=> '2026-10-26'},()=>select('2026-10-26').map(s=>pool.findIndex(p=>p.id===s.id)),category,{pick:rows=>{eligible=rows;return rows[0];}});
 assert(eligible.length>0);assert(eligible.every(s=>s.category!=='NUMBER SENSE'),category+' maths leak');
}
console.log('PASS Stack Up: reproducible 160 non-maths defaults, five stable lanes, 32-day coverage, 134 active challenges and every Unlimited filter excludes maths.');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',day='2026-10-26',fixed=new Date(day+'T03:00:00Z'),key='break-room:stack-up:daily:'+day;
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const context=await browser.newContext({viewport:{width:390,height:1100},reducedMotion:'reduce'}),p=await context.newPage();await p.clock.install({time:fixed});await p.clock.pauseAt(fixed);await p.goto(base+'/games/stack-up/index.html');
 const initial=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert(initial.stacks.every(s=>s.category!=='NUMBER SENSE'));
 await p.locator('[data-mode=infinite]').click();assert.equal(await p.locator('#stack-topic option[value="NUMBER SENSE"]').count(),0);
 async function solve(){for(let value=1;value<=5;value++){const card=p.locator('.sort-card[data-value="'+value+'"]');let at=await card.evaluate(e=>[...e.parentElement.children].indexOf(e));while(at>value-1){await card.locator('button').first().click();at--;}}await p.locator('#check-button').click();await p.locator('#result-modal').waitFor({state:'visible'});}
 for(const category of ['familiar','challenge','all','GAMES','MUSIC']){await p.locator('#stack-topic').selectOption(category);await solve();await p.locator('#next-button').click();assert.notEqual(await p.locator('#category-tag').innerText(),'NUMBER SENSE');}
 await context.close();
 const old=original.find(s=>s.category==='NUMBER SENSE'),saved={version:2,scoreVersion:2,day,round:0,score:0,streak:0,results:[],order:[5,4,3,2,1],deadline:fixed.getTime()+90000,mistakes:0,status:'playing',stacks:JSON.parse(JSON.stringify(original.filter(s=>s.category==='NUMBER SENSE').slice(0,5)))};
 const legacy=await browser.newContext(),q=await legacy.newPage();await q.clock.install({time:fixed});await q.clock.pauseAt(fixed);await legacy.addInitScript(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(saved)});await q.goto(base+'/games/stack-up/index.html');assert.equal(await q.locator('#prompt').innerText(),old.prompt);assert.equal(await q.evaluate(key=>localStorage.getItem(key),key),JSON.stringify(saved));await legacy.close();
 console.log('PASS Stack Up live controls: fresh Daily has no maths, retired topic is absent, Familiar/Challenge/All/Games/Music draws work, and a captured maths Daily resumes without rewriting it.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
