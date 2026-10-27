/* Public artifact contract: retired engines and history never become visible. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {chromium}=require('playwright'),{qs}=require('./profile-records.cjs');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
const retired=["stake","prior","alibi","bouncer","pixel-pairs","word-forge","gridlock","number-drop","memory-lane","mystery-cabinet"],active=["laser","time-drop","clue-ladder","seating-chart","shift-work","hidden-gem","stack-up","pack","lowball","inner-clock"];
const registry={window:{}};vm.runInNewContext(fs.readFileSync('dist/game-config.js','utf8'),registry);
assert.deepEqual(Array.from(registry.window.MIDNIGHT_ARCADE_GAMES,g=>g.id).sort(),[...active].sort());
for(const id of retired){
 const dir=path.join('dist/games',id);assert.deepEqual(fs.readdirSync(dir),['index.html'],id+' has no engine, bank or assets');
 assert.match(fs.readFileSync(path.join(dir,'index.html'),'utf8'),/http-equiv="refresh"/);
}
function htmlFiles(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?htmlFiles(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
for(const file of htmlFiles('dist')){
 const html=fs.readFileSync(file,'utf8');
 for(const id of retired)assert(!new RegExp('href=["\'][^"\']*games/'+id+'/').test(html),file+' exposes '+id);
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const home=u=>u.pathname===new URL(base+'/index.html').pathname;
  for(const id of retired){
   await page.goto(base+'/games/'+id+'/index.html');await page.waitForURL(home);
   await page.goto(base+'/game.html?id='+id);await page.waitForURL(home);
  }
  await page.goto(base+'/game.html?id=unknown');await page.waitForURL(home);
  await page.goto(base+'/game.html?id=laser');await page.waitForURL(u=>u.pathname.endsWith('/games/laser/index.html'));
  const noJS=await browser.newContext({javaScriptEnabled:false}),fallback=await noJS.newPage();
  await fallback.goto(base+'/games/stake/index.html');await fallback.waitForURL(home);await noJS.close();
  await page.clock.setFixedTime(new Date('2026-10-20T03:00:00Z'));await page.goto(base+'/profile.html');
  await page.evaluate(qs=>{
   localStorage.clear();for(let i=14;i<=20;i++)localStorage.setItem('stake:d:2026-10-'+i,JSON.stringify({b:[3,3,3,3,3],p:[0,0,0,0,0],qs}));
  },qs);
  const snapshot=()=>page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))));
  const before=await snapshot();await page.reload();
  assert.equal(await page.locator('#total-runs').innerText(),'0');assert.equal(await page.locator('#arcade-average').innerText(),'—');
  assert.equal(await page.locator('#overall-streak').innerText(),'0 days');assert.equal(await page.locator('.profile-result').count(),0);
  assert.equal(await page.locator('.profile-achievement.earned').count(),0);assert.equal(await page.locator('.activity-day:not([data-count="0"])').count(),0);
  assert.equal(await snapshot(),before,'Viewing profile preserves private saves');
  for(const text of ['Stake','Prior','Alibi','Bouncer','Clean sweep'])assert(!(await page.locator('body').innerText()).includes(text),'No retired label: '+text);
  assert.equal(await page.locator('.profile-game').count(),10);assert.equal(await page.locator('#result-filter option').count(),11);
  await page.evaluate(()=>{localStorage.setItem('pc_played','1');localStorage.setItem('pc_last','2026-10-20');localStorage.setItem('pc_last_avg','100');});
  const mixed=await snapshot();await page.reload();
  assert.equal(await page.locator('#total-runs').innerText(),'1');assert.equal(await page.locator('#arcade-average').innerText(),'100');
  assert.equal(await page.locator('.profile-result').count(),1);assert.equal(await page.locator('.profile-result[data-game=lowball]').count(),1);
  assert.equal(await snapshot(),mixed);assert.deepEqual(errors,[]);
  await page.close();
  console.log('PASS: all retired/cancelled routes redirect, JavaScript-free fallback, no retired artifacts or public links, active launcher works, retired-only and mixed profile stats are private and read-only.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
