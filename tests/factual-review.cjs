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
const ledger=JSON.parse(read('content/factual-review.json')),prices=JSON.parse(read('content/lowball-price-review.json'));
assert.equal(ledger.stake.length,264);assert.equal(ledger.stackUp.length,208);assert.equal(ledger.prior.length,128);
assert.equal(prices.regions.length,400);assert.equal(new Set(prices.regions.map(r=>r.itemId+':'+r.region)).size,400);
for(const row of ledger.stake.filter(r=>r.id.startsWith('stake-legacy-'))){
 const index=Number(row.id.slice(-3))-1,raw=vm.runInContext('BANK['+index+']',box);
 assert.equal(raw.q,row.originalQuestion);assert.deepEqual(Array.from(raw.o),[row.answer,...row.wrongAnswers]);
}
for(const item of items)for(const region of ['AU','US','UK','CA']){
 const row=prices.regions.find(r=>r.name===item.name&&r.region===region),modern=P.current(item,P.effectiveDay);
 assert.equal(item.prices[region],row.inheritedTarget,'Frozen inherited price changed');
 assert.equal(modern.prices[region],row.reviewedTarget??row.inheritedTarget,'Only evidence-backed regional targets may change');
 assert.equal(Boolean(P.evidence(modern,region)),row.reviewedTarget!==undefined);
}
assert.equal(prices.regions.filter(r=>r.status==='corrected-dated-reference').length,4);
assert.equal(prices.regions.filter(r=>r.reviewedTarget!==undefined).length,13);
console.log('PASS factual review: frozen legacy Stake options, scoped modern wording, dated Lowball targets, draft/snapshot/zero/cloud compatibility and per-region evidence.');
