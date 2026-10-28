/* Official auth client and actual league SQL; only auth/network transport is mocked. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{PGlite}=require('@electric-sql/pglite'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const ids={alice:'00000000-0000-4000-8000-000000000001',bob:'00000000-0000-4000-8000-000000000002'};
const jwt=name=>[Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),Buffer.from(JSON.stringify({sub:ids[name],role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
const user=name=>({id:ids[name],email:name+'@example.com',aud:'authenticated',role:'authenticated',created_at:new Date().toISOString(),app_metadata:{provider:'email'},user_metadata:{display_name:name==='alice'?'Alice':'Bob'}});
let offline=false,missing=false,queue=Promise.resolve();
(async()=>{const db=new PGlite();let browser;try{
await db.exec("create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;");
for(const id of Object.values(ids))await db.query('insert into auth.users values($1)',[id]);
for(const f of ['setup','friends','hidden-gem','shift-work','leagues'])await db.exec(fs.readFileSync('supabase/'+f+'.sql','utf8'));
const today=(await db.query("select timezone('Australia/Sydney',now())::date::text d")).rows[0].d,day=(Date.parse(today+'T00:00:00Z')-Date.UTC(2026,9,1))/86400000;
for(const name of ['alice','bob'])await db.query('insert into public.game_saves(user_id,game,data) values($1,$2,$3)',[ids[name],'lowball',JSON.stringify({pc_history:JSON.stringify({[day]:name==='alice'?80:0})})]);
browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
async function context(){
 const ctx=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
 await ctx.route('https://*.supabase.co/**',async route=>{
  if(offline)return route.abort('internetdisconnected');
  const req=route.request(),url=new URL(req.url()),body=req.postDataJSON(),headers={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,PUT,OPTIONS','content-type':'application/json'};
  const send=(data,status=200)=>route.fulfill({status,headers,body:JSON.stringify(data)});if(req.method()==='OPTIONS')return send({});
  if(url.pathname.endsWith('/token')){const name=body.email.startsWith('bob')?'bob':'alice';return send({access_token:jwt(name),refresh_token:'refresh-'+name,token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user:user(name)});}
  if(url.pathname.endsWith('/logout'))return send({});
  if(/\/(game_saves|hidden_gem_saves|shift_work_saves)$/.test(url.pathname)||/\/rpc\/(save_game|save_hidden_gem|save_shift_work)$/.test(url.pathname)){
   const uid=JSON.parse(Buffer.from(req.headers().authorization.slice(7).split('.')[1],'base64url').toString()).sub;
   let finish;const pending=new Promise(r=>finish=r);
   queue=queue.then(async()=>{try{await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);let value;
    if(req.method()==='GET'){const table=url.pathname.split('/').at(-1);assert.equal(url.searchParams.get('user_id'),'eq.'+uid);value=(await db.query('select data,revision from public.'+table+' where user_id=$1 and game=$2',[uid,url.searchParams.get('game').slice(3)])).rows;}
    else{const fn=url.pathname.split('/').at(-1);value=(await db.query('select public.'+fn+'($1,$2,$3) x',[body.p_game,JSON.stringify(body.p_data),body.p_revision])).rows[0].x;}
    finish({value});}catch(e){finish({error:e.message})}});
   const result=await pending;return result.error?send({message:result.error},400):send(result.value);
  }

  if(url.pathname.endsWith('/rpc/league_hub')){
   if(missing)return send({code:'PGRST202',message:'Function missing'},404);
   const claims=JSON.parse(Buffer.from(req.headers().authorization.slice(7).split('.')[1],'base64url').toString());let resolveResult;const result=new Promise(resolve=>resolveResult=resolve);
   queue=queue.then(async()=>{try{await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[claims.sub]);const r=await db.query('select public.league_hub($1,$2,$3,$4,$5,$6,$7) x',[body.p_action||'list',body.p_league||null,body.p_token||null,body.p_name||null,body.p_display_name||null,body.p_consent??false,body.p_target||null]);resolveResult({value:r.rows[0].x});}catch(error){resolveResult({error:error.message});}});
   const r=await result;return r.error?send({message:r.error},400):send(r.value);
  }throw Error('Unexpected endpoint '+url.pathname);
 });return ctx;
}
async function login(p,name){await p.goto(base+'/login.html');await p.locator('#email').fill(name+'@example.com');await p.locator('#password').fill('password123');await p.locator('button[type=submit]').click();await p.waitForURL('**/account.html');await p.goto(base+'/leagues.html');await p.waitForFunction(()=>!document.querySelector('#create-league fieldset').disabled);}
async function settled(p){await p.locator('#league-content[aria-busy="false"]').waitFor();}
const aCtx=await context(),bCtx=await context(),a=await aCtx.newPage(),b=await bCtx.newPage(),errors=[];for(const p of [a,b])p.on('pageerror',e=>errors.push(e.message));
await a.goto(base+'/leagues.html');await a.locator('#league-guest').waitFor();assert.equal(await a.locator('.league-entry').count(),0);
await login(a,'alice');assert.equal(await a.locator('#create-league-consent').isChecked(),false);
await a.locator('#league-name').fill('<b>Lunch crew</b>');await a.locator('#create-league-consent').check();
missing=true;await a.locator('#create-league button').click();await a.locator('#league-status').filter({hasText:'not available yet'}).waitFor();missing=false;
await a.locator('#create-league button').click();await a.locator('#league-board').waitFor();await settled(a);assert.equal(await a.locator('.league-entry').count(),1);assert.equal(await a.locator('#league-title b').count(),0);
assert.equal(await a.locator('#league-invite').isVisible(),true);await a.locator('#copy-league-invite').click();const link=await a.evaluate(()=>navigator.clipboard.readText());assert.match(link,/#join=[a-f0-9]{32}$/);
await b.goto(link);await b.locator('#league-guest').waitFor();assert.equal(new URL(b.url()).hash,'');assert.equal(await b.locator('.league-entry').count(),0);
await login(b,'bob');assert.match(await b.locator('#league-token').inputValue(),/^[a-f0-9]{32}$/);assert.equal(await b.locator('#join-league-consent').isChecked(),false);assert.equal(await b.locator('#league-board').isVisible(),false);
await b.locator('#join-league-consent').check();await b.locator('#join-league button').click();await b.waitForFunction(()=>document.querySelectorAll('.league-entry').length===2);await settled(b);
assert.equal(await b.locator('#league-owner').isVisible(),false);
await a.locator('#refresh-leagues').click();await a.waitForFunction(()=>document.querySelectorAll('.league-entry').length===2);await settled(a);
const own=a.locator('.league-entry.you');assert.match(await own.locator('.league-total').innerText(),/^80/);assert.match(await own.innerText(),/Lowball/);
assert.equal(await own.locator('.league-slots .league-slot').count(),3);
await own.locator('summary').click();assert.equal(await own.locator('tbody tr').count(),10);assert.equal(await a.locator('#league-content').innerText().then(t=>/pc_history|example.com/.test(t)),false);
fs.mkdirSync('.artifacts/leagues',{recursive:true});
for(const width of [320,390,768,1100,1440]){await a.setViewportSize({width,height:1000});const overflow=await a.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)console.log('LEAGUE_OVERFLOW',width,await a.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.league-daily');}).map(e=>({tag:e.tagName,id:e.id,class:e.className,right:e.getBoundingClientRect().right})).slice(0,20)));assert.equal(overflow,false,'Leagues fit '+width);assert.equal(await a.locator('#required-games img').evaluateAll(imgs=>imgs.length===2&&imgs.every(i=>i.complete&&i.naturalWidth>0)),true);await a.screenshot({path:'.artifacts/leagues/'+width+'.png',fullPage:true});}
await a.evaluate(()=>scrollTo(0,0));console.log('LEAGUES_PREVIEW_1440 '+(await a.screenshot({type:'jpeg',quality:65})).toString('base64'));await a.setViewportSize({width:390,height:1000});await a.evaluate(()=>scrollTo(0,0));console.log('LEAGUES_PREVIEW_390 '+(await a.screenshot({type:'jpeg',quality:65})).toString('base64'));
await a.locator('#invite-league').click();await settled(a);assert.notEqual(await a.locator('#league-invite-url').inputValue(),link);
await a.getByRole('button',{name:'Remove Bob',exact:true}).click();await a.locator('#cancel-league-action').click();assert.equal(await a.locator('.league-entry').count(),2);
await a.getByRole('button',{name:'Remove Bob',exact:true}).click();await a.locator('#confirm-league-action').click();await a.waitForFunction(()=>document.querySelectorAll('.league-entry').length===1);await settled(a);
await b.locator('#refresh-leagues').click();await settled(b);assert.equal(await b.locator('.league-entry').count(),0);
await b.locator('#league-token').fill(link);await b.locator('#join-league-consent').check();await b.locator('#join-league button').click();await b.locator('#league-status').filter({hasText:'unavailable'}).waitFor();
offline=true;await a.locator('#refresh-leagues').click();await a.locator('#league-status').filter({hasText:'Could not connect'}).waitFor();assert.equal(await a.locator('.league-entry').count(),0);offline=false;
await a.locator('#refresh-leagues').click();await a.waitForFunction(()=>document.querySelectorAll('.league-entry').length===1);await settled(a);
const logout=await aCtx.newPage();await logout.goto(base+'/account.html');await logout.locator('#sign-out').click();await a.locator('#league-guest').waitFor();assert.equal(await a.locator('.league-entry').count(),0);assert.equal(await a.locator('#league-invite-url').inputValue(),'');
assert.deepEqual(errors,[]);await aCtx.close();await bCtx.close();
const noJS=await browser.newContext({javaScriptEnabled:false}),fallback=await noJS.newPage();await fallback.goto(base+'/leagues.html');for(const fieldset of await fallback.locator('fieldset').all())assert(await fieldset.evaluate(n=>n.disabled));assert(await fallback.getByRole('link',{name:'Friends',exact:true}).count());await noJS.close();
console.log('PASS leagues browser: real SQL create/join, separate sharing consent, invite persistence through login, no automatic joining, copy/regenerate, private owner controls, removal, zero scores, all-game daily breakdown, safe text, five responsive widths, real assets, offline/stale-score clearing, cross-tab logout and no-JS safety.');
}finally{if(browser)await browser.close();await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
