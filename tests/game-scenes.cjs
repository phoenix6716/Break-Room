/* Real public surfaces, action-driven motion, silent hydration and a still timing game. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const ids=['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock'];
const names=['Laser','Time Drop','Clue Ladder','Seating Chart','Desk Jam','Sleeper','Stack Up','Pack','Lowball','Time Sense'];
const dir='.artifacts/game-scenes';fs.mkdirSync(dir,{recursive:true});
const snapshots={desktop:[],mobile:[],review:[],environment:[]};
async function pause(p){await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function view(page,id){
 await page.goto(base+'/games/'+id+'/index.html');
 if(id==='lowball'){
  const f=await(await page.locator('#lowball-game-frame').elementHandle()).contentFrame();await f.locator('body[data-scene-ready=true]').waitFor();return f;
 }
 await page.locator('body[data-scene-ready=true]').waitFor();return page;
}
const motions=p=>p.evaluate(()=>window.__sceneMotions);
async function shot(p,id,group){
 const selector=id==='lowball'?'.card':'#game-panel',file=path.join(dir,group+'-'+id+'.png');
 await p.locator(selector).screenshot({path:file,animations:'disabled'});snapshots[group].push({id,file});
}
async function action(p,id){
 if(id==='laser'){
  const plan=await p.evaluate(()=>{const b=LASER_BOARDS.find(x=>x.id===document.querySelector('#engine-slot').dataset.boardId);return BREAK_ROOM_LASER.solve(b)[0];});
  for(const[r,c,o]of plan){await p.locator('[data-row="'+r+'"][data-col="'+c+'"]').click();if(o==='\\')await p.locator('[data-row="'+r+'"][data-col="'+c+'"]').click();}
  await p.locator('#fire-beam').click();assert(await p.locator('.laser-feedback.hit').isVisible());
 }else if(id==='time-drop'){
  const year=await p.evaluate(()=>TIME_DROP_EVENTS.find(x=>x.id===document.querySelector('#engine-slot').dataset.eventId).year);
  await p.locator('#year-era').selectOption(year<0?'bce':'ce');await p.locator('#year-input').fill(String(Math.abs(year)));await p.locator('#lock-guess').click();assert(await p.locator('.td-review').isVisible());
 }else if(id==='clue-ladder'){
  await p.locator('#next-clue').click();await pause(p);
  const answer=await p.evaluate(()=>CLUE_LADDER_PUZZLES.find(x=>x.id===document.querySelector('#engine-slot').dataset.puzzleId).answer);
  await p.locator('#guess-input').fill(answer);await p.locator('#submit-guess').click();assert(await p.locator('.cl-review').isVisible());
 }else if(id==='seating-chart'){
  const order=await p.evaluate(()=>SEATING_CHART_PUZZLES.find(x=>x.id===document.querySelector('#engine-slot').dataset.puzzleId).solution);
  for(let i=0;i<order.length;i++){await p.locator('#guest-'+order[i]).click();await p.locator('#seat-'+i).click();}
  await p.getByRole('button',{name:/HOST|RECEPTION|LOCK/i}).last().click();assert(await p.locator('.sc-review').isVisible());
 }else if(id==='shift-work'){
  const plan=await p.evaluate(()=>{const b=SHIFT_WORK_BOARDS.find(x=>x.id===document.querySelector('#floor').dataset.boardId);return BREAK_ROOM_SHIFT_WORK.solve(b).path;});
  for(const[i,d]of plan){await p.locator('[data-piece="'+i+'"]').click();await p.locator('#slide-options [data-delta="'+d+'"]').click();}
  assert(await p.locator('.sw-review').isVisible());
 }else if(id==='hidden-gem'){
  await p.locator('#start-question').click();
  const answer=await p.evaluate(()=>{const d=MIDNIGHT_ARCADE_CLOCK.dayKey(),r=JSON.parse(localStorage.getItem(BREAK_ROOM_HIDDEN_GEM.PREFIX+d));return r.questions[r.round].answers.find(a=>a.points===100).name;});
  await p.locator('#answer-input').fill(answer);await p.locator('#lock-answer').click();assert(await p.locator('.dc-review').isVisible());
 }else if(id==='stack-up'){
  for(let n=1;n<=5;n++){let at=await p.locator('.sort-card[data-value="'+n+'"]').evaluate(e=>[...e.parentNode.children].indexOf(e));while(at>n-1){await p.locator('.sort-card[data-value="'+n+'"] button').first().click();at--;}}
  await p.locator('#check-button').click();assert(await p.locator('.result-modal.open').isVisible());
 }else if(id==='pack'){
  await p.locator('.pack-item').first().click();await pause(p);await p.locator('#lock-bag').click();assert(await p.locator('.pack-result').isVisible());
 }else if(id==='lowball'){
  const value=await p.evaluate(()=>currentItem.prices[country]);await p.locator('#guessInput').fill(String(value));await p.locator('#submitBtn').click();assert(await p.locator('#resultArea.show').isVisible());
 }else if(id==='inner-clock'){
  await p.locator('#clock-action').click();
  const html=await p.locator('#engine-slot').innerHTML(),count=(await motions(p)).length;await p.waitForTimeout(200);
  for(let i=0;i<5;i++){await pause(p);assert.equal(await p.evaluate(()=>document.getAnimations().length),0,'No movement gives a timing cue');}
  assert.equal(await p.locator('#engine-slot').innerHTML(),html,'No visual ticks while measuring');
  assert.equal((await motions(p)).length,count,'Presentation does no work during the attempt');
  await p.locator('#clock-action').click();assert(await p.locator('.clock-review').isVisible());
 }
 await pause(p);
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const reducedMotion of ['no-preference','reduce']){
   const c=await browser.newContext({viewport:{width:390,height:1000},reducedMotion});
   await c.addInitScript(()=>{
    localStorage.setItem('pc_help_seen','1');
    window.__sceneMotions=[];const animate=Element.prototype.animate;
    Element.prototype.animate=function(frames,options){window.__sceneMotions.push({node:this.className,frames,options});return animate.call(this,frames,options);};
   });
   for(const id of ids){
    const page=await c.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.clock.setFixedTime(new Date('2026-10-27T03:00:00Z'));
    const p=await view(page,id);await pause(p);
    assert.equal((await motions(p)).length,0,id+' hydration stays quiet');
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,id+' phone layout');
    if(id!=='lowball'){
     assert(await p.locator('#game-panel button,#game-panel input,#game-panel select').evaluateAll(es=>{
      const board=document.querySelector('#game-panel').getBoundingClientRect();
      return es.filter(e=>e.getClientRects().length).every(e=>{const r=e.getBoundingClientRect();return r.left>=board.left-1&&r.right<=board.right+1;});
     }),id+' controls stay inside the surface');
    }
    if(reducedMotion==='no-preference')await shot(p,id,'mobile');
    await action(p,id);
    const effects=await motions(p);
    if(reducedMotion==='reduce')assert.equal(effects.length,0,id+' reduced motion');
    else assert(effects.length>0,id+' has feedback from real play');
    assert(effects.every(e=>e.options.duration<=300),'Effects stay brief');
    const saved=await p.evaluate(()=>JSON.stringify({...localStorage}));
    await page.waitForTimeout(350);assert.equal(await p.evaluate(()=>JSON.stringify({...localStorage})),saved,id+' visual feedback does not write saves');
    if(reducedMotion==='no-preference'){await page.waitForTimeout(750);await shot(p,id,'review');}
    await page.reload();const restored=id==='lowball'?await(await page.locator('iframe').elementHandle()).contentFrame():page;
    await restored.locator('body[data-scene-ready=true]').waitFor();await pause(restored);
    assert.equal((await motions(restored)).length,0,id+' restored result does not replay effects');
    assert.deepEqual(errors,[]);await page.close();
    console.log('PASS scene '+id+' '+reducedMotion+': actual action/review, quiet hydration, preserved saves, accessible static fallback.');
   }
   await c.close();
  }
  const c=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
  await c.addInitScript(()=>localStorage.setItem('pc_help_seen','1'));
  for(const id of ids){const page=await c.newPage();const p=await view(page,id);await shot(p,id,'desktop');const environment=path.join(dir,'environment-'+id+'.png');await page.screenshot({path:environment,animations:'disabled'});snapshots.environment.push({id,file:environment});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,id+' desktop layout');await page.close();}
  await c.close();
  const sheet=await browser.newPage();
  for(const [group,images]of Object.entries(snapshots)){
   const inputs=images.map(({id,file})=>({name:names[ids.indexOf(id)],src:'data:image/png;base64,'+fs.readFileSync(file).toString('base64')}));
   const data=await sheet.evaluate(async ({inputs,wide})=>{
    const canvas=document.createElement('canvas');const tw=wide?600:400,th=wide?500:568;canvas.width=tw*2;canvas.height=th*5;const ctx=canvas.getContext('2d');ctx.fillStyle='#f4eddc';ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<inputs.length;i++){
     const tile=inputs[i],img=new Image();img.src=tile.src;await img.decode();
     const x=i%2*tw,y=Math.floor(i/2)*th,scale=Math.min((tw-12)/img.width,(th-50)/img.height),w=img.width*scale,h=img.height*scale;
     ctx.fillStyle='#17263a';ctx.fillRect(x,y,tw,32);ctx.fillStyle='#fffaf0';ctx.font='bold 16px sans-serif';ctx.fillText(tile.name,x+12,y+22);
     ctx.drawImage(img,x+(tw-w)/2,y+38+(th-50-h)/2,w,h);
    }
    return canvas.toDataURL('image/jpeg',.82).split(',')[1];
   },{inputs,wide:group==='environment'});
   fs.writeFileSync(path.join(dir,group+'-contact.jpg'),Buffer.from(data,'base64'));
   console.log('SCENE_PREVIEW_'+group.toUpperCase()+'='+data);
  }
  await sheet.close();
  console.log('PASS all ten themed surfaces: normal/reduced motion, real native actions, reload/save preservation, motionless blind timing and mobile/desktop screenshots.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
