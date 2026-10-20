/* The requested reset-card, Daily-label and centred-layout acceptance checks. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const fixed=new Date('2026-10-19T03:00:00Z');
const appearance=el=>{
 const fields=['backgroundColor','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderTopColor','borderRadius','boxShadow','paddingTop','paddingRight','paddingBottom','paddingLeft','color','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textAlign'];
 const read=node=>{const s=getComputedStyle(node);return Object.fromEntries(fields.map(key=>[key,s[key]]))};
 return {box:read(el),label:read(el.querySelector('.card-heading')),clock:read(el.querySelector('[data-daily-countdown]')),note:read(el.querySelector('p'))};
};
async function centred(target,selectors,width){for(const selector of selectors){const box=await target.locator(selector).boundingBox();assert(box,selector+' visible');assert(Math.abs(box.x+box.width/2-width/2)<1,`${selector} centred at ${width}: ${JSON.stringify(box)}`)}}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [320,390,768,1024,1100,1440]){
   const context=await browser.newContext({viewport:{width,height:1100},reducedMotion:'reduce'});
   await context.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));
   const errors=[];
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.clock.setFixedTime(fixed);
   // The canonical template now owns the reset card; Stack Up uses that shared shell too.
   await page.goto(base+'/games/_template/index.html');
   const original=await page.locator('.daily-reset-card').evaluate(appearance);
   const expectedTime=await page.locator('.daily-reset-card [data-daily-countdown]').innerText();
   await page.goto(base+'/games/stack-up/index.html');
   await page.locator('[data-start-mode=daily]').click();
   assert.deepEqual(await page.locator('.daily-reset-card').evaluate(appearance),original,'Stack Up matches the canonical reset card');
   await page.goto(base+'/games/stake/index.html');
   assert.deepEqual(await page.locator('.daily-reset-card').evaluate(appearance),original,'Stake reset card matches the canonical template');
   assert.equal(await page.locator('.daily-reset-card p').innerText(),'Same time. Every game.');
   assert.equal(await page.locator('.daily-reset-card [data-daily-countdown]').innerText(),expectedTime);
   await centred(page,['.standalone-heading','#app .tabs','#app .pips','.stake-table'],width);
   const stakeBoard=await page.locator('.stake-table').boundingBox();
   const stakeReset=await page.locator('.daily-reset-card').boundingBox();
   const stakeModes=await page.locator('#app .tabs').boundingBox();
   assert(stakeReset.x>=0&&stakeReset.x+stakeReset.width<=width);
   if(width>=1100){assert(stakeReset.x>stakeBoard.x+stakeBoard.width);assert(stakeReset.y<stakeModes.y);}
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   await page.getByRole('button',{name:'Bet 3 chips',exact:true}).click();
   await centred(page,['.stake-table'],width);
   assert.equal(await page.locator('button.opt').count(),3);
   await page.getByRole('tab',{name:'Unlimited',exact:true}).click();
   await centred(page,['.stake-table','#app .tabs'],width);
   await page.locator('#game-menu-toggle').click();assert(await page.locator('#game-menu').isVisible());await page.keyboard.press('Escape');
   await page.goto(base+'/games/lowball/index.html');
   const frame=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();
   await frame.locator('#normalModeBtn').waitFor();
   assert.equal(await frame.locator('#normalModeBtn').innerText(),'Daily');
   assert.equal(await frame.locator('#normalModeBtn .rounds').count(),0);
   assert.deepEqual(await frame.locator('.daily-reset-card').evaluate(appearance),original,'Lowball reset card matches the canonical template');
   assert.equal(await frame.locator('.daily-reset-card p').innerText(),'Same time. Every game.');
   assert.equal(await frame.locator('.daily-reset-card [data-daily-countdown]').innerText(),expectedTime);
   await centred(frame,['header','.mode-toggle','.progress-dots','.card','#soundBtn'],width);
   const lowBoard=await frame.locator('.card').boundingBox();
   assert.equal(lowBoard.width,stakeBoard.width,'Both games use the same responsive column width');
   const lowReset=await frame.locator('.daily-reset-card').boundingBox();
   const region=await frame.locator('.country-row').boundingBox();
   assert(region.y>=lowReset.y+lowReset.height);
   assert(lowReset.x>=0&&lowReset.x+lowReset.width<=width);
   const sound=await frame.locator('#soundBtn').boundingBox();assert(sound.y>=lowBoard.y+lowBoard.height);
   if(width>=1100){assert(Math.abs(lowReset.x-stakeReset.x)<1);assert(Math.abs(lowReset.y-stakeReset.y)<1);}
   await frame.locator('#cselectBtn').click();const list=await frame.locator('#cselectList').boundingBox();assert(list.x>=0&&list.x+list.width<=width);
   await frame.locator('#cselectList li').filter({hasText:'United States'}).click();
   assert(!await frame.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
   assert.deepEqual(errors,[]);
   await context.close();console.log(`PASS ${width}px: all reset boxes match the canonical template, clocks agree, Daily label simplified, both games centred at equal widths, rail/region/sound fit, menus and modes work.`);
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
