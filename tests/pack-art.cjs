/* Decode every custom illustration and exercise real selection, packing and restore. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',sandbox={window:{},URL,document:{currentScript:{src:base+'/games/pack/item-art.js'}}};
vm.runInNewContext(fs.readFileSync('games/pack/puzzles.js','utf8'),sandbox);vm.runInNewContext(fs.readFileSync('games/pack/item-art.js','utf8'),sandbox);
const names=[...new Set(sandbox.window.PACK_PUZZLES.flatMap(b=>b.items.map(i=>i.name)))].sort(),files=sandbox.window.BREAK_ROOM_PACK_ART.files;
assert.equal(names.length,43);assert.deepEqual(Object.keys(files).sort(),names);assert.equal(new Set(Object.values(files)).size,43);
for(const file of [...Object.values(files),'packing-item.svg'])assert(fs.readFileSync('games/pack/art/'+file,'utf8').startsWith('<svg '));
const dir='.artifacts/pack-art';fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const sheet=await browser.newPage({viewport:{width:1050,height:1000}});
  await sheet.setContent('<style>*{box-sizing:border-box}body{margin:0;padding:20px;background:#f4eddc;color:#17263a;font:14px Arial}h1{font-size:24px;margin:0 0 16px}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}figure{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;margin:0;min-height:134px;padding:10px 4px;border:2px solid #17263a;background:#fffaf0;box-shadow:2px 3px #17263a}img{width:80px;height:80px}figcaption{text-align:center;font-weight:bold;font-size:12px}</style><h1>Pack · 43 original item illustrations</h1><main class="grid">'+names.map(name=>'<figure><img src="'+base+'/games/pack/art/'+files[name]+'"><figcaption>'+name+'</figcaption></figure>').join('')+'</main>');
  await sheet.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
  const catalog=await sheet.screenshot({path:dir+'/catalog.jpg',fullPage:true,type:'jpeg',quality:86});console.log('PACK_ART_CATALOG='+catalog.toString('base64'));await sheet.close();
  for(const width of [320,390,768,1440]){
   const c=await browser.newContext({viewport:{width,height:1100},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
   await p.clock.setFixedTime(new Date('2026-10-27T03:00:00Z'));await p.goto(base+'/games/pack/index.html');
   const n=await p.locator('.pack-item').count();assert.equal(await p.locator('.item-symbol img.pack-item-art').count(),n);
   await p.locator('.item-symbol img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
   assert(await p.locator('.item-symbol img').evaluateAll(es=>es.every(e=>e.alt===''&&e.naturalWidth>0)));
   const original=await p.evaluate(()=>JSON.stringify(BREAK_ROOM_PACK.daily(PACK_PUZZLES,MIDNIGHT_ARCADE_CLOCK.dayKey())));
   const top=await p.locator('.pack-items').evaluate(e=>e.getBoundingClientRect().top+scrollY);
   for(const item of await p.locator('.pack-item').all())await item.click();
   assert.equal(await p.locator('.bag-tag img').count(),n);await p.locator('.bag-tag img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
   assert(Math.abs((await p.locator('.pack-items').evaluate(e=>e.getBoundingClientRect().top+scrollY))-top)<1,'Filling luggage does not shift the item controls');
   const raw=await p.evaluate(()=>localStorage.getItem(BREAK_ROOM_PACK.PREFIX+MIDNIGHT_ARCADE_CLOCK.dayKey()));
   assert.equal(JSON.stringify(JSON.parse(raw).bags),original,'Art does not rewrite captured item/icon/value snapshots');
   await p.reload();assert.equal(await p.locator('.bag-tag img').count(),n);assert.equal(await p.evaluate(()=>localStorage.getItem(BREAK_ROOM_PACK.PREFIX+MIDNIGHT_ARCADE_CLOCK.dayKey())),raw);
   if([390,1440].includes(width)){
    await p.locator('#game-panel').screenshot({path:dir+'/packed-'+width+'.png'});
    if(width===1440){const preview=await p.locator('#game-panel').screenshot({type:'jpeg',quality:80});console.log('PACK_ART_GAME='+preview.toString('base64'));}
   }
   await p.locator('#clear-bag').click();await p.locator('.pack-item').first().click();await p.locator('#lock-bag').click();
   assert(await p.locator('.pack-result').isVisible());assert((await p.locator('.pack-art-recap img').count())>=2);
   await p.locator('.pack-art-recap img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
   const result=await p.evaluate(()=>{const r=JSON.parse(localStorage.getItem(BREAK_ROOM_PACK.PREFIX+MIDNIGHT_ARCADE_CLOCK.dayKey()));return{valid:BREAK_ROOM_PACK.valid(r,r.day),score:BREAK_ROOM_PACK.total(r.bags[r.round],r.picks.at(-1)).points};});
   assert(result.valid);assert.match(await p.locator('.pack-result .pack-score').innerText(),new RegExp('^'+result.score+' /'));
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);await c.close();console.log('PASS Pack custom images '+width+'px: shelf/bag/review images decode, stable layout, snapshot and score preservation, reload and keyboard/touch targets.');
  }
  console.log('PASS all 43 unique custom item illustrations and neutral legacy fallback; no platform emoji required for item artwork.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
