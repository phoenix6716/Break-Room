const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',uid='00000000-0000-4000-8000-000000000001';
const jwt=[Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),Buffer.from(JSON.stringify({sub:uid,role:'authenticated',exp:Math.floor(Date.now()/1000)+7200})).toString('base64url'),'signature'].join('.');
const user={id:uid,email:'billing@example.com',aud:'authenticated',role:'authenticated',user_metadata:{display_name:'Billing Player'},app_metadata:{provider:'email'},created_at:new Date().toISOString()};
const session={access_token:jwt,refresh_token:'test-refresh',token_type:'bearer',expires_in:7200,expires_at:Math.floor(Date.now()/1000)+7200,user};
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const ctx=await browser.newContext(),p=await ctx.newPage(),errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));
 let state={environment:'sandbox',configured:true,verified:true,has_billing_account:true,subscription_active:true,paid_through:'2026-12-09T22:33:18Z',cancel_at_period_end:true,games:['laser'],pending:0},fail=false,delay=false,release,portalURL='https://bad.example/portal';
 await ctx.route('https://*.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url()),headers={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,OPTIONS'},send=(body,status=200)=>route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify(body)});
  if(req.method()==='OPTIONS')return send({});
  if(url.pathname.endsWith('/user'))return send(user);
  if(url.pathname.endsWith('/logout'))return send({});
  if(url.pathname.includes('/rest/v1/'))return send([]);
  if(url.pathname.includes('/functions/v1/billing')){
   const body=req.postDataJSON();requests.push({body,endpoint:url.pathname,auth:req.headers().authorization});
   if(delay&&body.action==='status')await new Promise(resolve=>release=resolve);
   if(body.action==='portal')return send({url:portalURL});
   return fail?send({error:'Billing service unavailable'},503):send({...state,environment:url.pathname.endsWith('billing-live')?'live':'sandbox'});
  }
  throw Error('Unexpected endpoint '+url.pathname);
 });
 await ctx.addInitScript(({session,uid})=>{localStorage.setItem('br:supabase:auth',JSON.stringify(session));localStorage.setItem('br:cloud:owner',uid);localStorage.setItem('break-room:theme','dark');localStorage.setItem('unrelated:save-backup','keep');},{session,uid});
 await p.goto(base+'/account.html');await p.evaluate(()=>BREAK_ROOM_ACCOUNTS.ready);await p.waitForFunction(()=>document.querySelector('#purchase-games').textContent.includes('Laser'));assert(requests.length>=1,'Account automatically verifies current purchases');assert(requests.every(r=>r.body.action==='status'),'Opening Account never creates a checkout');
 await p.locator('#purchase-refresh').click();await p.waitForFunction(()=>document.querySelector('#purchase-games').textContent.includes('Laser'));
 assert(requests.every(r=>r.endpoint.endsWith('billing-live')&&r.auth==='Bearer '+session.access_token),'Official account helper authenticates live status with its verified actor');
 await p.goto(base+'/account.html?billing_preview=sandbox#purchases');await p.waitForFunction(()=>document.querySelector('#purchase-games').textContent.includes('Laser'));
 assert(await p.locator('#purchase-preview').isVisible());assert.match(await p.locator('#purchase-plan').innerText(),/Renewal is canceled/);assert(await p.locator('#purchase-manage').isEnabled());
 await p.locator('#purchase-manage').click();await p.waitForFunction(()=>document.querySelector('#purchase-status').textContent.includes('Unexpected billing destination'));
 assert(p.url().includes('account.html'),'Untrusted portal redirects are refused');
 for(const width of [390,1440]){await p.setViewportSize({width,height:1000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));fs.mkdirSync('.artifacts/billing',{recursive:true});await p.screenshot({path:'.artifacts/billing/account-'+width+'.png',fullPage:true});}
 fail=true;await p.locator('#purchase-refresh').click();await p.waitForFunction(()=>document.querySelector('#purchase-status').textContent.includes('unavailable'));assert.match(await p.locator('#purchase-games').innerText(),/Laser/,'An outage does not fabricate loss of a recorded purchase');assert(await p.locator('#purchase-manage').isDisabled());fail=false;
 state={...state,subscription_active:false,games:[],has_billing_account:true};await p.locator('#purchase-refresh').click();await p.waitForFunction(()=>document.querySelector('#purchase-games').textContent.includes('No individual'));
 delay=true;await p.locator('#purchase-refresh').click();while(!release)await new Promise(r=>setTimeout(r,10));
 await p.locator('#sign-out').click();await p.waitForFunction(()=>!BREAK_ROOM_ACCOUNTS.getUser());release();await p.waitForFunction(()=>document.querySelector('#purchase-plan').textContent.includes('Sign in'));
 assert.equal(await p.locator('#purchase-games li').count(),0);assert(await p.locator('#purchase-manage').isDisabled());assert.equal(await p.evaluate(()=>localStorage.getItem('unrelated:save-backup')),'keep');assert.deepEqual(errors,[]);await ctx.close();
 const guest=await browser.newContext(),g=await guest.newPage();await g.goto(base+'/account.html');await g.evaluate(()=>BREAK_ROOM_ACCOUNTS.ready);assert(await g.locator('#purchase-manage').isDisabled());assert.match(await g.locator('#purchase-plan').innerText(),/Sign in/);await guest.close();
 console.log('Account purchases: official Auth SDK/helper, live/test separation, monthly cancellation, owned games, signed-out/error states, portal URL checks, stale response/logout fencing, phone/desktop dark layout and preserved backup passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
