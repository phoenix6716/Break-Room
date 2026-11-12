const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',games=['laser','time-drop','clue-ladder','seating-chart','shift-work','codebreak','stack-up','pack','lowball','inner-clock'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const ctx=await browser.newContext({viewport:{width:390,height:950}}),p=await ctx.newPage(),errors=[],billing=[];p.on('pageerror',e=>errors.push(e.message));
 await ctx.route('https://*.supabase.co/**',r=>{if(r.request().url().includes('/functions/v1/billing'))billing.push(r.request().url());return r.abort();});
 await ctx.addInitScript(games=>{for(const game of games)localStorage.setItem(game==='lowball'?'pc_help_seen':'break-room:help-seen:'+game,'1');},games);
 for(const game of games){
  await p.goto(base+'/games/'+game+'/index.html');await p.waitForFunction(()=>window.BREAK_ROOM_MEMBERSHIP?.enforced===true);
  const target=game==='lowball'?p.frameLocator('#lowball-game-frame'):p;
  const unlimited=target.locator(game==='lowball'?'#unlimitedModeBtn':game==='stack-up'?'[data-mode=infinite]':'[data-game-mode=unlimited]');
  await unlimited.waitFor();
  const before=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>/daily:|:d:|^pc_(?:progress|history|played|streak|best|last)/.test(key))));
  await unlimited.click();await p.locator('.membership-dialog').waitFor();assert.match(await p.locator('#membership-dialog-text').innerText(),/Sign in/);await p.getByRole('button',{name:'Stay here'}).click();await p.evaluate(()=>{window.BREAK_ROOM_ACCOUNTS={getUser:()=>({id:'owner'}),billingRequest:async()=>({environment:'live',configured:true,verified:true,subscription_active:true,games:[]})};});await unlimited.click();await p.waitForTimeout(100);assert.equal(await unlimited.getAttribute('aria-selected'),'true',game+' verified membership grants Unlimited');
  assert.equal(await p.locator('.membership-dialog').evaluate(e=>e.open),false,game+' verified owner can enter');
  const after=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>/daily:|:d:|^pc_(?:progress|history|played|streak|best|last)/.test(key))));
  assert.deepEqual(after,before,game+' preserves Daily saves on Unlimited entry');
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  console.log('PASS verified membership hook: '+game);
 }
 assert.deepEqual(billing,[],'Signed-out checks do not request private billing records');assert.deepEqual(errors,[]);await ctx.close();
 // Exercise a future gated branch in a test-only served response, never a public switch.
 const gated=await browser.newContext(),q=await gated.newPage();await gated.addInitScript(()=>localStorage.setItem('break-room:help-seen:laser','1'));
 await gated.route('**/unused-membership.js*',async r=>{const response=await r.fetch();return r.fulfill({response,body:(await response.text()).replace('enforce:false','enforce:true')});});
 await q.goto(base+'/games/laser/index.html');await q.locator('[data-game-mode=unlimited]').click();await q.locator('.membership-dialog').waitFor();assert.equal(await q.locator('[data-game-mode=daily]').getAttribute('aria-selected'),'true');assert.match(await q.locator('#membership-dialog-text').innerText(),/Sign in/);await q.getByRole('button',{name:'Stay here'}).click();assert.equal(await q.locator('.membership-dialog').evaluate(e=>e.open),false);await gated.close();
 console.log('Membership UI: all ten shipped guards block signed-out entry and allow verified live monthly access; Daily saves, mobile layout and dialog controls preserved.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
