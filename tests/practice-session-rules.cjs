const assert=require('node:assert/strict');require('../practice-session.js');
const {deck}=globalThis.BREAK_ROOM_PRACTICE,items=Array.from({length:60},(_,i)=>({id:String(i),tier:i%3}));
for(const random of [()=>0,()=>.999999,Math.random]){const d=deck(x=>x.id,random);let previous;
 for(let cycle=0;cycle<8;cycle++){const picked=Array.from({length:60},()=>d.pick(items).id);assert.equal(new Set(picked).size,60);if(previous)assert.notEqual(picked[0],previous);previous=picked.at(-1);}
 const filtered=deck(x=>x.id,random);for(const tier of [0,1,2,0]){const pool=items.filter(x=>x.tier===tier);assert.equal(new Set(Array.from({length:20},()=>filtered.pick(pool).id)).size,20);}
 const single=deck();assert.equal(single.pick([{id:'only'}]).id,'only');assert.equal(single.pick([{id:'only'}]).id,'only');assert.throws(()=>single.pick([]),/empty/);
}
console.log('PASS practice decks: eight complete cycles without repeats, boundary avoidance, filter changes, deterministic extremes, single-item and empty pools; no storage dependency.');
