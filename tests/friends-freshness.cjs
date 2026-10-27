/* End-to-end freshness regression; real SDK + isolated PostgreSQL: uploads in flight, newer completions, cross-tab updates and guest isolation. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL,alice='00000000-0000-4000-8000-000000000001',bob='00000000-0000-4000-8000-000000000002';
(async()=>{const db=new PGlite();let browser,release;try{
 await db.exec("create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;");
 for(const id of [alice,bob])await db.query('insert into auth.users values($1)',[id]);
 for(const file of ['setup.sql','friends.sql','hidden-gem.sql','shift-work.sql'])await db.exec(fs.readFileSync('supabase/'+file,'utf8'));
 let queue=Promise.resolve();function sql(uid,query,args=[]){const result=queue.then(async()=>{await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);return db.query(query,args);});queue=result.catch(()=>{});return result;}
 const today=(await db.query("select timezone('Australia/Sydney',now())::date::text d")).rows[0].d,num=(Date.parse(today+'T00:00:00Z')-Date.UTC(2026,9,1))/86400000,yesterday=new Date(Date.parse(today+'T00:00:00Z')-86400000).toISOString().slice(0,10);
 const enable=async(uid,name)=>(await sql(uid,"select public.friend_hub('enable',null,null,$1,true) x",[name])).rows[0].x;
 const ah=await enable(alice,'Alice'),bh=await enable(bob,'Bob');await sql(alice,"select public.friend_hub('request',$1,null,null,null)",[bh.me.code]);await sql(bob,"select public.friend_hub('accept',null,$1,null,null)",[alice]);
 const jwt=id=>[Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),Buffer.from(JSON.stringify({sub:id,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
 const session=id=>({access_token:jwt(id),refresh_token:'test-refresh',token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user:{id,aud:'authenticated',role:'authenticated',email:'test@example.com',created_at:new Date().toISOString(),app_metadata:{provider:'email'},user_metadata:{display_name:id===alice?'Alice':'Bob'}}});
 const pending=new Promise(r=>release=r);let holding=true,held=false,scoreReads=0;
 browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM,args:['--no-sandbox']});
 async function context(id,owned){const c=await browser.newContext({viewport:{width:390,height:1000}});await c.addInitScript(({id,owned,session,num,yesterday})=>{if(localStorage.getItem('freshness-test-seeded'))return;localStorage.setItem('freshness-test-seeded','1');localStorage.setItem('br:supabase:auth',JSON.stringify(session));if(owned)localStorage.setItem('br:cloud:owner',id);localStorage.setItem('pc_history',JSON.stringify({[num-1]:50}));localStorage.setItem('pc_last',yesterday);localStorage.setItem('pc_last_avg','50');},{id,owned,session:session(id),num,yesterday});
 await c.route('https://*.supabase.co/**',async route=>{const req=route.request(),url=new URL(req.url()),body=req.postDataJSON(),headers={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,OPTIONS','content-type':'application/json'},send=(data,status=200)=>route.fulfill({status,headers,body:JSON.stringify(data)});if(req.method()==='OPTIONS')return send({});
 const uid=JSON.parse(Buffer.from(req.headers().authorization.slice(7).split('.')[1],'base64url').toString()).sub;
 if(/\/(game_saves|hidden_gem_saves|shift_work_saves)$/.test(url.pathname)){const table=url.pathname.split('/').at(-1);assert.equal(url.searchParams.get('user_id'),'eq.'+uid);return send((await sql(uid,'select data,revision from public.'+table+' where user_id=$1 and game=$2',[uid,url.searchParams.get('game').slice(3)])).rows);}
 if(url.pathname.includes('/rpc/')){const name=url.pathname.split('/').at(-1);
 if(['save_game','save_hidden_gem','save_shift_work'].includes(name)){if(uid===alice&&name==='save_game'&&body.p_game==='lowball'&&holding){holding=false;held=true;await pending;}return send((await sql(uid,'select public.'+name+'($1,$2,$3) x',[body.p_game,JSON.stringify(body.p_data),body.p_revision])).rows[0].x);}
 if(name==='friend_hub')return send((await sql(uid,'select public.friend_hub() x')).rows[0].x);
 if(['friend_scores','hidden_gem_friend_scores','shift_work_friend_scores'].includes(name)){scoreReads++;return send((await sql(uid,'select public.'+name+'() x')).rows[0].x);}
 }throw Error('Unexpected endpoint '+url.pathname);
 });return c;}
 const c=await context(alice,true),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/friends.html',{waitUntil:'domcontentloaded'});
 for(let i=0;i<400&&!held;i++)await p.waitForTimeout(25);assert(held,'initial own-account upload is in flight');assert.equal(scoreReads,0,'comparison waits for that upload');
 await p.evaluate(({num,today})=>{localStorage.setItem('pc_history',JSON.stringify({[num-1]:50,[num]:90}));localStorage.setItem('pc_last',today);localStorage.setItem('pc_last_avg','90');window.dispatchEvent(new Event('break-room:save'));},{num,today});release();
 const own=p.locator('.friend-score.you .overall strong');await own.filter({hasText:'90'}).waitFor();assert.equal(await own.innerText(),'90','new completion is drained before first comparison');
 await p.locator('#comparison-window').selectOption('history');assert.equal(await own.innerText(),'70');await p.locator('#comparison-window').selectOption('today');
 const r={version:1,edits:5,day:today,phase:'review',round:4,targets:[3000,4000,5000,6000,7000],picks:[3000,4000,5000,6000,7000].map(elapsed=>({kind:'stop',elapsed})),startedAt:null};
 require('../inner-clock-model.js');assert(BREAK_ROOM_INNER_CLOCK.valid(r,today));
 const other=await c.newPage();await other.goto(base+'/profile.html');await other.evaluate(({today,r})=>localStorage.setItem('break-room:inner-clock:daily:'+today,JSON.stringify(r)),{today,r});
 await own.filter({hasText:'95'}).waitFor({timeout:15000});assert.equal(await own.innerText(),'95','another tab completion refreshes Friends without a manual reload');await other.reload();await other.locator('.profile-game[data-game=inner-clock]').waitFor();
 const guest=await context(bob,false),g=await guest.newPage();await g.goto(base+'/friends.html');await g.locator('.friend-score.you').waitFor();assert.equal(await g.locator('.friend-score.you .overall strong').innerText(),'—','guest progress never imports into the signed-in account');assert.equal(await g.locator('.friend-score[data-user="'+alice+'"] .overall strong').innerText(),'95','accepted friend sees the committed score');
 assert.match(await g.locator('#friend-status').innerText(),/enable cloud saves/);assert.deepEqual(errors,[]);await guest.close();await c.close();
 console.log('PASS Friends freshness: real PostgreSQL scores follow in-flight uploads and later completions, self/friend comparisons agree, cross-tab results refresh and guest saves remain separate.');
}finally{release?.();if(browser)await browser.close();await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
