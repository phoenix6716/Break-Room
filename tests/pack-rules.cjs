const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{PGlite}=require('@electric-sql/pglite');
require('../pack-model.js');require('../arcade-score.js');require('../cloud-saves.js');require('../daily-clock.js');require('../profile-records.js');
const box={window:{}};vm.runInNewContext(fs.readFileSync('games/pack/puzzles.js','utf8'),box);const bank=box.window.PACK_PUZZLES,M=global.BREAK_ROOM_PACK,S=global.BREAK_ROOM_CLOUD_SAVES;
// Independent capacity-indexed dynamic programme, not the engine's subset solver.
function optimum(b){const dp=Array(b.limit+1).fill(-Infinity);dp[0]=0;for(const item of b.items)for(let w=b.limit;w>=item.weight;w--)dp[w]=Math.max(dp[w],dp[w-item.weight]+item.points);return Math.max(...dp);}
const day='2026-10-20',bags=structuredClone(M.daily(bank,day)),run={version:1,day,phase:'summary',round:2,selection:0,picks:bags.map(b=>M.solve(b).mask),bags};
assert.equal(bank.length,212);assert.equal(new Set(bank.map(b=>b.id)).size,212);
for(const b of bank){assert(M.validBag(b));const best=M.solve(b);assert.equal(best.points,optimum(b));assert.equal(best.count,1);let used=0,greedy=0;for(const item of b.items.slice().sort((a,b)=>b.points/b.weight-a.points/a.weight))if(used+item.weight<=b.limit){used+=item.weight;greedy+=item.points;}const gap=1-greedy/best.points;assert(gap>=({easy:.03,medium:.08,hard:.14}[b.difficulty]));assert(M.total(b,(1<<b.items.length)-1).weight>b.limit);}
assert.equal(M.record(run,day).arcadeScore,100);assert.equal(M.valid({...run,day:undefined},undefined),false);assert.equal(M.valid({...run,day:'2026-02-30'},'2026-02-30'),false);assert.equal(M.score(bags,[1,1,1]).points,bags.reduce((s,b)=>s+b.items[0].points,0));assert(M.score(bags,[1,1,1]).arcadeScore<100);
const key=M.PREFIX+day,raw=JSON.stringify(run),pending={...run,round:0,phase:'play',picks:[],selection:1},review={...pending,phase:'review',picks:[run.picks[0]]},next={...pending,round:1,picks:review.picks};
for(const r of [pending,review,next]){assert(M.valid(r,day));assert.equal(M.record(r,day),null);}
assert.equal(S.merge('pack',{[key]:JSON.stringify(next)},{[key]:JSON.stringify(review)})[key],JSON.stringify(next));assert.equal(S.merge('pack',{[key]:JSON.stringify({...run,picks:[1,1,1]})},{[key]:raw})[key],raw,'Completed cloud choice wins, regardless of score');assert.equal(S.merge('pack',{[key]:JSON.stringify({...pending,selection:2})},{[key]:JSON.stringify(pending)})[key],JSON.stringify(pending),'Equal-stage cloud selection wins');assert.throws(()=>S.clean('pack',{'pack:payment':'1'}));
const map=new Map([[key,raw]]),storage={get length(){return map.size},key:i=>[...map.keys()][i],getItem:k=>map.get(k)??null,setItem(){throw Error('Read only');}};
const records=global.BREAK_ROOM_RECORDS.read(storage,day);assert.equal(records.games.length,13);assert.equal(records.records[0].arcadeScore,100);assert.equal(records.total,1);assert(records.achievements.find(a=>a.id==='pack').earned);
assert.equal(global.BREAK_ROOM_SCORE.summary([{game:'pack',date:day,arcadeScore:80},{game:'stake',date:day,arcadeScore:0}],day).average,40);
const bad=[];const mutate=fn=>{const r=structuredClone(run);fn(r);bad.push(r);};
for(const field of ['version','day','round','selection','phase','picks','bags'])mutate(r=>delete r[field]);
mutate(r=>r.day='2026-10-19');mutate(r=>r.picks=[1,1]);mutate(r=>r.picks[0]=0);mutate(r=>r.picks[0]=999999);mutate(r=>r.picks[0]=1.5);mutate(r=>r.picks[0]=(1<<r.bags[0].items.length)-1);mutate(r=>r.phase='play');mutate(r=>r.round=1);mutate(r=>r.selection=-1);
for(const field of ['id','title','description','difficulty','limit','items'])mutate(r=>delete r.bags[0][field]);
for(const field of ['name','icon','weight','points'])mutate(r=>delete r.bags[0].items[0][field]);
mutate(r=>r.bags[0].items[0].weight=0);mutate(r=>r.bags[0].items[0].points=21);mutate(r=>r.bags[0].items[0].weight=.5);mutate(r=>r.bags[0].items[1].name=r.bags[0].items[0].name);mutate(r=>r.bags[0].limit=1e100);
for(const r of bad)assert.equal(M.record(r,day),null);
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
 await db.exec(fs.readFileSync('supabase/setup.sql','utf8'));await db.exec(fs.readFileSync('supabase/friends.sql','utf8'));
 // Emulate an installed older three-game constraint, then exercise the actual owner migration twice.
 await db.exec("alter table public.game_saves drop constraint game_saves_game_check;alter table public.game_saves add constraint game_saves_game_check check(game in ('stake','stack-up','lowball'));");
 await db.exec(fs.readFileSync('supabase/pack.sql','utf8'));await db.exec(fs.readFileSync('supabase/pack.sql','utf8'));
 const sql=async r=>(await db.query('select public._friend_score($1,$2,$3) as s',['pack',JSON.stringify(r),day])).rows[0].s;
 for(let i=0;i<bank.length;i+=3){const bags=Array.from({length:3},(_,j)=>bank[(i+j)%bank.length]),r={...run,bags,picks:bags.map(b=>M.solve(b).mask)};assert.equal(await sql(r),100);r.picks=[1,1,1];assert(Math.abs(await sql(r)-M.record(r,day).arcadeScore)<1e-9);}
 for(const r of bad)assert.equal(await sql(r),null,'SQL rejects malformed/incomplete records');assert.equal(await sql({...run,score:900000,arcadeScore:-10}),100,'Ignore self-reported score fields');
 const ids=['00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002'];for(const id of ids)await db.query('insert into auth.users values($1)',[id]);
 await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[ids[0]]);
 await db.query('select public.save_game($1,$2,$3)',['pack',JSON.stringify({[key]:raw}),0]);
 assert.equal((await db.query('select count(*)::int as n from public.game_saves')).rows[0].n,1);await assert.rejects(db.query('select public._friend_pack_score($1,$2)',[raw,day]),/permission denied/);await assert.rejects(db.query('select public.save_game($1,$2,$3)',['pack','{"pc_history":"{}"}',1]),/Unsupported/);
 await db.query("select set_config('request.jwt.claim.sub',$1,false)",[ids[1]]);assert.equal((await db.query('select count(*)::int as n from public.game_saves')).rows[0].n,0);
 await db.exec('reset role;set role anon');await assert.rejects(db.query('select public.save_game($1,$2,$3)',['pack','{}',0]),/permission denied/);
 console.log('PASS Pack: 212 independent exact optima, graded greedy trade-offs, native records/shared averages, progress merge order, malformed records, SQL/JS parity across every bag, repeatable existing-project migration and account privacy.');
}finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
