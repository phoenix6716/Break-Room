/* Interaction/layout checks for the counter and tabletop presentation layers. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   await context.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/games/lowball/index.html');
   assert.equal(await page.locator('#game-menu a[href$="games/inner-clock/index.html"]').innerText(),'Time Sense');
   const frame=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();
   await frame.locator('#guessInput').waitFor();
   const item=await frame.locator('#itemName').innerText();
   const screen=await frame.locator('.guess-row').boundingBox(),currency=await frame.locator('#currencySymbol').boundingBox();
   assert(currency.x>=screen.x&&currency.x+currency.width<=screen.x+screen.width,'Currency stays inside till screen');
   await frame.locator('#guessInput').fill('12.50');await frame.locator('#guessInput').press('Enter');
   assert.equal(await frame.locator('#receiptItemName').innerText(),item);
   assert(await frame.locator('#nextBtn').evaluate(el=>el===document.activeElement),'Keyboard can continue directly from the receipt');
   assert.match(await frame.locator('#resultFacts').innerText(),/12\.50/);
   assert.equal(await frame.locator('#resultArea').evaluate(el=>getComputedStyle(el).animationName),'none');
   const receipt=await frame.locator('#resultArea').boundingBox(),card=await frame.locator('.card').boundingBox();
   assert(receipt.width>=card.width*.7,'Receipt uses the available card width');
   await frame.locator('#nextBtn').press('Enter');
   await frame.waitForFunction(()=>document.activeElement?.id==='guessInput');
   assert.match(await frame.locator('#counterItemNumber').innerText(),/02/);
   assert(!await frame.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   await page.goto((process.env.ARCADE_LEGACY_TEST_URL||base)+'/games/stake/index.html');
   for(const chip of await page.locator('.chip').all()){
    const box=await chip.boundingBox();assert(Math.abs(box.width-box.height)<1);
    assert.equal(await chip.evaluate(el=>getComputedStyle(el).borderRadius),'50%');
   }
   await page.locator('.chip').first().focus();await page.keyboard.press('Enter');
   assert(await page.locator('.question-card').evaluate(el=>el===document.activeElement));
   await page.keyboard.press('Tab');assert(await page.locator('button.opt').first().evaluate(el=>el===document.activeElement));
   await page.keyboard.press('Enter');
   assert(await page.locator('.question-card').evaluate(el=>el===document.activeElement));
   assert(await page.locator('.bet-in-play').isVisible());
   await page.keyboard.press('Tab');assert(await page.locator('.next-question').evaluate(el=>el===document.activeElement));
   await page.keyboard.press('Enter');assert(await page.locator('.chip').first().evaluate(el=>el===document.activeElement));
   await page.getByRole('tab',{name:'Daily',exact:true}).focus();await page.keyboard.press('ArrowRight');
   assert.equal(await page.getByRole('tab',{name:'Unlimited',exact:true}).getAttribute('aria-selected'),'true');
   assert(await page.getByRole('tab',{name:'Unlimited',exact:true}).evaluate(el=>el===document.activeElement));
   // Use the actual longest question in the bank to stress wrapping at phone widths.
   await page.evaluate(()=>{const q=BANK.reduce((a,b)=>a.q.length>b.q.length?a:b);unl.qs[0]={...q,a:0};render()});
   await page.getByRole('button',{name:'Bet 3 chips',exact:true}).click();
   assert(await page.locator('#question-time').isVisible());
   assert.equal(await page.locator('.question-card').evaluate(el=>getComputedStyle(el).animationName),'none');
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   await page.evaluate(()=>{answer(unl,getQ(unl,0).a);render()});
   assert.equal(await page.locator('.chip-stack .stack-chip').count(),3);
   assert(await page.locator('.bet-in-play.is-win').isVisible());
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   assert.deepEqual(errors,[]);await context.close();
   console.log(`PASS ${width}px: till/receipt layout, keyboard round progression, circular chips, keyboard betting/answering, mode arrows, long questions, stack feedback and reduced motion.`);
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
