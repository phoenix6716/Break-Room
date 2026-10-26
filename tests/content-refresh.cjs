/* Player-feedback bank refresh: preserve calendar slots and frozen saves. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),copy=x=>JSON.parse(JSON.stringify(x));
const changes=read('design/content-reviews/2026-10-26.json');
function model(id,key){const ctx={};vm.runInNewContext(fs.readFileSync(id+'-model.js','utf8'),ctx);return ctx[key];}
const specs=[
 ['hidden-gem','questions','BREAK_ROOM_HIDDEN_GEM',32,'HIDDEN_GEM_QUESTIONS','questions'],
 ['clue-ladder','puzzles','BREAK_ROOM_CLUE_LADDER',60,'CLUE_LADDER_PUZZLES','puzzles'],
 ['time-drop','events','BREAK_ROOM_TIME_DROP',66,'TIME_DROP_EVENTS','events']
];
const date=i=>new Date(Date.UTC(2026,9,26+i)).toISOString().slice(0,10);
for(const [id,key,global,period,bankGlobal,file]of specs){
 const M=model(id,global),old=read('content/archive/2026-10-25/'+id+'-'+key+'.json')[key],bank=read('content/'+id+'-'+key+'.json')[key],ctx={window:{}};
 vm.runInNewContext(fs.readFileSync('games/'+id+'/'+file+'.js','utf8'),ctx);assert.deepEqual(copy(ctx.window[bankGlobal]),bank,'Generated '+id+' bank');
 assert.deepEqual(bank.map(p=>p.id),old.map(p=>p.id),'Frozen calendar slots '+id);
 const changed=bank.filter((p,i)=>JSON.stringify(p)!==JSON.stringify(old[i]));
 assert.deepEqual(changed.map(p=>p.id).sort(),changes.games[id].changes.map(p=>p.id).sort(),'Every edit is recorded '+id);
 const schedule=new Map();for(let i=-31;i<period+32;i++){const before=copy(M.daily(old,date(i))),after=copy(M.daily(bank,date(i)));schedule.set(i,{before,after});assert.deepEqual(after.map(p=>p.id),before.map(p=>p.id),'Same date slots '+id+' '+date(i));}
 // Each possible old/new release boundary must remain unique within a rolling month.
 const identity=p=>id==='hidden-gem'?p.prompt:id==='clue-ladder'?M.norm(p.answer):p.title;
 for(let start=-31;start<period;start++){const rows=Array.from({length:32},(_,j)=>{const i=start+j;return schedule.get(i)[i<0?'before':'after'];}).flat();assert.equal(new Set(rows.map(p=>p.id)).size,rows.length,id+' repeated slot');assert.equal(new Set(rows.map(identity)).size,rows.length,id+' repeated content');}
 // Finish an old frozen Daily using its own captured answers, after loading current code.
 const day='2026-10-25',run=M.create(old,day),frozen=JSON.stringify(run[key]);
 if(id==='hidden-gem'){M.begin(run,1000);for(let i=0;i<5;i++){M.draft(run,run.questions[i].answers[0].name,1001+i);assert(M.finish(run,1001+i));if(i<4)M.next(run,1002+i);}assert(M.record(run,day));}
 else if(id==='clue-ladder'){for(let i=0;i<5;i++){assert(M.submit(run,run.puzzles[i].answer));if(i<4)M.next(run);}assert.equal(M.record(run,day).points,5000);}
 else{for(let i=0;i<5;i++){assert(M.guess(run,run.events[i].year));assert(M.lock(run));if(i<4)M.next(run);}assert.equal(M.record(run,day).points,5000);for(let i=0;i<bank.length;i++){assert.equal(M.era(bank[i].year),M.era(old[i].year));assert.equal(bank[i].category,old[i].category);}}
 assert.equal(JSON.stringify(run[key]),frozen,'Old snapshots are unchanged '+id);
 console.log('PASS '+id+': revised bank matches source, calendar slots unchanged, mixed-release month has no repeats, old frozen Daily still completes.');
}
const HG=read('content/hidden-gem-questions.json').questions,CL=read('content/clue-ladder-puzzles.json').puzzles,TD=read('content/time-drop-events.json').events;
const by=(bank,id)=>bank.find(p=>p.id===id);
assert(by(HG,'hg-princesses').answers.some(a=>a.name==='Nostalgia'));
assert(by(HG,'pixar-2010').answers.some(a=>a.name==='Inside Out 2'));
assert(by(HG,'pixar-2010').answers.some(a=>a.name==='Elio'));
assert(by(HG,'hg-hitchhiker').answers.some(a=>a.name==='Sunrise on the Reaping'));
assert(by(HG,'hg-railroads').answers.some(a=>a.name==='Sprigatito'));
assert(CL.some(p=>p.answer==='Bluey')&&CL.some(p=>p.answer==='TikTok')&&CL.some(p=>p.answer==='Minecraft'));
assert(by(TD,'td-005').title.includes('Cleopatra'));assert(by(TD,'td-015').title.includes('Rosetta'));
assert(TD.some(p=>p.year<0&&p.earliest!==p.latest),'Keep honest ancient date ranges');
console.log('PASS familiar/recent content examples; historical breadth and scoring remain available.');
