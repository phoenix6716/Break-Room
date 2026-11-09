const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const ctx=await browser.newContext(),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/assets/vendor/supabase.js',r=>r.fulfill({contentType:'application/javascript',body:`window.__session={access_token:'test-token',user:{id:'owner-one',email:'test@example.com'}};window.BREAK_ROOM_SUPABASE={createClient:()=>({auth:{getSession:async()=>({data:{session:window.__session},error:null}),onAuthStateChange:fn=>{window.__authChanged=fn;return {data:{subscription:{unsubscribe(){}}}}}}})};`}));
 let status={environment:'sandbox',verified:true,subscription_active:false,paid_through:null,cancel_at_period_end:false,games:[],ad_free:false,pending:0},fail=false,delayCheckout=false,release,checkoutBody,requests=[];
 await page.route('**/functions/v1/billing',async r=>{
  if(r.request().method()==='GET')return r.fulfill({json:{environment:'sandbox',configured:true,live_payments:false}});
  const body=r.request().postDataJSON();requests.push(body);
  if(body.action==='checkout'){
   checkoutBody=body;if(delayCheckout)await new Promise(resolve=>release=resolve);
   return r.fulfill({json:{url:'https://checkout.stripe.com/c/pay/sandbox'}});
  }
  if(body.action==='portal')return r.fulfill({json:{url:'https://billing.stripe.com/p/session/test'}});
  return r.fulfill({status:fail?503:200,json:fail?{error:'Billing is unavailable. Please retry.'}:status});
 });
 await page.addInitScript(()=>{localStorage.setItem('laser:test-native','preserve');localStorage.setItem('br:cloud:owner','owner-one');localStorage.setItem('break-room:theme','dark');});
 await page.goto(base+'/billing-test.html?returned=1');await page.waitForFunction(()=>document.getElementById('billing-message').textContent==='Sandbox purchase status verified.');
 assert.match(await page.locator('#billing-purchases').innerText(),/No active sandbox purchases/,'Return URL alone never grants a purchase');
 assert(!page.url().includes('returned='));
 status={...status,games:['laser'],ad_free:true};await page.locator('#billing-refresh').click();await page.waitForFunction(()=>document.getElementById('billing-purchases').textContent.includes('Laser test purchase verified.'));
 fail=true;await page.locator('#billing-refresh').click();await page.waitForFunction(()=>document.getElementById('billing-message').textContent.includes('unavailable'));
 assert.match(await page.locator('#billing-purchases').innerText(),/Laser test purchase verified/,'An outage does not fabricate a free account');fail=false;
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  fs.mkdirSync('.artifacts/billing',{recursive:true});await page.screenshot({path:'.artifacts/billing/test-'+width+'.png',fullPage:true});
 }
 await page.locator('#billing-item').selectOption('laser');delayCheckout=true;await page.locator('#billing-checkout').click();await page.waitForFunction(()=>document.getElementById('billing-message').textContent==='Preparing test checkout…');
 while(!release)await new Promise(resolve=>setTimeout(resolve,10));
 assert.equal(checkoutBody.item,'laser');assert.match(checkoutBody.request_id,/^[a-f0-9-]{36}$/);assert.equal(checkoutBody.user_id,undefined);assert.equal(checkoutBody.price,undefined);
 await page.evaluate(()=>{window.__session={access_token:'other-token',user:{id:'owner-two',email:'other@example.com'}};window.__authChanged('SIGNED_IN',window.__session);});release();
 await page.waitForFunction(()=>document.getElementById('billing-message').textContent.includes('Account changed'));
 assert(page.url().includes('billing-test.html'),'Stale account checkout response cannot redirect');
 assert.match(await page.locator('#billing-purchases').innerText(),/not been verified/);
 assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('laser:test-native'),localStorage.getItem('br:cloud:owner')]),['preserve','owner-one']);
 await page.evaluate(()=>{window.__session=null;window.__authChanged('SIGNED_OUT',null);});
 assert(await page.locator('#billing-checkout').isDisabled());assert(await page.locator('#billing-login').isVisible());
 assert.deepEqual(errors,[]);await ctx.close();
 const nojs=await browser.newContext({javaScriptEnabled:false}),p=await nojs.newPage();await p.goto(base+'/billing-test.html');assert(await p.locator('#billing-checkout').isDisabled());assert(await p.locator('noscript').isVisible());await nojs.close();
 console.log('Sandbox billing UI: pending verification, signed-out/no-JS safety, known ownership, outage, account-switch redirect fencing, unchanged saves and mobile/dark layout passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
