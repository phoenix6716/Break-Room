const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL,day='2026-10-27',key='break-room:shift-work:daily:'+day;
const read=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
async function wait(p){await p.waitForTimeout(280);}
async function plan(p){return p.evaluate(()=>{const r=JSON.parse(localStorage.getItem(BREAK_ROOM_SHIFT_WORK.PREFIX+MIDNIGHT_ARCADE_CLOCK.dayKey()));return BREAK_ROOM_SHIFT_WORK.solve(r.boards[r.round],r.pos).path;});}
async function move(p,i,d){await p.locator('[data-piece="'+i+'"]').click();await p.locator('#slide-options [data-delta="'+d+'"]').click();}
(async()=>{const b=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM,args:['--no-sandbox']});
try{for(const reduce of ['no-preference','reduce'])for(const width of [390,1440]){
 const c=await b.newContext({viewport:{width,height:1100},reducedMotion:reduce}),p=await c.newPage();await p.clock.setFixedTime(new Date(day+'T03:00:00Z'));await p.goto(base+'/games/shift-work/index.html');await p.locator('body[data-game-art-ready=true]').waitFor();
 assert.equal(await p.locator('.sw-piece').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).length),0,'quiet initial layout');
 const initial=await read(p),[i,d]=(await plan(p))[0],axis=initial.boards[0].pieces[i].axis;
 await move(p,i,d);assert.equal((await read(p)).moves,1,'saved before animation ends');
 const piece=p.locator('[data-piece="'+i+'"]');
 assert.equal(await piece.evaluate(e=>e.getAnimations().length),reduce==='reduce'?0:1,'one native travel animation, no shared duplicate');
 if(reduce==='no-preference'){const data=await piece.evaluate(e=>{const a=e.getAnimations()[0];a.pause();a.currentTime=80;return {frames:a.effect.getKeyframes().map(f=>f.transform),now:getComputedStyle(e).transform};});assert.notEqual(data.now,'none');assert.notEqual(data.frames[0],data.frames[1]);}
 await p.locator('#undo').click();assert.deepEqual((await read(p)).pos,initial.pos);assert.equal((await read(p)).moves,1);await wait(p);await p.locator('#restart').click();await wait(p);
 const target=await piece.boundingBox(),floor=await p.locator('#floor').boundingBox(),cell=(floor.width-6)/6,x=target.x+target.width/2,y=target.y+target.height/2,sign=Math.sign(d);
 await p.mouse.move(x,y);await p.mouse.down();const offset=sign*cell*.23;
 await p.mouse.move(x+(axis==='h'?offset:0),y+(axis==='v'?offset:0));
 const delta=await piece.evaluate((el,axis)=>{const m=new DOMMatrix(getComputedStyle(el).transform);return axis==='h'?m.m41:m.m42;},axis);
 assert(Math.abs(delta-offset)<1,'drag follows fractional pixels rather than whole cells');assert.equal((await read(p)).moves,0);
 await p.mouse.move(x+(axis==='h'?sign*cell*.77:0),y+(axis==='v'?sign*cell*.77:0));await p.mouse.up();
 assert.equal((await read(p)).moves,1);assert.equal((await read(p)).pos[i],initial.pos[i]+sign);
 await wait(p);assert.equal(await piece.evaluate(e=>e.getAnimations().length),0);
 const frozen=JSON.stringify(await read(p));await p.reload();await wait(p);assert.equal(JSON.stringify(await read(p)),frozen);assert.equal(await p.locator('.sw-piece').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).length),0,'reload has no travel');
 if(reduce==='no-preference'){
  const path=await plan(p);await move(p,...path[0]);await p.locator('#undo').click();await p.locator('#restart').click();await wait(p);assert.deepEqual((await read(p)).pos,initial.pos,'rapid actions settle at the saved state');
  fs.mkdirSync('.artifacts/desk-jam-motion',{recursive:true});
  const img=await p.locator('#floor').screenshot({path:'.artifacts/desk-jam-motion/board-'+width+'.jpg',type:'jpeg'});console.log('DESK_MOTION_BOARD_'+width+'='+img.toString('base64'));
 }
 await c.close();console.log('PASS Desk Jam '+width+' '+reduce+': pixel-following drag, native travel, instant saves, Undo/Restart, rapid input and quiet reload.');
}}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
