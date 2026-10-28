/* Shared dialog styling and iframe focus/viewport behaviour for Lowball. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const viewport of [{width:320,height:640},{width:390,height:844},{width:844,height:390},{width:1440,height:1000}]){
  const c=await browser.newContext({viewport,reducedMotion:'reduce'});await c.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));const p=await c.newPage();
  await p.goto(base+'/games/laser/index.html');await p.locator('#help-popup-open').click();
  const reference=await p.locator('#help-popup .game-popup').evaluate(e=>{const s=getComputedStyle(e);return {background:s.backgroundColor,border:s.borderTop,shadow:s.boxShadow,padding:s.padding,font:getComputedStyle(e.querySelector('h2')).font};});
  await p.goto(base+'/games/lowball/index.html');const frame=await(await p.locator('iframe').elementHandle()).contentFrame();await frame.locator('#helpBtn').waitFor();
  const before=await frame.evaluate(()=>JSON.stringify({...localStorage}));
  for(const [button,id,close]of [['helpBtn','helpModal','helpClose'],['statsBtn','statsModal','statsClose']]){
   await frame.locator('#'+button).click();const panel=frame.locator('#'+id+' .game-popup');await panel.waitFor();
   const actual=await panel.evaluate(e=>{const s=getComputedStyle(e);return {background:s.backgroundColor,border:s.borderTop,shadow:s.boxShadow,padding:s.padding,font:getComputedStyle(e.querySelector('h2')).font};});assert.deepEqual(actual,reference,'Same shared panel styles at '+viewport.width);
   const bounds=await panel.boundingBox();assert(Math.abs(bounds.width-Math.min(540,await frame.evaluate(()=>innerWidth)-40))<1,'Help and Stats use the same shared panel width');assert(bounds.width<=540&&bounds.width<=viewport.width&&bounds.height<=viewport.height-30,JSON.stringify({bounds,viewport,id,geometry:await panel.evaluate(e=>({max:getComputedStyle(e).maxHeight,embedded:getComputedStyle(document.documentElement).getPropertyValue("--embed-visible-height")}))}));
   assert.equal(await p.locator('.site-header').evaluate(e=>e.inert),true);assert(await p.locator('#lowball-dialog-shade').isVisible());assert.equal(await frame.locator('.wrap').evaluate(e=>e.inert),true);
   if(id==='statsModal'){assert.equal(await frame.locator('#statsGrid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),2);assert.equal(await frame.locator('#statsGrid .stats-cell').count(),5);assert(await frame.locator('#statsGrid').evaluate(e=>[...e.children].every(c=>{const b=c.getBoundingClientRect(),g=e.getBoundingClientRect();return b.left>=g.left&&b.right<=g.right+1;})),'Both stats columns fit inside the panel');}
   fs.mkdirSync('.artifacts/lowball-dialogs',{recursive:true});await p.screenshot({path:'.artifacts/lowball-dialogs/'+id+'-'+viewport.width+'.png',fullPage:false});
   await frame.locator('#'+close).focus();await p.keyboard.press('Tab');assert(await frame.locator('#'+id+' .game-popup-close').evaluate(e=>e===document.activeElement));await p.keyboard.press('Shift+Tab');assert.equal(await frame.evaluate(()=>document.activeElement.id),close);
   await frame.locator('#'+id+' .game-popup-close').click();assert.equal(await frame.locator('#'+id).isVisible(),false);assert.equal(await p.locator('.site-header').evaluate(e=>e.inert),false);assert.equal(await p.locator('#lowball-dialog-shade').isVisible(),false);assert.equal(await frame.evaluate(()=>document.activeElement.id),button);
  }
  assert.equal(await frame.evaluate(()=>JSON.stringify({...localStorage})),before,'Opening dialogs does not alter saved results');await c.close();console.log('PASS Lowball dialogs '+viewport.width+'x'+viewport.height+': shared styles, two-column stats, viewport fit, keyboard trap, close buttons, focus restore and preserved saves.');
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
