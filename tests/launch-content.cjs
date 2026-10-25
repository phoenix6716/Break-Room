/* Content release contract: existing Daily + 32 fresh following days, and later rolling windows. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),box={window:{}},banks={};
for(const name of ['pack','laser','alibi','bouncer','prior','inner-clock'])require('../'+name+'-model.js');
const definitions={pack:['puzzles','PACK_PUZZLES'],laser:['boards','LASER_BOARDS'],alibi:['cases','ALIBI_CASES'],bouncer:['puzzles','BOUNCER_PUZZLES'],prior:['events','PRIOR_EVENTS']};
for(const [name,[file,key]]of Object.entries(definitions)){vm.runInNewContext(read('games/'+name+'/'+file+'.js'),box);banks[name]=JSON.parse(JSON.stringify(box.window[key]));}
vm.runInNewContext(read('games/alibi/evidence-cases.js'),box);banks.alibi.push(...JSON.parse(JSON.stringify(box.window.ALIBI_EVIDENCE_CASES)));
const dates=(start,n)=>Array.from({length:n},(_,i)=>new Date(Date.parse(start+'T00:00:00Z')+i*86400000).toISOString().slice(0,10));
for(const [start,n]of [['2026-10-22',33],['2026-11-07',32],['2027-03-21',32]]){
 for(const [name,bank]of Object.entries(banks)){const M=globalThis['BREAK_ROOM_'+name.toUpperCase()],days=dates(start,n).map(d=>M.daily(bank,d)),keys=days.flat().map(p=>Array.isArray(p)?p.map(e=>e.id).sort().join('|'):p.id);assert.equal(new Set(keys).size,keys.length,name+' repeats from '+start);
 for(const [i,d]of dates(start,n).entries()){if(d<'2026-10-23')continue;
 if(name==='pack')assert.equal(days[i][2].items.length,10);
 if(name==='laser')assert(Number(days[i][3].id.split('-').at(-1))>96);
 if(name==='alibi')assert.equal(days[i][3].version,3);
 if(name==='bouncer')assert.deepEqual(days[i].map(p=>p.level),[1,3]);
 if(name==='prior')assert(days[i].slice(3).every(p=>M.gap(p)<=3));
 }}
}
const stakeText=read('games/stake/index.html'),quote=String.fromCharCode(96),legacy=stakeText.split('const BANK='+quote)[1].split(quote+'.trim()')[0].trim().split('\n').map(l=>{const a=l.split('|');return{c:a[0],q:a[1],o:a.slice(2,5),f:a[5]};});
vm.runInNewContext(read('games/stake/questions.js'),box);const BANK=[...legacy,...JSON.parse(JSON.stringify(box.window.STAKE_QUESTION_ADDITIONS))],stakeFunctions=stakeText.split('\n').filter(l=>/^function (mk|shuf|bq|dayQs)\(/.test(l)).join('\n');
const reviewedFacts='const REVIEWED_FACTS='+stakeText.match(/const REVIEWED_FACTS=([\s\S]*?);\nBANK\.push/)[1]+';';
const stake=vm.runInNewContext(reviewedFacts+'\nconst BANK='+JSON.stringify(BANK)+';const LEGACY_BANK_SIZE=164;const idxs=()=>BANK.map((_,i)=>i);\n'+stakeFunctions+'\ndayQs');
vm.runInNewContext(read('games/stack-up/stacks.js'),box);vm.runInNewContext(read('games/stack-up/familiar-stacks.js'),box);const pool=JSON.parse(JSON.stringify([...box.window.STACK_UP_STACKS,...box.window.STACK_UP_FAMILIAR_STACKS])),stackFunctions=read('games/stack-up/stack-up.js').split('\n').filter(l=>/^ function (seeded|shuffle|dailySet)\(/.test(l)).join('\n'),stack=vm.runInNewContext('const pool='+JSON.stringify(pool)+';\n'+stackFunctions+'\ndailySet');
for(const start of ['2026-10-22','2026-11-07','2027-03-21']){
 const ds=dates(start,start==='2026-10-22'?33:32),questions=ds.flatMap(d=>Array.from(stake(d))).map(q=>q.q),sets=ds.flatMap(d=>Array.from(stack(d))).map(i=>pool[i].id);
 assert.equal(new Set(questions).size,questions.length,'Stake repeats');assert.equal(new Set(sets).size,sets.length,'Stack Up repeats');
 for(const d of ds.filter(d=>d>='2026-10-23')){assert(['Chemistry','Literature'].includes(stake(d)[4].c));assert(pool[stack(d)[4]].id.startsWith('stack-familiar-4-'));}
 const times=ds.map(d=>JSON.stringify(BREAK_ROOM_INNER_CLOCK.daily(d)));assert.equal(new Set(times).size,ds.length);
}
for(const name of ['pack','laser','alibi','bouncer']){const rows=banks[name];assert.equal(new Set(rows.map(p=>p.id)).size,rows.length);}

const lowText=read('games/lowball/engine/index.html'),itemLiteral=lowText.match(/const ITEMS = (\[[\s\S]*?\n\]);/);assert(itemLiteral,'Lowball item source exists');
const itemCount=vm.runInNewContext(itemLiteral[1]).length,selector=lowText.slice(lowText.indexOf('function mulberry32'),lowText.indexOf('let deck = []'));
const low=vm.runInNewContext('const ITEMS=Array.from({length:'+itemCount+'},(_,id)=>({id})),ROUNDS_PER_DAY=4;let selectedDay=0;const dayNumber=()=>selectedDay;\n'+selector+'\n(d)=>{selectedDay=d;return pickDailyItems().map(x=>x.id)}');
for(const start of ['2026-10-22','2026-11-07','2027-03-21']){const sets=dates(start,start==='2026-10-22'?33:32).map(d=>JSON.stringify(low(Math.floor((Date.parse(d+'T00:00:00Z')-Date.UTC(2026,9,1))/86400000))));assert.equal(new Set(sets).size,sets.length,'Lowball repeats a complete Daily');}
assert.equal(new Set(Array.from({length:25},(_,i)=>Array.from(low(i))).flat()).size,100,'Lowball preserves the 100-item cycle');

console.log('PASS 22 October–23 November 2026 and later rolling windows: distinct Daily puzzles/questions, harder final tiers, no expiry. Lowball historical selection retains its original 100-product cycle; the current 128-product / 32-day ring is checked by daily-content.cjs.');
