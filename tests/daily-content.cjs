/* Check the ten shipped Daily selectors without opening engines or touching player saves. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),box={window:{}},HORIZON=32;
const dates=(start,n)=>Array.from({length:n},(_,i)=>new Date(Date.parse(start+'T00:00:00Z')+i*86400000).toISOString().slice(0,10));
function bank(file,key){vm.runInNewContext(read(file),box,{filename:file});return JSON.parse(JSON.stringify(box.window[key]));}
function model(id){require('../'+id+'-model.js');return globalThis['BREAK_ROOM_'+id.toUpperCase().replaceAll('-','_')];}
const defs=[
 {id:'laser',name:'Laser',file:'boards',key:'LASER_BOARDS',rounds:4,period:32,validate:'board'},
 {id:'time-drop',name:'Time Drop',file:'events',key:'TIME_DROP_EVENTS',rounds:5,period:66,validate:'event'},
 {id:'clue-ladder',name:'Clue Ladder',file:'puzzles',key:'CLUE_LADDER_PUZZLES',rounds:5,period:60,validate:'puzzle'},
 {id:'seating-chart',name:'Seating Chart',file:'puzzles',key:'SEATING_CHART_PUZZLES',rounds:5,period:72,validate:'puzzle'},
 {id:'shift-work',name:'Desk Jam',file:'boards',key:'SHIFT_WORK_BOARDS',rounds:3,period:40,validate:'validBoard'},
 {id:'hidden-gem',name:'Sleeper',file:'questions',key:'HIDDEN_GEM_QUESTIONS',rounds:5,period:32,validate:'puzzle'},
 {id:'pack',name:'Pack',file:'puzzles',key:'PACK_PUZZLES',rounds:3,period:32,validate:'validBag'}
];
function challenge(id,p){
 switch(id){
 case 'laser':return [p.n,p.row,p.t,p.fx.slice().sort(),p.w.slice().sort()];
 case 'time-drop':return [p.title,p.year,p.earliest,p.latest];
 case 'clue-ladder':return [p.answer,p.clues];
 case 'seating-chart':return [p.g,p.names,p.rules.map(r=>[r.type,r.a,r.b]).sort()];
 case 'shift-work':return [p.pieces.map(v=>[v.axis,v.len,v.lane]),p.start];
 case 'hidden-gem':return [p.prompt,p.scope,p.answers.map(a=>[a.name,a.points]).sort()];
 case 'pack':return [p.limit,p.items.map(i=>[i.name,i.weight,i.points]).sort()];
 case 'stack-up':return [p.prompt,p.cards.map(c=>[c.name,c.value]).sort()];
 case 'lowball':return p.name;
 case 'inner-clock':return p;
 default:throw Error('Add a challenge fingerprint for '+id);
 }
}
const specs=defs.map(d=>{
 const M=model(d.id),pool=bank('games/'+d.id+'/'+d.file+'.js',d.key);
 assert.equal(new Set(pool.map(p=>p.id)).size,pool.length,d.name+' duplicate IDs');
 pool.forEach(p=>assert(M[d.validate](p),d.name+' invalid content '+p.id));
 return {...d,bankCount:pool.length,pool,identity:p=>p.id,select:day=>M.daily(pool,day)};
});
const stacks=bank('games/stack-up/stacks.js','STACK_UP_STACKS'),familiar=bank('games/stack-up/familiar-stacks.js','STACK_UP_FAMILIAR_STACKS'),replacementMap=new Map(box.window.STACK_UP_REPLACEMENT_STACKS.map(s=>[s.id,s])),stackPool=[...stacks.map(s=>replacementMap.get(s.id)||s),...familiar];
const stackFunctions=read('games/stack-up/stack-up.js').split('\n').filter(l=>/^ function (seeded|shuffle|dailySet)\(/.test(l)).join('\n');
assert.equal((stackFunctions.match(/ function /g)||[]).length,3,'Keep extracting the real Stack Up selector');
const stackFor=pool=>vm.runInNewContext('const pool='+JSON.stringify(pool)+';\n'+stackFunctions+'\n(day)=>dailySet(day).map(i=>pool[i]);');
const stack=stackFor(stackPool);
assert.equal(new Set(familiar.map(p=>p.id)).size,familiar.length);
assert.equal(new Set(familiar.map(p=>p.lane)).size,5);
specs.push({id:'stack-up',name:'Stack Up',rounds:5,period:32,bankCount:stackPool.length,defaultBankCount:familiar.length,pool:stackPool,identity:p=>p.id,select:stack});
const lowText=read('games/lowball/engine/index.html'),literal=lowText.match(/const ITEMS = (\[[\s\S]*?\n\]);/);
assert(literal,'Keep extracting the real Lowball item source');
const items=vm.runInNewContext(literal[1]),start=lowText.indexOf('function mulberry32'),end=lowText.indexOf('let deck = []');
assert(start>=0&&end>start,'Keep extracting the real Lowball selector');
const low=vm.runInNewContext('const ITEMS='+JSON.stringify(items)+',ROUNDS_PER_DAY=4;let selectedDay=0;const dayNumber=()=>selectedDay;\n'+lowText.slice(start,end)+'\n(day)=>{selectedDay=Math.floor((Date.parse(day+"T00:00:00Z")-Date.UTC(2026,9,1))/86400000);return pickDailyItems();};');
assert.equal(new Set(items.map(p=>p.name)).size,items.length,'Lowball unique product identities');
for(const item of items)for(const region of ['AU','US','UK','CA'])assert(Number.isFinite(item.prices[region])&&item.prices[region]>0,item.name+' '+region);
specs.push({id:'lowball',name:'Lowball',rounds:4,period:32,bankCount:items.length,pool:items,identity:p=>p.name,select:low});
const clock=model('inner-clock');
specs.push({id:'inner-clock',name:'Time Sense',rounds:5,period:39,bankCount:195,identity:p=>p,select:day=>clock.daily(day)});
const sourceShelf=read('index.html').match(/<article\b[\s\S]*?<\/article>/g)||[];
const shelfIds=sourceShelf.map(card=>card.match(/href="games\/([^/]+)\/index\.html"/)?.[1]).filter(Boolean);
const order=['laser','time-drop','clue-ladder','seating-chart','shift-work','hidden-gem','stack-up','pack','lowball','inner-clock'];
assert.deepEqual(shelfIds,order,'The audit must cover the actual ten-game shelf');
assert.deepEqual(specs.map(s=>s.id).sort(),order.slice().sort());
const ymd=new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const part=k=>ymd.find(p=>p.type===k).value,today=part('year')+'-'+part('month')+'-'+part('day');
const starts=[...new Set(['2026-10-25',today,'2026-11-20','2027-03-21','2028-02-28'])];
const windows=[];
for(const first of starts){
 const days=dates(first,HORIZON),rows=[];
 for(const s of specs){
  const selected=days.map(day=>s.select(day)),keys=selected.map((rows,i)=>{
   assert.equal(rows.length,s.rounds,s.name+' incomplete '+days[i]);
   assert(rows.every(Boolean),s.name+' missing entry '+days[i]);
   const ids=Array.from(rows,s.identity);
   assert.equal(new Set(ids).size,s.rounds,s.name+' duplicate within '+days[i]);
   if(s.id==='stack-up')assert.deepEqual(Array.from(rows,p=>p.lane),[0,1,2,3,4]);
   if(s.id==='inner-clock')rows.forEach((v,lane)=>assert(Number.isInteger(v)&&v>=2000+2000*lane&&v<4000+2000*lane&&v%(days[i]<'2026-10-26'?100:50)===0));
   return ids.slice().sort();
  });
  assert.equal(new Set(keys.map(k=>JSON.stringify(k))).size,HORIZON,s.name+' repeats a complete Daily from '+first);
  const identities=selected.flatMap(rows=>Array.from(rows,s.identity)),fingerprints=selected.flatMap(rows=>Array.from(rows,p=>JSON.stringify(challenge(s.id,p))));
  {
   assert.equal(new Set(identities).size,identities.length,s.name+' repeats an individual question/board from '+first);
   assert.equal(new Set(fingerprints).size,fingerprints.length,s.name+' repeats a challenge under another ID from '+first);
  }
  for(const day of [days[0],days.at(-1)]){
   assert.deepEqual(JSON.parse(JSON.stringify(s.select(day))),JSON.parse(JSON.stringify(s.select(day))),s.name+' nondeterministic '+day);
  }
  const counts=new Map();identities.forEach(id=>counts.set(id,(counts.get(id)||0)+1));
  rows.push({id:s.id,name:s.name,roundsPerDaily:s.rounds,bankCount:s.bankCount,defaultBankCount:s.defaultBankCount??s.bankCount,distinctDailies:HORIZON,uniqueIngredients:counts.size,ingredientSlots:identities.length,maxUsesOfIngredient:Math.max(...counts.values()),noIngredientRepeats:true,note:s.note||null});
 }
 windows.push({start:first,end:days.at(-1),days:HORIZON,games:rows});
}
const periods=[];
for(const s of specs.filter(s=>s.period)){
 const ids=dates('2026-10-25',s.period).flatMap(d=>Array.from(s.select(d),s.identity));
 assert.equal(new Set(ids).size,ids.length,s.name+' advertised repeat-free period');
 periods.push({id:s.id,name:s.name,verifiedRepeatFreeDays:s.period,uniqueIngredients:ids.length});
}
fs.mkdirSync('.artifacts',{recursive:true});
const report={sourceCommit:process.env.ARCADE_DIFF_HEAD||null,timezone:'Australia/Sydney',checkedAt:new Date().toISOString(),requiredDays:31,checkedDaysPerWindow:HORIZON,scope:'Actual shipped date selectors; content availability/selection only, not fresh price verification or a new human quality rating.',windows,periods};
fs.writeFileSync('.artifacts/daily-content.json',JSON.stringify(report,null,2)+'\n');
for(const row of windows.find(w=>w.start==='2026-10-25').games)console.log('PASS '+row.name+': '+HORIZON+' distinct Dailies; '+row.uniqueIngredients+'/'+row.ingredientSlots+' distinct ingredients'+(row.noIngredientRepeats?' (no repeats).':' (ingredient reuse is expected).'));
console.log('PASS all ten active games: 31-day requirement plus one-day buffer, cycle-boundary/future/leap-day windows, deterministic selection. No player storage was read or written.');
