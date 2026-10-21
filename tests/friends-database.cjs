const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{PGlite}=require('@electric-sql/pglite');
const ids=['00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000003'];
const context={Intl,Date,Map,Set};vm.createContext(context);for(const f of ['daily-clock.js','arcade-score.js','pack-model.js','prior-model.js','laser-model.js','alibi-model.js','profile-records.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context);
(async()=>{const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
 for(const id of ids)await db.query('insert into auth.users values ($1)',[id]);
 await db.exec(fs.readFileSync('supabase/setup.sql','utf8'));await db.exec(fs.readFileSync('supabase/friends.sql','utf8'));await db.exec(fs.readFileSync('supabase/friends.sql','utf8'));
 const today=(await db.query("select timezone('Australia/Sydney',now())::date::text as d")).rows[0].d;
 const shift=n=>new Date(Date.parse(today+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
 for(let i=0;i<120;i++){const d=shift(-i);assert.deepEqual((await db.query('select public._friend_legacy($1) as a',[d])).rows[0].a,Array.from(context.BREAK_ROOM_RECORDS.legacyStakeAnswers(d)),'Legacy options match JavaScript on '+d);}
 const qs=Array.from({length:5},()=>({q:'Question',c:'Category',f:'Fact',o:['a','b','c'],a:0}));
 const stack=score=>({version:2,day:today,round:4,score,streak:5,results:Array.from({length:5},()=>({correct:true,points:score/5,mistakes:0})),order:[1,2,3,4,5],deadline:1,mistakes:0,status:'complete',stacks:Array.from({length:5},()=>({prompt:'Sort',fact:'Fact',ends:['First','Last'],cards:Array.from({length:5},(_,i)=>({name:'Item',value:i+1}))}))});
 const native={'stake':{},'stack-up':{},lowball:{pc_history:JSON.stringify({[(Date.parse(today+'T00:00:00Z')-Date.UTC(2026,9,1))/86400000]:0}),pc_last:shift(-1),pc_last_avg:'90'}};
 native.stake['stake:d:'+today]=JSON.stringify({b:[3,2,1,3,2],p:[0,1,0,-1,0],qs});
 native.stake['stake:d:'+shift(-1)]=JSON.stringify({b:[1,1,1,1,1],p:[0,0,0,0,0]});
 native.stake['stake:d:'+shift(-119)]=JSON.stringify({b:[1,1,1,1,1],p:[0,0,0,0,0],qs});
 native.stake['stake:d:'+shift(-120)]=native.stake['stake:d:'+today];native.stake['stake:d:'+shift(1)]=native.stake['stake:d:'+today];
 native.stake['stake:d:'+shift(-2)]='{"b":[3],"p":[]}';native.stake['stake:d:'+shift(-3)]='{bad';
 native['stack-up']['break-room:stack-up:daily:'+today]=JSON.stringify(stack(-400));
 const bankContext={window:{}};vm.runInNewContext(fs.readFileSync('games/pack/puzzles.js','utf8'),bankContext);const pm=context.BREAK_ROOM_PACK,bags=pm.daily(bankContext.window.PACK_PUZZLES,today);native.pack={[pm.PREFIX+today]:JSON.stringify({version:1,day:today,phase:'summary',round:2,selection:0,picks:bags.map(b=>pm.solve(b).mask),bags})};
 const prior=context.BREAK_ROOM_PRIOR,priorPairs=prior.daily(require('../content/prior-events.json').events,today),priorRun={version:1,day:today,phase:'summary',round:4,picks:priorPairs.map(prior.answer),pairs:priorPairs};native.prior={[prior.PREFIX+today]:JSON.stringify(priorRun),[prior.PREFIX+shift(-1)]:JSON.stringify({...priorRun,day:shift(-1),picks:priorPairs.map(p=>1-prior.answer(p))})};for(const n of [-119,-120,1])native.prior[prior.PREFIX+shift(n)]=JSON.stringify({...priorRun,day:shift(n)});
 const laserBank={window:{}};vm.runInNewContext(fs.readFileSync('games/laser/boards.js','utf8'),laserBank);const lm=context.BREAK_ROOM_LASER,lbs=lm.daily(laserBank.window.LASER_BOARDS,today),lps=lbs.map(b=>lm.solve(b)[0]),lr={version:1,edits:0,day:today,phase:'summary',round:3,boards:lbs,picks:lps,mirrors:lps[3]};native.laser={[lm.PREFIX+today]:JSON.stringify(lr)};for(const n of [-119,-120,1])native.laser[lm.PREFIX+shift(n)]=JSON.stringify({...lr,day:shift(n)});
 const alibiBank={window:{}};vm.runInNewContext(fs.readFileSync('games/alibi/cases.js','utf8'),alibiBank);const am=context.BREAK_ROOM_ALIBI,acs=am.daily(alibiBank.window.ALIBI_CASES,today),aps=acs.map(p=>am.solve(p)[0].culprit),ar={version:1,edits:0,day:today,phase:'summary',round:3,cases:acs,picks:aps,selection:aps[3],notes:acs.map(am.notes)};native.alibi={[am.PREFIX+today]:JSON.stringify(ar),[am.PREFIX+shift(-1)]:JSON.stringify({...ar,day:shift(-1),picks:aps.map((c,i)=>(c+1)%acs[i].n),selection:(aps[3]+1)%acs[3].n})};for(const n of [-119,-120,1])native.alibi[am.PREFIX+shift(n)]=JSON.stringify({...ar,day:shift(n)});
 const flat=Object.assign({},...Object.values(native)),map=new Map(Object.entries(flat)),storage={get length(){return map.size},key:i=>[...map.keys()][i],getItem:k=>map.get(k)??null};
 const expected=context.BREAK_ROOM_RECORDS.read(storage,today).records.filter(r=>r.date>=shift(-119)).map(r=>({game:r.game,date:r.date,arcadeScore:r.arcadeScore})).sort((a,b)=>(a.game+a.date).localeCompare(b.game+b.date));
 for(const [game,data]of Object.entries(native))await db.query('insert into public.game_saves(user_id,game,data) values($1,$2,$3)',[ids[0],game,JSON.stringify(data)]);
 const actual=(await db.query('select game,day::text as date,arcade_score as "arcadeScore" from public._friend_records($1,$2)',[ids[0],today])).rows.sort((a,b)=>(a.game+a.date).localeCompare(b.game+b.date));assert.equal(actual.length,expected.length);
 actual.forEach((r,i)=>{assert.equal(r.game,expected[i].game);assert.equal(r.date,expected[i].date);assert.ok(Math.abs(r.arcadeScore-expected[i].arcadeScore)<1e-9);});
 for(let i=0;i<30;i++){
  const bets=Array.from({length:5},(_,j)=>(i+j)%3+1),picks=Array.from({length:5},(_,j)=>(i+j)%4-1),questions=qs.map((q,j)=>({...q,a:(i+j)%3}));
  const native={b:bets,p:picks,qs:questions};const sql=(await db.query('select public._friend_score($1,$2,$3) as s',['stake',JSON.stringify(native),today])).rows[0].s;
  assert.ok(Math.abs(sql-context.BREAK_ROOM_SCORE.stake(bets,picks,questions.map(q=>q.a)))<1e-9);
 }
 for(const points of [-5000,0,15500,31000,50000])assert.equal((await db.query('select public._friend_score($1,$2,$3) as s',['stack-up',JSON.stringify(stack(points)),today])).rows[0].s,context.BREAK_ROOM_SCORE.stackUp(points));
 for(const field of ['day','round','status','score','stacks']){const bad=stack(31000);delete bad[field];assert.equal((await db.query('select public._friend_score($1,$2,$3) as s',['stack-up',JSON.stringify(bad),today])).rows[0].s,null,'Malformed Stack Up '+field+' must be excluded');}
 const session=async n=>{await db.exec('reset role;set role authenticated;');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[ids[n]]);};
 const hub=async(action='list',code=null,target=null,name=null,share=null)=>(await db.query('select public.friend_hub($1,$2,$3,$4,$5) as h',[action,code,target,name,share])).rows[0].h;
 const scores=async()=>(await db.query('select public.friend_scores() as s')).rows[0].s;
 await session(0);assert.equal((await hub()).me,null);const a=(await hub('enable',null,null,'Alice',true)).me;
 await session(1);const b=(await hub('enable',null,null,'Bob',false)).me;assert.equal((await scores()).records.length,0,'Stranger cannot see Alice');await hub('request',a.code);assert.equal((await scores()).records.length,0,'Pending sender cannot see Alice');await assert.rejects(hub('accept',null,ids[0]),/no longer available/);await assert.rejects(hub('request',a.code),/already exists/);
 await session(2);await assert.rejects(db.query('select public._friend_records($1,$2)',[ids[0],today]),/permission denied/);const c=(await hub('enable',null,null,'Carol',true)).me;assert.equal((await hub()).incoming.length,0);await assert.rejects(hub('request',c.code),/unavailable/);await assert.rejects(db.query('select * from public.friend_profiles'),/permission denied/);await assert.rejects(db.query('select * from public.friend_links'),/permission denied/);assert.equal((await db.query('select * from public.game_saves where user_id=$1',[ids[0]])).rows.length,0);
 await session(0);assert.equal((await hub()).incoming[0].name,'Bob');await hub('accept',null,ids[1]);assert.equal((await hub()).friends.length,1);
 await session(1);assert.equal((await scores()).records.length,expected.length,'Accepted friends see only derived completed scores');assert.ok((await scores()).records.every(r=>Object.keys(r).sort().join(',')==='arcadeScore,date,game,user_id'));
 await session(0);await hub('settings',null,null,'Alice',false);await session(1);assert.equal((await scores()).records.length,0,'Sharing off revokes score access');
 await session(0);await hub('settings',null,null,'Alice',true);await session(1);await hub('remove',null,ids[0]);assert.equal((await scores()).records.length,0,'Removal revokes score access');await hub('request',a.code);await hub('cancel',null,ids[0]);assert.equal((await hub()).outgoing.length,0);await hub('request',a.code);
 await session(0);await hub('decline',null,ids[1]);assert.equal((await hub()).incoming.length,0);
 await session(1);await hub('request',a.code);await session(0);await hub('block',null,ids[1]);assert.equal((await hub()).blocked.length,1);
 await session(1);await assert.rejects(hub('request',a.code),/unavailable/);await session(0);await hub('unblock',null,ids[1]);assert.equal((await hub()).blocked.length,0);
 await db.exec('reset role;set role anon;');await assert.rejects(db.query('select public.friend_scores()'),/permission denied/);await assert.rejects(db.query('select public.friend_hub()'),/permission denied/);await assert.rejects(db.query('select public._friend_records($1,$2)',[ids[0],today]),/permission denied/);
 console.log('PASS friends database: real PostgreSQL requests/acceptance/cancel/decline/remove/block, opt-in sharing, outsider/anonymous isolation, no raw saves, SQL/JS scoring parity, 120 legacy shuffle dates and exact 120-day window.');
 }finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
