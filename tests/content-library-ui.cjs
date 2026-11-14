/* Real controllers + real SQL selection service, isolated Auth/provider fixtures. No payment. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',uid='00000000-0000-4000-8000-000000000001';
const games=['laser','time-drop','clue-ladder','seating-chart','shift-work','codebreak','stack-up','pack','lowball','inner-clock'];
(async()=>{
 const db=new PGlite();let browser;try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);insert into auth.users values('${uid}');create schema br_billing;create table br_billing.live_sessions(user_id uuid,item text,state text,paid_through timestamptz);`);
 await db.exec(fs.readFileSync('supabase/migrations/'+fs.readdirSync('supabase/migrations').find(f=>f.endsWith('_account_content_library.sql')),'utf8'));
 const {createContentHandler}=await import('../supabase/functions/content-library/handler.mjs');let offline=false;
 const handler=createContentHandler({user:async()=>({id:uid}),db:async(action,data)=>{if(offline)throw Error('offline');return(await db.query('select public.content_library_server($1,$2) r',[action,JSON.stringify(data)])).rows[0].r;}});
 browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 for(const game of games){const context=await browser.newContext({viewport:{width:390,height:900}}),errors=[];
 await context.addInitScript(uid=>{localStorage.setItem('br:cloud:owner',uid);localStorage.setItem('pc_help_seen','1');},uid);
 await context.route('**/accounts.js*',route=>route.fulfill({contentType:'application/javascript',body:`window.BREAK_ROOM_ACCOUNTS={ready:Promise.resolve(),getUser:()=>({id:'${uid}'}),billingRequest:async()=>({environment:'live',configured:true,verified:true,subscription_active:true,games:[]}),contentRequest:async body=>{const r=await fetch('${base}/__contentfixture',{method:'POST',body:JSON.stringify(body)});if(!r.ok)throw Error('offline');return r.json();}};`}));
 await context.route('**/__contentfixture',async route=>{const r=await handler(new Request('https://fixture.invalid',{method:'POST',body:route.request().postData()}));await route.fulfill({status:r.status,contentType:'application/json',body:await r.text()});});
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/games/'+game+'/index.html');await p.locator('.br-subscribe').waitFor();
 const t=game==='lowball'?await p.locator('#lowball-game-frame').elementHandle().then(h=>h.contentFrame()):p;
 if(game==='stack-up')await t.locator('[data-mode=daily]').click();
 for(let attempt=0;attempt<100;attempt++){if((await db.query('select count(*)::int n from br_content.exposures where user_id=$1 and game=$2',[uid,game])).rows[0].n)break;await p.waitForTimeout(50);}
 const daily=(await db.query('select count(*)::int n from br_content.exposures where user_id=$1 and game=$2',[uid,game])).rows[0].n;
 assert.equal(daily,1,game+': only the displayed Daily question is recorded');
 await t.locator(game==='lowball'?'#unlimitedModeBtn':game==='stack-up'?'[data-mode=infinite]':'[data-game-mode=unlimited]').click();
 await t.locator('.unlimited-library strong').filter({hasText:/NEW CHALLENGE|REPLAY/}).waitFor();
 const seen=(await db.query('select count(*)::int n from br_content.exposures where user_id=$1 and game=$2',[uid,game])).rows[0].n;
 assert.equal(seen,2,game+': first actual Unlimited exposure only');
 assert((await db.query('select cardinality(ids) n from br_content.selections where user_id=$1 and game=$2',[uid,game])).rows[0].n<=100);
 assert.deepEqual(errors,[]);await context.close();console.log('PASS cloud controller presentation: '+game);
 }
 }finally{await browser?.close();await db.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
