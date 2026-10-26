const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{PGlite}=require('@electric-sql/pglite');
const ids=Array.from({length:4},(_,i)=>'00000000-0000-4000-8000-'+String(i+1).padStart(12,'0'));
(async()=>{const db=new PGlite();try{
await db.exec("create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;");
for(const f of ['setup','friends','hidden-gem','shift-work','leagues','leagues'])await db.exec(fs.readFileSync('supabase/'+f+'.sql','utf8'));
for(let i=0;i<4;i++){await db.query('insert into auth.users values($1)',[ids[i]]);await db.query('insert into public.friend_profiles(user_id,display_name) values($1,$2)',[ids[i],['Alice','Bob','Cara','Dan'][i]]);}
const today=(await db.query("select timezone('Australia/Sydney',now())::date::text d")).rows[0].d;
const as=async id=>{await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id||'']);};
const rpc=async(a='list',l=null,t=null,n=null,c=false,target=null)=>(await db.query('select public.league_hub($1,$2,$3,$4,$5,$6,$7) x',[a,l,t,n,'Player',c,target])).rows[0].x;
await as(null);await assert.rejects(rpc(),/Sign in/);
await db.exec('reset role;set role anon');await assert.rejects(rpc(),/permission denied/);
await as(ids[0]);await assert.rejects(rpc('create',null,null,'Lunch',false),/Confirm/);
let a=await rpc('create',null,null,'Lunch',true);const league=a.selected.id,token=a.invite;assert.match(token,/^[a-f0-9]{32}$/);assert.equal(a.selected.rows.length,1);assert.equal(a.selected.rows[0].total,0);assert.equal(a.selected.rows[0].optional,null);
assert.equal(JSON.stringify(a).includes('email'),false);
await assert.rejects(db.query('select * from br_league.members'),/permission denied/);
await assert.rejects(db.query('select br_league.records($1,$2)',[ids[1],today]),/permission denied/);
await as(ids[1]);assert.equal((await rpc()).leagues.length,0);await assert.rejects(rpc('view',league),/unavailable/);await assert.rejects(rpc('join',null,token,null,false),/Confirm/);
let b=await rpc('join',null,token,null,true);assert.equal(b.selected.rows.length,2);assert.equal(b.selected.owner,false);assert(b.selected.rows.every(r=>r.rank===1));
await assert.rejects(rpc('invite',league),/Only/);await assert.rejects(rpc('remove',league,null,null,false,ids[0]),/Only/);
await as(ids[0]);a=await rpc('invite',league);assert.notEqual(a.invite,token);const fresh=a.invite;
await as(ids[2]);await assert.rejects(rpc('join',null,token,null,true),/unavailable/);await rpc('join',null,fresh,null,true);
await db.exec('reset role');await db.query('insert into public.friend_blocks(owner_id,target_id) values($1,$2)',[ids[0],ids[3]]);
await as(ids[3]);await assert.rejects(rpc('join',null,fresh,null,true),/unavailable/);
await db.exec('reset role');await db.query('insert into public.friend_blocks(owner_id,target_id) values($1,$2)',[ids[0],ids[2]]);
await as(ids[0]);assert.equal((await rpc('view',league)).selected.rows.some(r=>r.id===ids[2]),false);
await as(ids[2]);assert.equal((await rpc('view',league)).selected.rows.some(r=>r.id===ids[0]),false);
await db.exec('reset role');await db.exec('delete from public.friend_blocks');
// Shared normalized records are equivalent to existing scorers for all ten active games.
for(const f of ['pack','laser','inner-clock','time-drop','clue-ladder','seating-chart','hidden-gem','shift-work'])require('../'+f+'-model.js');
const day=today,data={};
function bank(path,name){const c={window:{}};vm.runInNewContext(fs.readFileSync(path,'utf8'),c);return c.window[name];}
const pm=BREAK_ROOM_PACK,bags=pm.daily(bank('games/pack/puzzles.js','PACK_PUZZLES'),day);data.pack={[pm.PREFIX+day]:JSON.stringify({version:1,day,phase:'summary',round:2,selection:0,picks:bags.map(b=>pm.solve(b).mask),bags})};
const lm=BREAK_ROOM_LASER,boards=lm.daily(bank('games/laser/boards.js','LASER_BOARDS'),day),picks=boards.map(b=>lm.solve(b)[0]);data.laser={[lm.PREFIX+day]:JSON.stringify({version:1,edits:0,day,phase:'summary',round:3,boards,picks,mirrors:picks[3]})};
const im=BREAK_ROOM_INNER_CLOCK,targets=im.daily(day);data['inner-clock']={[im.PREFIX+day]:JSON.stringify({version:1,edits:1,day,phase:'summary',round:4,targets,picks:targets.map(elapsed=>({elapsed,kind:'stop'})),startedAt:null})};
const tm=BREAK_ROOM_TIME_DROP,tr=tm.create(require('../content/time-drop-events.json').events,day);for(let i=0;i<5;i++){tm.guess(tr,tr.events[i].year);tm.lock(tr);if(i<4)tm.next(tr);}data['time-drop']={[tm.PREFIX+day]:JSON.stringify(tr)};
const cm=BREAK_ROOM_CLUE_LADDER,cr=cm.create(require('../content/clue-ladder-puzzles.json').puzzles,day);for(let i=0;i<5;i++){cm.submit(cr,cr.puzzles[i].answer);if(i<4)cm.next(cr);}data['clue-ladder']={[cm.PREFIX+day]:JSON.stringify(cr)};
const sm=BREAK_ROOM_SEATING_CHART,sr=sm.create(require('../content/seating-chart-puzzles.json').tables,day);for(let i=0;i<5;i++){sm.edit(sr,sr.tables[i].solution);sm.submit(sr);if(i<4)sm.next(sr);}data['seating-chart']={[sm.PREFIX+day]:JSON.stringify(sr)};
const hm=BREAK_ROOM_HIDDEN_GEM,hr=hm.create(require('../content/hidden-gem-questions.json').questions,day);hm.begin(hr,1000);for(let i=0;i<5;i++){hm.draft(hr,hr.questions[i].answers.find(a=>a.points===100).name,1001);hm.finish(hr,1002);if(i<4)hm.next(hr,1000);}data['hidden-gem']={[hm.PREFIX+day]:JSON.stringify(hr)};
const wm=BREAK_ROOM_SHIFT_WORK,wr=wm.create(wm.daily(require('../content/shift-work-boards.json').boards,day),day);for(let j=0;j<3;j++){for(const[i,d]of wm.solve(wr.boards[j],wr.pos).path)wm.apply(wr,i,d);if(j<2)wm.next(wr);}data['shift-work']={[wm.PREFIX+day]:JSON.stringify(wr)};
data.lowball={pc_history:JSON.stringify({[(Date.parse(day+'T00:00:00Z')-Date.UTC(2026,9,1))/86400000]:0})};
data['stack-up']={['break-room:stack-up:daily:'+day]:JSON.stringify({version:2,scoreVersion:2,day,round:4,score:1550,streak:5,results:Array.from({length:5},()=>({correct:true,points:310,mistakes:0})),order:[1,2,3,4,5],deadline:1,mistakes:0,status:'complete',stacks:Array.from({length:5},()=>({prompt:'Sort',fact:'Secret fact',ends:['First','Last'],cards:Array.from({length:5},(_,i)=>({name:'Item',value:i+1}))}))})};
await db.exec('reset role');for(const [game,d] of Object.entries(data)){const table=game==='hidden-gem'?'hidden_gem_saves':game==='shift-work'?'shift_work_saves':'game_saves';await db.query('insert into public.'+table+'(user_id,game,data) values($1,$2,$3)',[ids[0],game,JSON.stringify(d)]);}
const records=(await db.query('select br_league.records($1,$2) x',[ids[0],day])).rows[0].x;assert.equal(records.length,10);assert.equal(records.find(r=>r.game==='inner-clock').arcadeScore,100);assert.equal(records.find(r=>r.game==='lowball').arcadeScore,0);
const old=(await db.query('select * from public._friend_records($1,$2) union all select * from public._hg_records($1,$2) union all select * from public._sw_records($1,$2)',[ids[0],day])).rows;for(const r of records)assert(Math.abs(r.arcadeScore-old.find(v=>v.game===r.game&&v.day===r.date).arcade_score)<1e-9,r.game+' parity');
await as(ids[1]);const view=await rpc('view',league);assert.equal(view.selected.rows.find(r=>r.id===ids[0]).completed,3);assert.equal(JSON.stringify(view).includes('Secret fact'),false);assert.equal(JSON.stringify(view).includes('targets'),false);
await db.exec('reset role');
// Whole-week maximum, one optional game for the week, no cherry-picking by day.
const games=(await db.query('select br_league.games() g')).rows[0].g,week='2026-11-02',sunday='2026-11-08',required=(await db.query('select br_league.required($1) g',[week])).rows[0].g;
let rows=[];for(let i=0;i<7;i++)for(const game of games)rows.push({game,date:'2026-11-'+String(2+i).padStart(2,'0'),arcadeScore:100});
const roll=async(r,d=sunday)=>(await db.query('select br_league.rollup($1,$2) x',[JSON.stringify(r),d])).rows[0].x;
assert.equal((await roll(rows)).total,2100);assert.equal((await roll(rows)).completed,21);assert.equal((await roll([],sunday)).total,0);
const optional=games.filter(g=>!required.includes(g));rows=rows.map(r=>({...r,arcadeScore:required.includes(r.game)?100:r.game===optional[0]?(r.date.endsWith('02')?100:0):r.game===optional[1]?(r.date.endsWith('02')?0:80):0}));
let rolled=await roll(rows);assert.equal(rolled.optional,optional[1]);assert.equal(rolled.total,1880);
assert.equal((await roll([...rows,{game:'stake',date:week,arcadeScore:100},{game:required[0],date:'2026-11-09',arcadeScore:100}])).total,1880);
assert.equal((await roll([{game:required[0],date:week,arcadeScore:0}])).completed,1);
assert.equal((await roll([{game:required[0],date:week,arcadeScore:90},{game:required[0],date:week,arcadeScore:90}])).total,90);
assert.equal((await roll(rows,week)).total,300);
for(const [d,w] of [['2026-10-04','2026-09-28'],['2026-04-05','2026-03-30'],['2026-10-26','2026-10-26'],['2026-11-01','2026-10-26']])assert.equal((await db.query('select br_league.week_start($1)::text w',[d])).rows[0].w,w);
const rotation=[];for(let i=0;i<5;i++)rotation.push(...(await db.query("select br_league.required(date '2026-10-26'+$1::int*7) g",[i])).rows[0].g);assert.equal(new Set(rotation).size,10);
assert.notDeepEqual((await db.query("select br_league.required(date '2026-11-02') g")).rows[0].g,(await db.query("select br_league.required(date '2026-11-01') g")).rows[0].g);
await as(ids[0]);await rpc('remove',league,null,null,false,ids[1]);await as(ids[1]);await assert.rejects(rpc('view',league),/unavailable/);await assert.rejects(rpc('join',null,fresh,null,true),/unavailable/);
await as(ids[0]);await rpc('leave',league);await assert.rejects(rpc('view',league),/unavailable/);await as(ids[2]);let cara=await rpc('view',league);assert.equal(cara.selected.owner,true);
await as(ids[3]);await assert.rejects(rpc('join',null,fresh,null,true),/unavailable/);
await as(ids[2]);await rpc('leave',league);assert.equal((await rpc()).leagues.length,0);
await db.exec('reset role');const grants=(await db.query("select has_table_privilege('authenticated','br_league.members','select') s,has_function_privilege('anon','public.league_hub(text,uuid,text,text,text,boolean,uuid)','execute') a,(select prosecdef from pg_proc where oid='public.league_hub(text,uuid,text,text,text,boolean,uuid)'::regprocedure) definer")).rows[0];assert.deepEqual(grants,{s:false,a:false,definer:false});
console.log('PASS leagues SQL: all ten native score readers, complete-week 2100 maximum, fixed optional slot, missing/zero/future/duplicate/archived results, five-week rotation, DST calendar boundaries, explicit consent, private membership, expired invites, blocks, shared ties, owner-only controls, removal/rejoin denial, leave/ownership transfer, closure and repeatable installation.');
}finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
