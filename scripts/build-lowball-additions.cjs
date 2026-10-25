/* Regenerate the appended Lowball pool, reference overlay and explicit art mapping.
   Original 100 rows and snapshots are compatibility data: never reorder/reprice them. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),write=(p,t)=>fs.writeFileSync(p,t);
const data=JSON.parse(read('content/lowball-additions.json')),frozen=JSON.parse(read('content/lowball-original-items.json')).items;
assert.equal(frozen.length,100);assert.equal(data.items.length,28);
const enginePath='games/lowball/engine/index.html',engine=read(enginePath),literal=engine.match(/const ITEMS = (\[[\s\S]*?\n\]);/)[1],current=JSON.parse(JSON.stringify(vm.runInNewContext(literal)));
assert.deepEqual(current.slice(0,100),frozen,'Original identities/order/base prices are frozen');
assert.equal(new Set([...frozen,...data.items].map(x=>x.name)).size,128);
for(const row of data.items){
 assert.match(row.art,/^[a-z0-9-]+\.png$/);assert(fs.existsSync('games/lowball/engine/icons/generated/'+row.art));
 for(const region of ['AU','US','UK','CA']){
  const evidence=row.evidence[region];assert(Number.isFinite(row.prices[region])&&row.prices[region]>0);
  assert.equal(evidence.price,row.prices[region]);assert.equal(evidence.checkedAt,data.checkedAt);
  assert.equal(evidence.effectiveDay,data.priceEffectiveDay);assert.match(evidence.source,/^https:\/\/[^\s]+$/);
  assert(evidence.detail.length>20&&evidence.detail.length<=1000);
 }
}
const baseline=literal.split('\n').slice(1,101);assert.equal(baseline.length,100);
const newLiteral='[\n'+baseline.join('\n').replace(/,\s*$/,'')+',\n'+data.items.map(({name,emoji,detail,prices})=>'  '+JSON.stringify({name,emoji,detail,prices})).join(',\n')+'\n]';
write(enginePath,engine.replace(literal,()=>newLiteral));
const pricePath='games/lowball/engine/reference-prices.js',price=read(pricePath),priceMatch=price.match(/const reviewed=(\{[\s\S]*?\n\});/),reviewed=JSON.parse(priceMatch[1]);
for(const row of data.items)reviewed[row.name]=row.evidence;
write(pricePath,price.replace(priceMatch[1],()=>JSON.stringify(reviewed,null,2)));
const artPath='games/lowball/engine/item-art.js',art=read(artPath),artMatch=art.match(/const items = Object\.freeze\((\{[\s\S]*?\n\})\);/),mapping=JSON.parse(artMatch[1]);
for(const row of data.items)mapping[row.name]=row.art;
write(artPath,art.replace(artMatch[1],()=>JSON.stringify(mapping,null,2)));
console.log('Built 128 Lowball products; original 100 frozen, 28 additions with 112 dated regional references and generated PNGs.');
