const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite');
for(const f of ['daily-clock.js','time-drop-model.js','arcade-score.js','profile-records.js','cloud-saves.js'])require('../'+f);
const M=BREAK_ROOM_TIME_DROP,B=JSON.parse(fs.readFileSync('content/time-drop-events.json','utf8')).events,day='2026-10-23',key=M.PREFIX+day,encode=JSON.stringify;
assert.equal(B.length,330);assert(B.every(M.event));assert.equal(new Set(B.map(e=>e.id)).size,B.length);
const oldBank=JSON.parse(fs.readFileSync('content/archive/2026-11-05-pre-time-drop-familiarity/time-drop-events.json','utf8')).events;
const prior=JSON.parse(fs.readFileSync('content/prior-events.json','utf8')).events;for(const e of prior){const copy=oldBank.find(x=>x.id==='prior-'+e.id);assert.equal(copy.year,e.year);for(const field of ['title','fact','source'])assert.equal(copy[field],e[field]);}
const review=JSON.parse(fs.readFileSync('design/content-reviews/2026-11-05-time-drop-familiarity.json','utf8')),anchors=new Set(review.editorialAnchorIds);
assert.equal(review.replacedIds.length,111);assert.equal(review.newIds.length,111);assert.equal(review.reworded.length,57);
for(const id of review.replacedIds)assert(!B.some(e=>e.id===id),'Specialist event is retired: '+id);
for(const id of review.retainedIds){const before=oldBank.find(e=>e.id===id),after=B.find(e=>e.id===id);for(const field of ['year','earliest','latest'])assert.equal(after[field],before[field],'Retained answer/range '+id);assert.equal(after.calendarSlot,M.deck(oldBank).flat().findIndex(e=>e.id===id),'Retained calendar position '+id);}
assert.throws(()=>M.deck(B.map((e,i)=>i?e:{...e,calendarSlot:331})),/calendar/);assert.throws(()=>M.deck(B.map((e,i)=>i?e:{...e,calendarSlot:B[1].calendarSlot})),/calendar/);
let all=[];for(let i=0;i<66;i++){const d=new Date(Date.UTC(2026,9,23+i)).toISOString().slice(0,10),set=M.daily(B,d);assert.equal(set.length,5);assert(new Set(set.map(e=>e.category)).size>=3);assert(set.filter(e=>anchors.has(e.id)).length>=2,'Two reviewed familiar anchors per Daily');assert.deepEqual(set,M.daily([...B].reverse(),d));all.push(...set.map(e=>e.id));}assert.equal(new Set(all).size,330,'No event repeats in any 66-day Daily cycle');
// Every possible release boundary preserves a full nonrepeating 66-day window.
const boundaryCache=new Map();for(let start=-65;start<66;start++){let ids=[];for(let i=start;i<start+66;i++){if(!boundaryCache.has(i)){const d=new Date(Date.UTC(2026,10,5+i)).toISOString().slice(0,10);boundaryCache.set(i,M.daily(i<0?oldBank:B,d).map(e=>e.id));}ids.push(...boundaryCache.get(i));}assert.equal(new Set(ids).size,330,'Mixed old/new release window '+start);}
assert.equal(M.span(-1,1),1);assert.equal(M.span(-44,44),87);
const example=(year,earliest=year,latest=year)=>({id:'fixture',year,earliest,latest,title:'Fixture event',category:'World',fact:'Fixture explanation',source:'https://example.com/source'});
assert.equal(M.result(example(1969),1972).points,940);assert.equal(M.result(example(-2560),-2460).points,800);assert.equal(M.result(example(1900),1900).band,'Bullseye');assert.equal(M.result(example(1900),1901).band,'Very close');
assert.equal(M.result(example(-2560,-2580,-2540),-2570).points,1000);assert.equal(M.result(example(-2560,-2580,-2540),-2570).exact,false);assert.equal(M.result(example(-2560,-2580,-2540),-2530).points,980);
for(const y of [-3999,-2560,-1,1,999,1000,1699,1700,1899,1900,2024]){let last=1001;for(let d=0;d<1000&&M.year(y+d);d++){const r=M.result(example(y),y+d);assert(r.points<=last&&r.points>=0&&r.points<=1000);last=r.points;}}
function completed(guess=e=>e.year){const r=M.create(B,day);for(let i=0;i<M.ROUNDS;i++){M.guess(r,guess(r.events[i],i));assert(M.lock(r));const raw=encode(r);assert.equal(M.guess(r,1900),false);assert.equal(M.lock(r),false);assert.equal(encode(r),raw);if(i<M.ROUNDS-1)M.next(r);}return r;}
const good=completed(),zero=completed(()=>-4000);assert.equal(M.record(good,day).points,5000);assert.equal(M.record(good,day).arcadeScore,100);assert.equal(M.record(zero,day).arcadeScore,0);assert.equal(M.record(M.create(B,day),day),null);
const bad=[];for(const f of [r=>r.version=3,r=>r.scoreVersion=2,r=>r.guess=0,r=>r.guess=1900,r=>r.round=3,r=>r.edits=-1,r=>r.edits='1',r=>r.events[1]=r.events[0],r=>r.events[0].year='1900',r=>r.events[0].source='http://example.com',r=>r.events[0].earliest=-4001,r=>r.events[0].latest=2101,r=>r.events[0].title='',r=>r.picks[0]=null,r=>r.picks[0]=1.5,r=>r.picks.pop(),r=>r.day='2026-02-30']){const r=structuredClone(good);f(r);bad.push(r);assert.equal(M.record(r,day),null);}
const C=BREAK_ROOM_CLOUD_SAVES,draft=M.create(B,day),edited=structuredClone(draft);M.guess(edited,1888);
assert.equal(C.merge('time-drop',{[key]:encode(edited)},{[key]:encode(draft)})[key],encode(edited));assert.equal(C.merge('time-drop',{[key]:encode(good)},{[key]:encode(zero)})[key],encode(zero),'First completed cloud run wins, including zero');
assert.throws(()=>C.clean('time-drop',{'break-room:prior:daily:2026-10-23':'{}'}));
const values={[key]:encode(good)},store={get length(){return Object.keys(values).length},key:i=>Object.keys(values)[i],getItem:k=>values[k]||null,setItem(){throw Error('read-only');}};
const profile=BREAK_ROOM_RECORDS.read(store,day);assert.equal(profile.records[0].game,'time-drop');assert.equal(profile.records[0].score,5000);assert.equal(profile.arcade.average,100);assert(profile.achievements.find(a=>a.id==='time-drop').earned);

