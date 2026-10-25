/* Content corrections must not reinterpret existing Daily questions or price targets. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
require('../games/lowball/engine/reference-prices.js');require('../cloud-saves.js');
const P=global.BREAK_ROOM_LOWBALL_PRICES,S=global.BREAK_ROOM_CLOUD_SAVES;
const html=read('games/lowball/engine/index.html'),items=JSON.parse(JSON.stringify(vm.runInNewContext(html.match(/const ITEMS = (\[[\s\S]*?\n\]);/)[1])));
const originals=['Standard stamp','iPhone 16','AirPods Pro 3','Spotify Premium'].map(name=>items.find(x=>x.name===name)),copy=JSON.stringify(originals);
const fresh=P.daily(originals,null,P.effectiveDay);
assert.deepEqual(fresh[0].prices,{AU:1.85,US:.82,UK:1.80,CA:1.44});assert.equal(fresh[1].prices.AU,1349);
assert.equal(JSON.stringify(originals),copy,'Never mutate frozen baseline price table');
assert.deepEqual(P.daily(originals,null,'2026-10-23'),originals,'No retroactive target changes');
assert.deepEqual(P.daily(originals,{idx:0,scores:[]},P.effectiveDay),originals,'Snapshotless draft keeps original prices');
assert.deepEqual(P.daily(originals,{items:[null],idx:1,scores:[80]},P.effectiveDay),originals,'Bad optional snapshot cannot erase legacy progress');
const saved={day:P.effectiveDay,idx:1,scores:[0],guesses:[999],pending:{guess:999,country:'AU'},items:fresh};
const alternate=originals.map(x=>({...x,prices:{AU:1,US:1,UK:1,CA:1}}));
assert.deepEqual(P.daily(alternate,saved,'2027-01-01'),fresh,'Captured targets survive later price revisions');
assert.notEqual(P.daily(originals,saved,P.effectiveDay),saved.items,'Snapshot arrays are copied');
const remote={pc_progress:JSON.stringify(saved)},local={pc_progress:JSON.stringify({...saved,items:originals})};
assert.deepEqual(JSON.parse(S.merge('lowball',local,remote).pc_progress),saved,'Equal-stage cloud data retains the entire original price snapshot');
assert.equal(S.clean('lowball',remote).pc_progress,remote.pc_progress);
assert.match(P.detail(fresh[0],'CA'),/single.*30g.*not a booklet/);
assert.match(P.detail(fresh[0],'UK'),/First Class.*100g/);
assert.equal(P.label(items.find(x=>x.name==='Pint of beer')),'Beer (500ml)');
assert.equal(P.evidence(originals[0],'AU'),null);
assert.equal(P.evidence(fresh[0],'AU').checkedAt,'2026-10-22');
assert.equal(P.evidence({priceEvidence:{AU:{checkedAt:'2026-10-22',source:'javascript:alert(1)'}}},'AU'),null);
const stake=read('games/stake/index.html'),prefix=stake.slice(stake.indexOf('const BANK='),stake.indexOf('const today='));
const helpers=stake.split('\n').filter(l=>/^function (mk|shuf|bq|dayQs)\(/.test(l)).join('\n');
const box={window:{STAKE_QUESTION_ADDITIONS:[]}};vm.createContext(box);
vm.runInContext(prefix+'\nconst idxs=()=>BANK.map((_,i)=>i);\n'+helpers,box);
for(const [index,original]of [[14,'What is the speed of light in a vacuum?'],[83,'Which blood type is the universal donor for red cells?'],[98,'Which mammal has the longest pregnancy?'],[108,'In which year did the Western Roman Empire fall?'],[120,'Who wrote the epic poem The Odyssey?']]){
 const old=vm.runInContext('bq('+index+',()=>0,false)',box),modern=vm.runInContext('bq('+index+',()=>0,true)',box);
 assert.equal(old.q,original);assert.deepEqual(old.o,modern.o);assert.equal(old.a,modern.a);
 if(index===83)assert.match(modern.f,/RhD/);else assert.notEqual(modern.q,old.q);
}
assert.match(vm.runInContext('bq(34,()=>0,true).f',box),/largest contiguous land empire/);
const day=Array.from({length:22},(_,i)=>'2026-10-'+String(i+1).padStart(2,'0')).find(d=>!vm.runInContext('dayQs('+JSON.stringify(d)+',164)',box).some(q=>q.q==='Which mammal has the longest pregnancy?'));
assert(day);
const practicePool=stake.split('\n').find(l=>l.startsWith('function practicePool('));
vm.runInContext('const today=()=>'+JSON.stringify(day)+';let run={date:today(),qs:[bq(98,()=>0,true)]};\n'+practicePool,box);
assert(!vm.runInContext('practicePool().includes(98)',box),'Corrected Daily wording must still hold the same original question out of practice');
vm.runInContext('run.qs=[bq(98,()=>0,false)]',box);
assert(!vm.runInContext('practicePool().includes(98)',box),'Historical Daily wording is also held out');
const ledger=JSON.parse(read('content/factual-review.json')),prices=JSON.parse(read('content/lowball-price-review.json'));
assert.equal(ledger.stake.length,264);assert.equal(ledger.stackUp.length,208);assert.equal(ledger.prior.length,128);
assert.equal(prices.regions.length,400);assert.equal(new Set(prices.regions.map(r=>r.itemId+':'+r.region)).size,400);
for(const row of ledger.stake.filter(r=>r.id.startsWith('stake-legacy-'))){
 const index=Number(row.id.slice(-3))-1,raw=vm.runInContext('BANK['+index+']',box);
 assert.equal(raw.q,row.originalQuestion);assert.deepEqual(Array.from(raw.o),[row.answer,...row.wrongAnswers]);
}
for(const item of items.slice(0,100))for(const region of ['AU','US','UK','CA']){
 const row=prices.regions.find(r=>r.name===item.name&&r.region===region),modern=P.current(item,P.effectiveDay);
 assert.equal(item.prices[region],row.inheritedTarget,'Frozen inherited price changed');
 assert.equal(modern.prices[region],row.reviewedTarget??row.inheritedTarget,'Only evidence-backed regional targets may change');
 assert.equal(Boolean(P.evidence(modern,region)),row.reviewedTarget!==undefined);
}
assert.equal(prices.regions.filter(r=>r.status==='corrected-dated-reference').length,345);
assert.equal(prices.regions.filter(r=>r.reviewedTarget!==undefined).length,400);
const reference=JSON.parse(read('content/reference-data.json')),audit=JSON.parse(read('content/question-audit.json'));
assert.equal(Object.keys(vm.runInContext('REVIEWED_FACTS',box)).length,16);
for(const index of [7,10,17,40,149,163]){
 const old=vm.runInContext('bq('+index+',()=>0,false)',box),modern=vm.runInContext('bq('+index+',()=>0,true)',box);
 assert.deepEqual(old.o,modern.o);assert.equal(old.a,modern.a);assert.notEqual(old.f,modern.f);
}
assert.equal(reference.countries.Ecuador.area,257217);
assert.equal(reference.countries.Finland.area,336884);
assert.equal(reference.elements.Tungsten.melt,3687);
assert.equal(reference.elements.Tin.density_g_cm3,7.287);
assert.equal(reference.airports.FRA.elevation_ft,364);
assert.equal(reference.airports.UIO.elevation_ft,7910);
assert.equal(reference.airports.YYC.elevation_ft,3606);
assert.equal(ledger.measurementReview.elements.subjects.length,30);
assert.equal(ledger.measurementReview.countries.subjects.length,25);
assert(ledger.measurementReview.changedSets.every(x=>!x.orderChanged),'Measurement edits must not reinterpret ordered saved cards');
const prior=JSON.parse(read('content/prior-events.json')).events;
assert.equal(prior.length,128);
for(const event of prior){
 const review=ledger.prior.find(x=>x.id===event.id);
 assert.equal(event.year,review.year);
 assert.equal(event.fact,review.explanationReview.fact);
 assert(review.explanationReview.crosscheckLinks.length>0,event.id);
}
assert.match(prior.find(x=>x.id==='mario').fact,/Famicom/);
const files=new Map(['content/reference-data.json','content/question-audit.json','games/stack-up/stacks.js'].map(p=>[p,read(p)])),before=new Map(files);
const fakeFs={readFileSync:p=>files.get(p),writeFileSync:(p,value)=>files.set(p,value)};
vm.runInNewContext(read('scripts/review-question-banks.cjs'),{require:id=>{if(id==='node:fs')return fakeFs;if(id==='node:vm')return vm;throw Error(id);}});
for(const [path,original]of before)assert.equal(files.get(path),original,'Reconciliation must be idempotent: '+path);
for(const name of ['Pint of beer','Uber short ride','Band-Aids box']){
 const item=items.find(x=>x.name===name),modern=P.current(item,P.effectiveDay);
 assert.equal(modern.name,item.name,'Display clarification must preserve art and save identity');
 assert.notEqual(P.label(modern),name);
}
const combo=P.current(items.find(x=>x.name==='Movie ticket popcorn combo'),P.effectiveDay);
assert.match(P.evidence(combo,'UK').supportingSources[0],/BAR-PRICE-LIST/);
const badLinks={priceEvidence:{UK:{checkedAt:'2026-10-22',source:'https://example.org/price',supportingSources:{unexpected:true}}}};
assert.equal(P.evidence(badLinks,'UK').supportingSources,undefined,'Malformed optional metadata cannot break restored receipts');
badLinks.priceEvidence.UK.supportingSources=['javascript:alert(1)',null,'https://example.org/second'];
assert.deepEqual(P.evidence(badLinks,'UK').supportingSources,['https://example.org/second']);
assert.equal(P.daily([combo,...fresh.slice(0,3)],{items:[combo,...fresh.slice(0,3)]},'2027-01-01')[0].prices.UK,17.4);
console.log('PASS factual review: frozen legacy Stake options, scoped modern wording, dated Lowball targets, draft/snapshot/zero/cloud compatibility and per-region evidence.');

const additions=JSON.parse(read('content/lowball-additions.json'));
assert.equal(additions.items.length,28);
assert.deepEqual(items.slice(0,100),JSON.parse(read('content/lowball-original-items.json')).items,'Original pool/order/base targets stay frozen');
assert.deepEqual(items.slice(100),additions.items.map(({name,emoji,detail,prices})=>({name,emoji,detail,prices})));
for(const row of additions.items)for(const region of ['AU','US','UK','CA']){
 const fresh=P.current(row,'2026-10-26');
 assert.equal(fresh.prices[region],row.evidence[region].price);
 assert.equal(P.detail(fresh,region),row.evidence[region].detail);
 assert.deepEqual(P.evidence(fresh,region),{checkedAt:'2026-10-25',source:row.evidence[region].source});
 assert.equal(P.evidence(P.current(row,'2026-10-24'),region),null,'No future evidence on historical dates');
}
console.log('PASS Lowball: 100 frozen originals plus 28 distinct products / 112 explicitly scoped regional references.');

const frozenSelector=read('content/lowball-original-selector.js'),selector=html.slice(html.indexOf('function mulberry32'),html.indexOf('let deck = []'));
const select=(body,legacy=false)=>vm.runInNewContext('const ITEMS='+JSON.stringify(legacy?items.slice(0,100):items)+',ROUNDS_PER_DAY=4;let d=0;const dayNumber=()=>d;\n'+body+'\n(day)=>{d=day;return '+(legacy?'pickDailyItems()':'legacyDailyItems()')+'.map(x=>x.name)};');
const oldSelect=select(frozenSelector,true),recovered=select(selector);
for(let d=0;d<1000;d++)assert.deepEqual(Array.from(recovered(d)),Array.from(oldSelect(d)),'Snapshotless v1 item selection day '+d);
assert.match(html,/PRICE_REFERENCES\.daily\(saved&&!PRICE_REFERENCES\.validItems\(saved.items\)\?legacyDailyItems\(\):pickDailyItems\(\),saved,todayKey\)/);
console.log('PASS 1,000 legacy dates: snapshotless saves reconstruct the original 100-item selector.');

const lowOutput=['games/lowball/engine/index.html','games/lowball/engine/reference-prices.js','games/lowball/engine/item-art.js'],lowFiles=new Map(lowOutput.map(p=>[p,read(p)]));
vm.runInNewContext(read('scripts/build-lowball-additions.cjs'),{console,require:id=>{
 if(id==='node:fs')return {readFileSync:p=>lowFiles.get(p)??read(p),writeFileSync:(p,t)=>lowFiles.set(p,t),existsSync:p=>fs.existsSync(p)};
 if(id==='node:vm')return vm;if(id==='node:assert/strict')return assert;throw Error(id);
}});
for(const p of lowOutput)assert.equal(lowFiles.get(p),read(p),'Lowball authoring must be reproducible: '+p);
