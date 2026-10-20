/* Official SDK over mocked HTTPS endpoints: no real accounts or emails are created. */
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const ids={alice:'00000000-0000-4000-8000-000000000001',bob:'00000000-0000-4000-8000-000000000002'},rows=new Map();
const key='stake:d:2026-10-19',guestKey='stake:d:2026-10-18',complete=JSON.stringify({b:[1,1,1,1,1],p:[0,0,0,0,0]});
rows.set(ids.alice+':stake',{data:{[key]:complete},revision:1});
const token=name=>[Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),Buffer.from(JSON.stringify({sub:ids[name],role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.');
const user=name=>({id:ids[name],email:name+'@example.com',aud:'authenticated',role:'authenticated',created_at:new Date().toISOString(),app_metadata:{provider:'email'},user_metadata:{display_name:name}});
const session=name=>({access_token:token(name),refresh_token:'refresh-'+name,token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user:user(name)});
let schemaMissing=false,networkDown=false,conflictOnce=false,signup=0,recovery=0,passwordUpdate=0,posts=[];
async function mock(context){await context.route('https://*.supabase.co/**',async route=>{
 if(networkDown)return route.abort('internetdisconnected');
 const req=route.request(),url=new URL(req.url()),method=req.method();
 const headers={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,PUT,DELETE,OPTIONS','content-type':'application/json'};
 const send=(body,status=200)=>route.fulfill({status,headers,body:JSON.stringify(body)});
 if(method==='OPTIONS')return send({});
 const body=req.postDataJSON(),auth=req.headers().authorization||'';const claims=auth.startsWith('Bearer ')&&auth.slice(7).split('.').length===3?JSON.parse(Buffer.from(auth.slice(7).split('.')[1],'base64url').toString()):{};const name=claims.sub===ids.bob?'bob':'alice';
 if(url.pathname.endsWith('/token')){if(body.password==='wrongpass')return send({error_code:'invalid_credentials',msg:'Invalid login credentials'},400);return send(session(body.email?.startsWith('bob')?'bob':'alice'));}
 if(url.pathname.endsWith('/signup')){signup++;assert.equal(body.data.display_name,'Player');return send({user:user('alice'),session:null});}
 if(url.pathname.endsWith('/recover')){recovery++;assert.ok(url.searchParams.get('redirect_to').endsWith('/Midnight-Arcade/reset-password.html'));return send({});}
 if(url.pathname.endsWith('/user')){if(method==='PUT'){passwordUpdate++;assert.equal(body.password,'newpassword123');}return send(user(name));}
 if(url.pathname.endsWith('/logout'))return send({});
 if(url.pathname.endsWith('/game_saves')){if(schemaMissing)return send({code:'PGRST205',message:'Table missing'},404);assert.equal(url.searchParams.get('user_id'),'eq.'+ids[name]);const row=rows.get(ids[name]+':'+url.searchParams.get('game').slice(3));return send(row?[row]:[]);}
 if(url.pathname.endsWith('/rpc/save_game')){
  posts.push({name,...body});assert.ok(Object.keys(body.p_data).every(k=>!k.includes('auth')&&!k.includes('cloud:')));
  const k=ids[name]+':'+body.p_game,previous=rows.get(k);
  if(conflictOnce){conflictOnce=false;rows.set(k,{data:{...previous?.data},revision:(previous?.revision||0)+1});return send({conflict:true,revision:(previous?.revision||0)+1});}
  if((previous?.revision||0)!==body.p_revision)return send({conflict:true,revision:previous?.revision||0});
  rows.set(k,{data:body.p_data,revision:(previous?.revision||0)+1});return send({conflict:false,revision:(previous?.revision||0)+1});
 }
 throw Error('Unexpected account endpoint: '+method+' '+url.pathname);
 });}
async function login(page,name='alice'){
 await page.goto(base+'/login.html');await page.locator('#email').fill(name+'@example.com');await page.locator('#password').fill('password123');await page.locator('button[type=submit]').click();await page.waitForURL('**/account.html');await page.locator('#activate-cloud').waitFor();
}
async function activate(page,importGuest=false){if(importGuest)await page.locator('#import-guest').check();await page.locator('#activate-cloud').click();await page.locator('[data-account-status]').filter({hasText:'Your cloud saves are ready'}).waitFor();}
const native=page=>page.evaluate(()=>window.BREAK_ROOM_CLOUD_SAVES.capture(localStorage));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const context=await browser.newContext(),page=await context.newPage();await mock(context);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/account.html');await page.evaluate(([k,v])=>localStorage.setItem(k,v),[guestKey,complete]);
 await page.goto(base+'/login.html');await page.locator('#email').fill('alice@example.com');await page.locator('#password').fill('wrongpass');await page.locator('button[type=submit]').click();await page.locator('[data-account-status]').filter({hasText:'Email or password is incorrect'}).waitFor();assert.equal(new URL(page.url()).search,'');
 await login(page);assert.equal(new URL(page.url()).search,'');assert.equal(await page.locator('#import-guest').isChecked(),false);
 schemaMissing=true;await page.locator('#activate-cloud').click();await page.locator('[data-account-status]').filter({hasText:'not set up yet'}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('br:cloud:owner')),null);schemaMissing=false;
 await activate(page);let s=await native(page);assert.equal(s.stake[key],complete);assert.equal(s.stake[guestKey],undefined,'Guest data is not imported without consent');assert.ok(!rows.get(ids.alice+':stake').data[guestKey]);
 // Offline sync fails visibly without replacing a native save.
 networkDown=true;const before=await native(page);await page.locator('#activate-cloud').click();await page.locator('[data-account-status][data-error=true]').waitFor();assert.deepEqual(await native(page),before);networkDown=false;
 await page.locator('#sign-out').click();await page.locator('#signed-out').waitFor();s=await native(page);assert.equal(s.stake[guestKey],complete);assert.equal(s.stake[key],undefined,'Logging out restores guest state');
 await login(page,'bob');conflictOnce=true;await activate(page,true);s=await native(page);assert.equal(s.stake[guestKey],complete);assert.equal(s.stake[key],undefined,'Alice data cannot leak into Bob account');assert.equal(rows.get(ids.bob+':stake').data[guestKey],complete);
 // Signed-in game writes are uploaded; a second fresh browser can restore them.
 await page.goto(base+'/games/stake/index.html');await page.evaluate(()=>{localStorage.setItem('stake:d:2026-10-17',JSON.stringify({b:[2],p:[],deadline:Date.now()+30000}));window.dispatchEvent(new Event('break-room:save'));});
 await page.waitForFunction(()=>document.querySelector('[data-account-status]').textContent.includes('Saved to your account'));
 await page.goto(base+'/account.html');await page.locator('#sign-out').click();await page.locator('#signed-out').waitFor();
 const second=await browser.newContext(),p2=await second.newPage();await mock(second);await login(p2,'bob');await activate(p2);assert.ok((await native(p2)).stake['stake:d:2026-10-17']);
 // Loading remote data in another tab also stops a stale same-account engine.
 const same=await second.newPage();await same.goto(base+'/games/stack-up/index.html');await activate(p2);await same.waitForURL('**/account.html');await same.close();
 // Account switching in another tab sends running games to the safe account screen.
 const game=await second.newPage();await game.goto(base+'/games/stack-up/index.html');await p2.locator('#sign-out').click();await game.waitForURL('**/account.html');
 // Sign-up confirmation, safe credentials, recovery and update forms.
 await page.goto(base+'/signup.html');await page.locator('#display-name').fill('Player');await page.locator('#email').fill('new@example.com');await page.locator('#password').fill('password123');await page.locator('button[type=submit]').click();await page.locator('[data-account-status]').filter({hasText:'Check your email'}).waitFor();assert.equal(signup,1);assert.equal(await page.locator('#password').inputValue(),'');assert.ok(!page.url().includes('password123'));
 await page.goto(base+'/forgot-password.html');await page.locator('#email').fill('alice@example.com');await page.locator('button[type=submit]').click();await page.locator('[data-account-status]').filter({hasText:'reset link'}).waitFor();assert.equal(recovery,1);
 await login(page);await page.goto(base+'/reset-password.html');await page.locator('#password').fill('newpassword123');await page.locator('button[type=submit]').click();await page.waitForURL('**/account.html');assert.equal(passwordUpdate,1);
 // Existing cloud completions survive initial load in a new device (old replay-reset removed).
 await activate(page);await page.goto(base+'/games/stake/index.html');assert.equal((await native(page)).stake[key],complete);
 assert.deepEqual(errors,[]);
 for(const width of [320,390,768,1100,1440]){
  await page.setViewportSize({width,height:1000});for(const path of ['account','login','signup','forgot-password','reset-password']){await page.goto(base+'/'+path+'.html');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,path+' fits '+width);}
 }
 const noJS=await browser.newContext({javaScriptEnabled:false}),fallback=await noJS.newPage();await fallback.goto(base+'/login.html');assert.ok(await fallback.locator('fieldset').evaluate(f=>f.disabled));await noJS.close();
 await context.close();await second.close();console.log('PASS accounts: official SDK login/signup/recovery/update, explicit guest import, logout restore, two users/devices, RPC conflict retry, offline failure, account-switch safety, no credential URLs, no-JS fail-closed and five responsive widths.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