// v1 snapshots retain all ten questions, first-lock progress and their original scale.
const legacy={...M.create(B,day),version:1,events:B.slice(0,10)};
assert(M.valid(legacy,day));M.guess(legacy,legacy.events[0].year);M.lock(legacy);
const legacyReview=structuredClone(legacy);assert(M.valid(legacyReview,day));
for(let i=1;i<10;i++){M.next(legacy);M.guess(legacy,legacy.events[i].year);M.lock(legacy);}
assert.equal(M.record(legacy,day).points,10000);assert.equal(M.record(legacy,day).arcadeScore,100);
assert.equal(M.record(legacy,day).maximum,10000);assert.equal(M.record(good,day).maximum,5000);
M.next(legacy);assert.equal(legacy.phase,'summary');assert(M.valid(legacy,day));
const legacyKey=M.PREFIX+day;
assert.equal(C.merge('time-drop',{[legacyKey]:encode(good)},{[legacyKey]:encode(legacy)})[legacyKey],encode(legacy));

const bosworth=oldBank.find(e=>e.id==='td-040');assert.equal(bosworth.year,1485);assert(!/Wars of the Roses end/.test(bosworth.title));assert(bosworth.fact.includes('1487'));const oldBosworth=require('../content/archive/2026-10-31-content-audit/time-drop-events.json').events.find(e=>e.id==='td-040');assert.equal(M.result(oldBosworth,1485).points,1000);
const capturedOld=M.create(oldBank,day),oldEvents=encode(capturedOld.events);for(let i=0;i<5;i++){M.guess(capturedOld,capturedOld.events[i].year);M.lock(capturedOld);if(i<4)M.next(capturedOld);}assert.equal(M.record(capturedOld,day).arcadeScore,100);assert.equal(encode(capturedOld.events),oldEvents,'Old captured bank is never rewritten');
const capturedOldTen={...M.create(oldBank,day),version:1,events:oldBank.slice(0,10)};for(let i=0;i<10;i++){M.guess(capturedOldTen,capturedOldTen.events[i].year);M.lock(capturedOldTen);if(i<9)M.next(capturedOldTen);}assert.equal(M.record(capturedOldTen,day).points,10000);
(async()=>{const db=new PGlite();try{
 await db.exec("create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;");
 for(const file of ['supabase/setup.sql','supabase/friends.sql','supabase/time-drop.sql','supabase/time-drop.sql'])await db.exec(fs.readFileSync(file,'utf8'));
 const score=async r=>(await db.query('select public._friend_score($1,$2,$3) s',['time-drop',encode(r),day])).rows[0].s;
 assert.equal(await score(good),100);assert.equal(await score(capturedOld),100);assert.equal(await score(capturedOldTen),100);assert.equal(await score(legacy),100);assert.equal(await score(legacyReview),null);assert.equal(await score(zero),0);assert.equal(await score({...good,score:0,arcadeScore:0}),100);for(const r of bad)assert.equal(await score(r),null);
 for(let offset=-500;offset<=500;offset+=13){const r=completed(e=>{let y=e.year+offset;if(y===0)y=1;return Math.max(-4000,Math.min(2100,y));});assert.equal(await score(r),M.record(r,day).arcadeScore);}
 const user='00000000-0000-4000-8000-000000000001';await db.query('insert into auth.users values($1)',[user]);await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user]);await db.query('select public.save_game($1,$2,$3)',['time-drop',encode({[key]:encode(good)}),0]);await assert.rejects(db.query('select public._friend_time_drop_score($1,$2)',[encode(good),day]),/permission denied/);await assert.rejects(db.query('select public.save_game($1,$2,$3)',['time-drop','{"br:cloud:owner":"secret"}',1]),/Unsupported/);
 await db.query("select set_config('request.jwt.claim.sub',$1,false)",['00000000-0000-4000-8000-000000000002']);assert.equal((await db.query('select count(*)::int n from public.game_saves')).rows[0].n,0);await db.exec('reset role;set role anon');await assert.rejects(db.query('select public.save_game($1,$2,$3)',['time-drop','{}',0]),/permission denied/);
 console.log('PASS Time Drop rules: 330 familiar events, 111 retired specialist events, 57 simpler titles, preserved Prior archive, frozen retained calendar positions, mixed-release 66-day coverage, reviewed anchors/category balance, scoring boundaries/BCE/ranges, old/new snapshots, immutable cloud completion, profile, SQL parity and private ownership.');
 }finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
