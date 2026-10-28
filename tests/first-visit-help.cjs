/* Clean browser profiles: independent first visits, timer safety and labelled controls. */
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',ids=['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock'];
async function game(p,id){await p.goto(base+'/games/'+id+'/index.html');return id==='lowball'?await(await p.locator('iframe').elementHandle()).contentFrame():p;}
const selectors=id=>id==='lowball'?['#helpBtn','#helpModal']:id==='stack-up'?['#help-open','#help-dialog']:['#help-popup-open','#help-popup'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 let stackSnapshot;
 for(const width of [320,390,650,768,1440]){
  const c=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),p=await c.newPage();
  const fixed=new Date('2026-10-28T01:00:00Z');await p.clock.setFixedTime(fixed);
  for(const id of ids){console.log('Checking '+id+' first visit at '+width);
   const errors=[];const onError=e=>errors.push(e.message);p.on('pageerror',onError);
   let f=await game(p,id);const [button,dialog]=selectors(id);await f.locator(dialog).waitFor({state:'visible'});assert.equal(await f.locator(button).textContent(),'How To Play',id);
   const key=id==='lowball'?'pc_help_seen':'break-room:help-seen:'+id;assert.equal(await f.evaluate(k=>localStorage.getItem(k),key),'1',id+' remembered independently');
   if(id==='stack-up'){
    assert.equal(await p.evaluate(()=>localStorage.getItem('break-room:stack-up:daily:2026-10-28')),null,'Reading instructions creates no timed round');
    await p.clock.setFixedTime(new Date(fixed.getTime()+120000));
   }
   await p.keyboard.press('Escape');await f.locator(dialog).waitFor({state:'hidden'});assert(await f.locator(id==='stack-up'?'#prompt':button).evaluate(e=>e===document.activeElement),id+' focus is restored or moves to the newly started question');
   if(id==='stack-up'){await p.waitForFunction(()=>localStorage.getItem('break-room:stack-up:daily:2026-10-28'));const run=await p.evaluate(()=>JSON.parse(localStorage.getItem('break-room:stack-up:daily:2026-10-28')));assert.equal(run.deadline,fixed.getTime()+120000+90000,'Full 90 seconds begin after dismissal');assert.equal(run.status,'playing');assert.equal(run.results.length,0);if(width===320)stackSnapshot=run;}
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,id+' no phone overflow');
   {
    const boxes=await f.locator(id==='lowball'?'.lowball-title-group,#statStrip,.head-btns':'.br-game-title-group,.quick-stats,.br-game-tools').evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>e.getBoundingClientRect().toJSON()));
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert(!(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1),id+' header fields do not overlap');}
   }
   if(width<=650){
    const tools=await f.locator(id==='lowball'?'.head-btns':'.br-game-tools').boundingBox();
    const statsButton=f.locator(id==='lowball'?'#statsBtn':id==='stack-up'?'#stats-open':'#stats-popup-open');
    assert.equal(await statsButton.innerText(),'Stats',id+' mobile Stats label');
    const title=await f.locator(id==='lowball'?'.lowball-title-group':'.br-game-title-group').boundingBox();
    const strip=f.locator(id==='lowball'?'#statStrip':'.quick-stats'),stripBox=await strip.boundingBox();
    assert(stripBox.y>=title.y+title.height,id+' stats below title');
    assert(Math.abs(stripBox.x-tools.x)<1&&Math.abs(stripBox.width-tools.width)<1,id+' full-width stats');
    assert(tools.y>=stripBox.y+stripBox.height,id+' tools below stats');
    assert.deepEqual(await strip.evaluate(e=>{const s=getComputedStyle(e);return [s.borderTopWidth,s.borderTopColor,s.boxShadow]}),['2px','rgb(23, 38, 58)','none'],id+' approved bold border without shadow');
    const help=await f.locator(button).boundingBox(),trophy=await statsButton.boundingBox();
    assert(Math.abs(help.x-tools.x)<1,id+' Help at the far left');
    assert(Math.abs(trophy.x+trophy.width-tools.x-tools.width)<1,id+' Stats at the far right');
    assert(Math.abs(help.y+help.height/2-trophy.y-trophy.height/2)<1,id+' controls on the same row');
    const reset=await f.locator('.daily-reset-card').boundingBox();
    const viewport=await f.evaluate(()=>innerWidth);
    assert(Math.abs(reset.x+reset.width/2-viewport/2)<2,id+' reset card centred');
    assert.equal(await f.locator('.daily-reset-card').evaluate(e=>getComputedStyle(e).textAlign),'center',id+' countdown text centred');
    const resetCard=f.locator('.daily-reset-card'),heading=await resetCard.locator('.card-heading').boundingBox(),clock=await resetCard.locator('.reset-clock').boundingBox();
    assert(reset.height<=55,id+' compact reset height');
    assert(Math.abs(reset.width-tools.width)<1,id+' full-width reset strip');
    assert(Math.abs(heading.y+heading.height/2-clock.y-clock.height/2)<1,id+' reset label and countdown share a line');
    assert.equal(await resetCard.locator('p').isVisible(),false,id+' mobile supporting text hidden');

   }
   const statsControl=f.locator(id==='lowball'?'#statsBtn':id==='stack-up'?'#stats-open':'#stats-popup-open');
   if(width>650){
    assert.equal(await statsControl.locator('.mobile-stats-label').isVisible(),false,id+' desktop trophy retained');
    const resetCard=f.locator('.daily-reset-card');
    assert(await resetCard.locator('p').isVisible(),id+' desktop reset supporting text retained');
    assert.equal(await resetCard.locator('.reset-clock').evaluate(e=>getComputedStyle(e).fontSize),'27px',id+' desktop countdown size retained');
    assert.notEqual(await resetCard.evaluate(e=>getComputedStyle(e).boxShadow),'none',id+' desktop reset shadow retained');
   }
   await statsControl.click();const statsDialog=f.locator(id==='lowball'?'#statsModal':id==='stack-up'?'#stats-dialog':'#stats-popup');await statsDialog.waitFor({state:'visible'});await p.keyboard.press('Escape');await statsDialog.waitFor({state:'hidden'});assert(await statsControl.evaluate(e=>e===document.activeElement),id+' Stats focus restored');
   await p.reload();f=id==='lowball'?await(await p.locator('iframe').elementHandle()).contentFrame():p;await f.locator(button).waitFor();assert.equal(await f.locator(dialog).isVisible(),false,id+' returning visit');
   await f.locator(button).click();await f.locator(dialog).waitFor({state:'visible'});await p.keyboard.press('Escape');await f.locator(dialog).waitFor({state:'hidden'});
   assert.deepEqual(errors,[]);p.off('pageerror',onError);
  }
  await c.close();console.log('PASS first visits '+width+'px: all ten games independently show once, text Help reopens, focus returns, headers fit, no timer spent on initial instructions.');
 }
 const old=await browser.newContext(),resume=await old.newPage();await resume.clock.setFixedTime(new Date('2026-10-28T01:02:00Z'));await old.addInitScript(r=>localStorage.setItem('break-room:stack-up:daily:2026-10-28',JSON.stringify(r)),stackSnapshot);await game(resume,'stack-up');await resume.locator('#help-dialog').waitFor({state:'visible'});await resume.clock.setFixedTime(new Date('2026-10-28T01:02:05Z'));await resume.keyboard.press('Escape');await resume.waitForFunction(()=>document.getElementById('timer').textContent==='01:25');assert.equal(await resume.evaluate(()=>JSON.parse(localStorage.getItem('break-room:stack-up:daily:2026-10-28')).deadline),stackSnapshot.deadline);await old.close();console.log('PASS saved Stack Up deadline remains unchanged while first-visit instructions are open.');
 const c=await browser.newContext(),p=await c.newPage();await c.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('Denied')};});await game(p,'laser');await p.locator('#help-popup').waitFor({state:'visible'});await p.keyboard.press('Escape');await p.locator('#help-popup-open').click();assert(await p.locator('#help-popup').isVisible());await c.close();console.log('PASS denied storage: instructions and manual Help still work.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
