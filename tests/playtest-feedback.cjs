/* Independent ownership search, snapshot/SQL parity and familiar Stack Up release checks. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{PGlite}=require('@electric-sql/pglite');
for(const f of ['alibi-model','arcade-score','cloud-saves','profile-records'])require('../'+f+'.js');
const M=global.BREAK_ROOM_ALIBI,S=global.BREAK_ROOM_SCORE,box={window:{}};
for(const p of ['games/alibi/cases.js','games/alibi/evidence-cases.js','games/stack-up/stacks.js','games/stack-up/familiar-stacks.js'])vm.runInNewContext(fs.readFileSync(p,'utf8'),box);
const bank=JSON.parse(JSON.stringify(box.window.ALIBI_EVIDENCE_CASES)),familiar=JSON.parse(JSON.stringify(box.window.STACK_UP_FAMILIAR_STACKS));
function permutations(n){const out=[];function put(a){if(a.length===n){out.push(a);return;}for(let i=0;i<n;i++)if(!a.includes(i))put([...a,i]);}put([]);return out;}
const arrangements=new Map([4,5].map(n=>[n,permutations(n)]));
function accepts(rule,pos){const[type,a,b,d]=rule;if(type==='oneof')return (rule[2]>>>pos[a]&1)===1;if(type==='left')return pos[a]<pos[b];if(type==='next')return pos[a]-pos[b]===1;return Math.abs(pos[a]-pos[b])===d;}
function matched(p){if(p.mechanism==='custody')return p.trace.checks.findIndex(v=>v==='broken');const found=p.objects.flatMap((o,i)=>(p.mechanism==='inventory'?o.grams===p.trace.after-p.trace.before:p.trace.marks.every(m=>o.marks.includes(m)))?[i]:[]);assert.equal(found.length,1);return found[0];}
function independently(p){const rules=[...p.s,...p.evidence.map(e=>e.rule)],target=matched(p);return arrangements.get(p.n).filter(pos=>rules.every(r=>accepts(r,pos))).map(pos=>({culprit:pos.findIndex(v=>v===target),positions:pos}));}
function minimum(p){const rules=[...p.s,...p.evidence.map(e=>e.rule)],target=matched(p),rows=arrangements.get(p.n).map(pos=>({c:pos.indexOf(target),flags:rules.map(r=>accepts(r,pos))}));let best=rules.length;for(let mask=1;mask<1<<rules.length;mask++){const bits=mask.toString(2).replaceAll('0','').length;if(bits>=best)continue;if(new Set(rows.filter(w=>w.flags.every((v,i)=>!(mask&1<<i)||v)).map(w=>w.c)).size===1)best=bits;}return best;}
assert.equal(bank.length,128);assert.equal(new Set(bank.map(M.signature)).size,128);
for(let level=0;level<4;level++)for(const mechanism of ['trace','access','inventory','custody'])assert.equal(bank.filter(p=>p.level===level&&p.mechanism===mechanism).length,8);
for(const p of bank){
 assert(M.puzzle(p));const actual=independently(p);assert.equal(actual.length,1,p.id);assert.equal(M.solve(p)[0].culprit,actual[0].culprit);
 const proof=M.propagate(p);assert(proof.domains.every((d,i)=>d.length===1&&d[0]===actual[0].positions[i]),p.id+' explainable without guesses');
 assert(minimum(p)>=[2,3,4,5][p.level],p.id+' sufficient independent clues');
 assert(p.portraits.some(i=>i<4)&&p.portraits.some(i=>i>=4));assert.equal(new Set(p.portraits).size,p.n);
 assert(!Object.hasOwn(p,'culprit')&&!Object.hasOwn(p,'solution'),'No self-reported answer');
}
for(const start of ['2026-10-23','2026-11-07','2027-03-21']){
 const seen=new Set();for(let i=0;i<32;i++){const day=new Date(Date.parse(start+'T00:00:00Z')+i*86400000).toISOString().slice(0,10),cases=M.daily([...box.window.ALIBI_CASES,...bank],day);
 assert.equal(new Set(cases.map(p=>p.mechanism)).size,4);assert.deepEqual(cases.map(p=>p.level),[0,1,2,3]);assert.deepEqual(cases,M.daily([...bank,...box.window.ALIBI_CASES].reverse(),day));
 for(const p of cases){assert(!seen.has(p.id),'32-day repeat');seen.add(p.id);}}
}
assert.equal(familiar.length,160);for(let lane=0;lane<5;lane++)assert.equal(familiar.filter(s=>s.lane===lane).length,32);
const audit=JSON.parse(fs.readFileSync('content/stack-up-familiar.json')).stacks;
for(const s of familiar){const a=audit.find(a=>a.id===s.id);assert.equal(a.ordered.length,5);assert.equal(s.cards.length,5);s.cards.forEach((c,i)=>{assert.equal(c.value,i+1);assert.equal(c.detail,'');assert.equal(c.name,a.ordered[i].name);assert(!i||a.ordered[i].value>a.ordered[i-1].value);if(a.ordered[i].numerator!==undefined)assert.equal(a.ordered[i].value,a.ordered[i].numerator/a.ordered[i].denominator);});}
for(const path of ['scripts/build-familiar-stacks.cjs','scripts/build-alibi-evidence.cjs']){
 const files=new Map(),fake={readFileSync:p=>fs.readFileSync(p,'utf8'),writeFileSync:(p,v)=>files.set(p,v)};
 vm.runInNewContext(fs.readFileSync(path,'utf8'),{require:id=>id==='node:fs'?fake:id==='../alibi-model.js'?{}:require(id),globalThis:{BREAK_ROOM_ALIBI:M}});
 for(const [p,v]of files)assert.equal(v,fs.readFileSync(p,'utf8'),'Reproducible source: '+p);
}

const replacements=JSON.parse(JSON.stringify(box.window.STACK_UP_REPLACEMENT_STACKS));
const originalStacks=JSON.parse(JSON.stringify(box.window.STACK_UP_STACKS));
const retiredQuantitative=new Set(['PERIODIC TABLE','METALS','MATERIALS','GEOGRAPHY','AIRPORTS']);
assert.equal(replacements.length,105);
assert.deepEqual(replacements.map(s=>s.id).sort(),originalStacks.filter(s=>retiredQuantitative.has(s.category)).map(s=>s.id).sort());
const byId=new Map(replacements.map(s=>[s.id,s]));
const active=[...originalStacks.map(s=>byId.get(s.id)||s),...familiar].filter(s=>s.category!=='NUMBER SENSE');
assert.equal(active.length,294);assert.equal(active.filter(s=>s.collection!=='familiar').length,134);
const prohibited=/atomic number|melting point|density|surface area|latitude|longitude|field elevation|lengths of time|fortnight|Monday-to-Sunday|months in order|fraction|percentages|cuboids|diagonals|interior angle/i;
const fingerprints=new Set();
for(const s of active){
 assert(!retiredQuantitative.has(s.category));assert(!prohibited.test(s.prompt),s.id+' prohibited numerical task');
 assert.equal(s.cards.length,5);s.cards.forEach((c,i)=>{assert.equal(c.detail,'');assert.equal(c.value,i+1);});
 const fp=s.prompt+'|'+s.cards.map(c=>c.name).join('|');assert(!fingerprints.has(fp),'Duplicate active stack '+s.id);fingerprints.add(fp);
}
const replacementAudit=JSON.parse(fs.readFileSync('content/stack-up-familiar-challenge-audit.json')).stacks;
for(const s of replacements){const a=replacementAudit.find(a=>a.id===s.id);assert(a);assert(a.sources.length&&a.sources.every(s=>s.startsWith('https://')));assert.deepEqual(s.cards.map(c=>c.name),a.ordered.map(c=>c.name));assert(a.ordered.every((c,i)=>!i||c.value>a.ordered[i-1].value));}
const oldBox={window:{}};vm.runInNewContext(fs.readFileSync('content/archive/2026-10-27/stack-up-familiar-stacks.js','utf8'),oldBox);
const oldFamiliar=JSON.parse(JSON.stringify(oldBox.window.STACK_UP_FAMILIAR_STACKS));
assert.deepEqual(familiar.map(s=>s.id),oldFamiliar.map(s=>s.id));
assert.equal(familiar.filter((s,i)=>JSON.stringify(s)!==JSON.stringify(oldFamiliar[i])).length,40);
const selectorSource=fs.readFileSync('games/stack-up/stack-up.js','utf8').split('\n').filter(l=>/^ function (seeded|shuffle|dailySet)\(/.test(l)).join('\n');
const select=pool=>vm.runInNewContext('const pool='+JSON.stringify(pool)+';'+selectorSource+';(day)=>dailySet(day).map(i=>pool[i]);');
const beforeSelect=select([...originalStacks,...oldFamiliar]),afterSelect=select([...originalStacks.map(s=>byId.get(s.id)||s),...familiar]);
for(let i=0;i<64;i++){const day=new Date(Date.UTC(2026,9,25+i)).toISOString().slice(0,10);assert.deepEqual(Array.from(afterSelect(day),s=>s.id),Array.from(beforeSelect(day),s=>s.id),'Stable Daily slots '+day);}
assert(active.some(s=>/release|publication|historical milestones/i.test(s.prompt)),'Keep chronology');
console.log('PASS Stack Up content policy: 40 Daily and 105 Challenge replacements, all active filters free of numerical/time-unit tasks, unique content and stable date slots.');

const day='2026-10-23',cases=M.daily([...box.window.ALIBI_CASES,...bank],day),picks=cases.map(p=>M.solve(p)[0].culprit),run={version:1,day,edits:0,round:3,phase:'summary',cases,picks,selection:picks[3],notes:cases.map(M.notes)};
const key=M.PREFIX+day,raw=JSON.stringify(run);assert.equal(M.record(run,day).arcadeScore,100);
assert.equal(BREAK_ROOM_CLOUD_SAVES.clean('alibi',{[key]:raw})[key],raw);
const bad=[];const mutate=fn=>{const r=structuredClone(run);fn(r);bad.push(r);};
mutate(r=>r.notes[0].objects[0]=99);mutate(r=>delete r.notes[0].objects);mutate(r=>r.cases[0].objects[0].name=r.cases[0].objects[1].name);mutate(r=>r.cases[0].s[0][2]=1<<r.cases[0].n);mutate(r=>r.cases[0].evidence[0].title=' ');mutate(r=>r.cases[0].portraits[0]=r.cases[0].portraits[1]);
mutate(r=>r.cases.find(p=>p.mechanism==='inventory').trace.after=0);mutate(r=>r.cases.find(p=>p.mechanism==='custody').trace.checks=['broken','intact','intact','intact']);mutate(r=>{const p=r.cases.find(p=>p.mechanism==='trace');p.trace.marks[1]=p.trace.marks[0];});
for(const r of bad)assert.equal(M.record(r,day),null);
const stack=(points,scoreVersion)=>({version:2,...(scoreVersion===undefined?{}:{scoreVersion}),day,round:4,score:points,streak:5,results:Array.from({length:5},()=>({correct:true,points:points/5,mistakes:0})),order:[1,2,3,4,5],deadline:1,mistakes:0,status:'complete',stacks:Array.from({length:5},()=>familiar[0])});
assert.equal(S.stackUp(15500),50);assert.equal(S.stackUp(1550,2),50);assert.equal(S.stackUp(3100,2),100);assert.equal(S.stackUp(-40,2),0);assert.equal(S.stackUp(3100,7),null);
const profileData=new Map([[key,raw],['break-room:stack-up:daily:'+day,JSON.stringify(stack(1550,2))]]),storage={getItem:k=>profileData.get(k)||null,key:i=>[...profileData.keys()][i],get length(){return profileData.size;},setItem(){throw Error('Read-only');}};
const profile=BREAK_ROOM_RECORDS.read(storage,day);assert.equal(profile.records.find(r=>r.game==='stack-up').arcadeScore,50);assert.equal(profile.records.find(r=>r.game==='alibi').arcadeScore,100);
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
 await db.exec(fs.readFileSync('supabase/setup.sql','utf8'));await db.exec(fs.readFileSync('supabase/friends.sql','utf8'));
 const score=async r=>(await db.query('select public._friend_alibi_score($1,$2) as value',[JSON.stringify(r),day])).rows[0].value;
 for(const p of bank)assert.equal((await db.query('select public._friend_alibi_culprit($1) as c',[JSON.stringify(p)])).rows[0].c,independently(p)[0].culprit,p.id);
 for(let mask=0;mask<16;mask++){const r=structuredClone(run);r.picks=r.picks.map((c,i)=>mask&1<<i?c:(c+1)%r.cases[i].n);r.selection=r.picks[3];assert.equal(await score(r),M.record(r,day).arcadeScore);}
 for(const r of bad)assert.equal(await score(r),null);
 assert.equal(await score({...run,culprit:999,arcadeScore:0}),100,'Ignore supplied scores');
 const oldCases=M.daily(box.window.ALIBI_CASES,day),oldPicks=oldCases.map(p=>M.solve(p)[0].culprit),old={...run,cases:oldCases,picks:oldPicks,selection:oldPicks[3],notes:oldCases.map(M.notes)};
 assert.equal(await score(old),100,'Existing visit files remain valid');
 for(const path of ['supabase/inner-clock.sql','supabase/playtest-feedback.sql','supabase/playtest-feedback.sql']){await db.exec(fs.readFileSync(path,'utf8'));assert.equal(await score(run),100);assert.equal(await score(old),100);}
 for(const version of [undefined,1,2])for(const points of [-40,0,1550,3100,15500,31000])assert.equal((await db.query('select public._friend_score($1,$2,$3) as value',['stack-up',JSON.stringify(stack(points,version)),day])).rows[0].value,S.stackUp(points,version));
 assert.equal((await db.query('select public._friend_score($1,$2,$3) as value',['stack-up',JSON.stringify(stack(3100,'2')),day])).rows[0].value,null);
 await db.exec('set role authenticated');await assert.rejects(db.query('select public._friend_alibi_evidence($1)',[JSON.stringify(cases[0])]),/permission denied/);
 await db.exec('reset role;set role anon');await assert.rejects(db.query('select public._friend_alibi_evidence($1)',[JSON.stringify(cases[0])]),/permission denied/);
 console.log('PASS playtest feedback: 128 independent evidence deductions, proof chains, 32-day variety, 160 familiar stacks, reproducible sources, snapshots/cloud/profile, all Alibi outcomes and SQL score-version/privacy parity.');
 }finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
