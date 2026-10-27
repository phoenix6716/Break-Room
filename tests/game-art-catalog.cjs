/* Decode every custom object asset and capture the complete illustration catalog. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000',scope={window:{}};
vm.runInNewContext(fs.readFileSync('assets/game-art/manifest.js','utf8'),scope);
const art=scope.window.BREAK_ROOM_ART_FILES,files=Array.from(art.files),dir='.artifacts/game-art';fs.mkdirSync(dir,{recursive:true});
assert.equal(new Set(files).size,files.length);assert.equal(art.portraits.length,16);
for(const file of files)assert(fs.existsSync('dist/assets/game-art/'+file),file+' is published');
(async()=>{const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const p=await browser.newPage({viewport:{width:1200,height:1100}});
 const subjects=Object.entries(art.subjects).map(([name,file])=>({name:name.split('|')[1],file})),objects=files.filter(f=>!f.startsWith('stack/')).map(file=>({name:file.replace('.svg',''),file}));
 const batches=[{key:'objects',items:objects},...Array.from({length:Math.ceil(subjects.length/56)},(_,i)=>({key:'cards-'+(i+1),items:subjects.slice(i*56,i*56+56)}))];
 for(const {key,items}of batches){
  await p.setContent('<style>*{box-sizing:border-box}body{margin:0;padding:20px;background:#f4eddc;color:#17263a;font:13px Arial}h1{font-size:22px;margin:0 0 16px}.grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:10px}figure{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:2px solid #17263a;box-shadow:2px 3px #17263a;background:#fffaf0;padding:8px 4px;min-height:146px}img{width:90px;height:90px;object-fit:contain}figcaption{font-size:10px;text-align:center;overflow-wrap:anywhere;line-height:1.25}</style><h1>Break Room · Custom game objects · '+key+'</h1><div class="grid">'+items.map(x=>'<figure><img src="'+base+'/assets/game-art/'+x.file+'"><figcaption>'+x.name.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</figcaption></figure>').join('')+'</div>');
  await p.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
  assert(await p.locator('img').evaluateAll(es=>es.every(e=>e.naturalWidth>0)));
  const img=await p.screenshot({path:dir+'/catalog-'+key+'.jpg',fullPage:true,type:'jpeg',quality:84});console.log('GAME_ART_CATALOG_'+key.replaceAll('-','_').toUpperCase()+'='+img.toString('base64'));
 }
 await p.close();console.log('PASS: '+files.length+' custom object images decode; complete subject-card, hardware, era, category and guest catalogs captured.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
