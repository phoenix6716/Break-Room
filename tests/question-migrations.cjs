const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:1000}}),page=await context.newPage();
  await page.goto(base+'/games/stack-up/index.html');
  const day=await page.evaluate(()=>MIDNIGHT_ARCADE_CLOCK.dayKey());
  await page.evaluate(day=>{
   localStorage.setItem('break-room:stack-up:daily:'+day,JSON.stringify({version:1,day,round:0,score:-300,streak:0,results:[],order:[5,4,3,2,1],deadline:Date.now()+90000,mistakes:1,status:'playing',stack:0}));
  },day);
  await page.reload();assert(await page.locator('#game-interface').isVisible());assert.equal(await page.locator('#run-score').innerText(),'-300');
  const oldNames=await page.locator('.card-name').allTextContents();
  assert(oldNames.every(n=>typeof n==='string'&&n.length));
  assert((await page.locator('.card-detail').allTextContents()).every(t=>t===''),'Legacy descriptions must also be hidden');
  await page.locator('.sort-card').first().locator('button').last().click();
  const migrated=await page.evaluate(day=>JSON.parse(localStorage.getItem('break-room:stack-up:daily:'+day)),day);
  assert.equal(migrated.version,2);assert.equal(migrated.stacks.length,5);
  await page.evaluate(()=>STACK_UP_STACKS.reverse());await page.locator('[data-mode=daily]').click();
  assert.deepEqual((await page.locator('.card-name').allTextContents()).sort(),oldNames.sort());
  // Start tomorrow's entirely new run and verify that its snapshots contain the harder bank.
  await page.evaluate(day=>localStorage.removeItem('break-room:stack-up:daily:'+day),day);await page.reload();await page.locator('[data-start-mode=daily]').click();
  const before=await page.locator('#prompt').innerText();await page.evaluate(()=>STACK_UP_STACKS.reverse());await page.locator('[data-mode=daily]').click();assert.equal(await page.locator('#prompt').innerText(),before);
  assert((await page.locator('.card-detail').allTextContents()).every(t=>t===''));
  // Stress every prompt/card label at narrow and wide widths using disposable run fixtures.
  for(const width of [320,1440]){
   await page.setViewportSize({width,height:1000});
   const problems=await page.evaluate(day=>{
    const bad=[];
    for(const stack of STACK_UP_STACKS){
     const fixture={version:2,day,round:0,score:0,streak:0,results:[],order:[5,4,3,2,1],deadline:Date.now()+90000,mistakes:0,status:'playing',stacks:Array(5).fill(stack)};
     localStorage.setItem('break-room:stack-up:daily:'+day,JSON.stringify(fixture));
     document.querySelector('[data-mode=daily]').click();
     if(document.documentElement.scrollWidth>innerWidth)bad.push(stack.id);
     if([...document.querySelectorAll('.card-detail')].some(e=>e.textContent))bad.push(stack.id+':description');
    }
    return bad;
   },day);
   assert.deepEqual(problems,[],`Prompt/card overflow or spoilers at ${width}px`);
  }
  await page.goto(base+'/games/stake/index.html');
  const legacyQs=await page.evaluate(day=>dayQs(day,164),day);
  await page.evaluate(day=>{
   localStorage.setItem('break-room:stake:daily-reset:2026-10-19','1');
   localStorage.setItem('stake:d:'+day,JSON.stringify({b:[2],p:[]}));
  },day);await page.reload();
  assert.deepEqual(await page.evaluate(()=>run.qs),legacyQs);
  await page.locator('button.opt').first().click();
  const snapshot=await page.evaluate(day=>JSON.parse(localStorage.getItem('stake:d:'+day)),day);assert.equal(snapshot.qs.length,5);
  const score=await page.evaluate(()=>sc(run));
  await page.evaluate(()=>BANK.reverse());
  assert.deepEqual(await page.evaluate(day=>mkRun('d',day,'stake:d:'+day).qs,day),snapshot.qs);
  assert.equal(await page.evaluate(day=>sc(mkRun('d',day,'stake:d:'+day)),day),score);
  await context.close();console.log('PASS: old Stack Up and Stake runs retain their questions, scores and progress; new snapshots resist later bank reordering; no old spoiler details render.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
