const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const sandbox={Intl,Date,Map,Set};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('daily-clock.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('arcade-score.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('profile-records.js','utf8'),sandbox);
const api=sandbox.BREAK_ROOM_RECORDS;
const stack={prompt:'Order these',fact:'An explanation',ends:['First','Last'],cards:Array.from({length:5},(_,i)=>({name:'Item '+i,value:i+1}))};
function stackRun(day,score=31000){return{version:2,day,round:4,score,streak:5,results:Array.from({length:5},()=>({correct:true,points:score/5,mistakes:0})),order:[1,2,3,4,5],deadline:1,mistakes:0,status:'complete',stacks:Array(5).fill(stack)};}
const qs=Array.from({length:5},()=>({q:'Question',c:'Category',f:'Explanation',o:['A','B','C'],a:0}));
function store(values){const map=new Map(Object.entries(values).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]));return{get length(){return map.size},key(i){return [...map.keys()][i]},getItem(k){return map.get(k)??null},setItem(){throw Error('Must not write')},removeItem(){throw Error('Must not delete')}};}
const values={'pc_history':{'17':80,'18':100,'19':90},pc_played:'30',pc_last:'2026-10-20',pc_last_avg:'90',
 'stake:d:2026-10-20':{b:[3,3,3,3,3],p:[0,0,0,0,0],qs},
 'stake:d:2026-10-19':{b:[3,2,1,3,2],p:[-1,1,1,1,1],qs},
 'break-room:stack-up:daily:2026-10-20':stackRun('2026-10-20')};
let result=api.read(store(values),'2026-10-20');
assert.equal(result.total,33);assert.equal(result.records.length,6);assert.equal(result.games[0].average,90);assert.equal(result.games[0].best,100);assert.equal(result.games[0].played,30);assert.equal(result.games[1].best,15);assert.equal(result.games[1].average,2);assert.equal(result.games[2].best,31000);assert.equal(result.streak.current,3);assert.equal(result.achievements.filter(a=>a.earned).length,5);
assert.ok(result.games.filter(g=>!['codebreak','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder','seating-chart','hidden-gem','shift-work'].includes(g.id)).every(g=>g.today==='complete')&&result.games.filter(g=>['codebreak','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder','seating-chart','hidden-gem','shift-work'].includes(g.id)).every(g=>g.today==='ready'));
assert.equal(result.arcade.average,80);assert.equal(result.games[1].arcade.average,50);assert.equal(result.arcade.runs,6);assert.equal(result.arcade.gamesPlayed,3);
// Sparse/truncated Lowball history: preserve lifetime plays and recover its documented last score only once.
result=api.read(store({pc_history:{'18':0},pc_played:'200',pc_last:'2026-10-20',pc_last_avg:'0'}),'2026-10-20');
assert.equal(result.total,200);assert.equal(result.records.length,2);assert.equal(result.games[0].average,0);assert.equal(result.games[0].best,0);
// Invalid and future entries never stop the remaining games loading.
result=api.read(store({...values,pc_history:'{broken','stake:d:2026-10-18':'{broken','stake:d:2026-10-21':values['stake:d:2026-10-20'],'stake:d:2026-02-30':{},'break-room:stack-up:daily:2026-10-19':{status:'complete',score:900000},'insert-coin:attempt:2026-10-20:pixel-pairs':{score:84}}),'2026-10-20');
assert.ok(result.skipped>=4);assert.equal(result.games[1].played,2);assert.equal(result.games[2].played,1);assert.equal(result.records.some(r=>r.date>'2026-10-20'),false);
// Ignore real in-progress records, but expose Resume Daily without counting them.
const pending=stackRun('2026-10-20');Object.assign(pending,{round:0,status:'playing',results:[],score:0});
result=api.read(store({pc_progress:{day:'2026-10-20',idx:1,scores:[90]},'stake:d:2026-10-20':{b:[1],p:[],qs},'break-room:stack-up:daily:2026-10-20':pending}),'2026-10-20');
assert.equal(result.total,0);assert.ok(result.games.filter(g=>!['codebreak','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder','seating-chart','hidden-gem','shift-work'].includes(g.id)).every(g=>g.today==='progress')&&result.games.filter(g=>['codebreak','pack','prior','laser','alibi','bouncer','inner-clock','time-drop','clue-ladder','seating-chart','hidden-gem','shift-work'].includes(g.id)).every(g=>g.today==='ready'));assert.ok(result.achievements.every(a=>!a.earned));
// Negative results stay negative, even when every completed run lost points.
const negative={...values,'stake:d:2026-10-20':{b:[3,3,3,3,3],p:[-1,-1,-1,-1,-1],qs},'break-room:stack-up:daily:2026-10-20':stackRun('2026-10-20',-2000)};
result=api.read(store(negative),'2026-10-20');assert.equal(result.games[1].best,-11);assert.equal(result.games[2].best,-2000);
assert.equal(api.streaks(['2026-10-18','2026-10-19'],'2026-10-20').current,2);assert.equal(api.streaks(['2026-10-18'],'2026-10-20').current,0);
assert.equal(api.dateKey('2026-02-30'),null);assert.equal(api.dateKey('2026-2-3'),'2026-02-03');
const week={};for(let i=0;i<7;i++)week['break-room:stack-up:daily:2026-10-'+(14+i)]=stackRun('2026-10-'+(14+i));
result=api.read(store(week),'2026-10-20');assert.equal(result.streak.current,7);assert.ok(result.achievements.find(a=>a.id==='week').earned);
result=api.read({getItem(){throw Error('Denied')},get length(){throw Error('Denied')}},'2026-10-20');assert.equal(result.unavailable,true);assert.equal(result.total,0);
assert.equal(api.read(store({}),'2026-10-20').records.length,0);
console.log('PASS: real save formats, retained/lifetime Lowball stats, zero/negative scores, malformed/future/in-progress entries, current/best history streaks, provable achievements, unavailable storage and read-only access.');

const full=api.read(store(values),'2026-10-20'),unchanged=JSON.stringify(full),visible=api.active(full);
assert.equal(visible.games.length,10);assert.equal(visible.records.length,4);assert.equal(visible.total,31);
assert.equal(visible.arcade.average,95);assert.equal(visible.arcade.runs,4);assert.equal(visible.arcade.gamesPlayed,2);
assert(visible.games.every(g=>!['hidden-gem','stake','prior','alibi','bouncer'].includes(g.id)));
assert(visible.achievements.every(a=>!['hidden-gem','stake','prior','alibi','bouncer','sweep'].includes(a.id)));
assert.equal(visible.achievements.filter(a=>a.earned).length,7);assert.equal(JSON.stringify(full),unchanged);
const retiredWeek={};for(let i=0;i<7;i++)retiredWeek['stake:d:2026-10-'+(14+i)]={b:[3,3,3,3,3],p:[0,0,0,0,0],qs};
const oldOnly=api.read(store(retiredWeek),'2026-10-20'),hidden=api.active(oldOnly);
assert.equal(oldOnly.streak.best,7);assert.equal(hidden.streak.best,0);assert.equal(hidden.streak.current,0);
assert.equal(hidden.total,0);assert.equal(hidden.records.length,0);assert.equal(hidden.days.size,0);
assert.equal(hidden.arcade.average,null);assert.equal(hidden.arcade.runs,0);assert(hidden.achievements.every(a=>!a.earned));
console.log('PASS current-game profile view: retired history excluded from totals, averages, activity, streaks and earned badges; private native data remains intact.');

module.exports={stackRun,qs};

assert.equal(visible.achievements.length,32);assert.equal(new Set(visible.achievements.map(a=>a.id)).size,32);
// Cross-game milestones use only public Daily completions, never retired results.
const activeIds=visible.games.map(g=>g.id),base=api.read(store({}),'2026-10-20');
function milestones(records){return api.active({...base,records,games:base.games.map(g=>({...g,played:records.filter(r=>r.game===g.id).length}))}).achievements;}
const earned=(rows,id)=>milestones(rows).find(a=>a.id===id).earned;
const rows=activeIds.map(game=>({game,date:'2026-10-20',score:0,arcadeScore:0,perfect:false}));
assert(!earned(rows.slice(0,2),'three-games'));assert(earned(rows.slice(0,3),'three-games'));assert(!earned(rows.slice(0,4),'five-games'));assert(earned(rows.slice(0,5),'five-games'));assert(!earned(rows.slice(0,9),'full-house'));assert(earned(rows,'full-house'));assert(earned(rows,'explorer'));assert(earned(rows,'ten-runs'));
const dates=Array.from({length:100},(_,i)=>({game:'stack-up',date:new Date(Date.UTC(2026,6,1+i)).toISOString().slice(0,10),score:100,arcadeScore:100,perfect:i<5}));
assert(!earned(dates.slice(0,49),'fifty-runs'));assert(earned(dates.slice(0,50),'fifty-runs'));assert(!earned(dates.slice(0,99),'hundred-runs'));assert(earned(dates,'hundred-runs'));assert(!earned(dates.slice(0,2),'three-days'));assert(earned(dates.slice(0,3),'three-days'));assert(!earned(dates.slice(0,29),'thirty-days'));assert(earned(dates.slice(0,30),'thirty-days'));assert(!earned(dates.slice(0,4),'five-perfect'));assert(earned(dates.slice(0,5),'five-perfect'));assert(milestones(rows.map(r=>({...r,game:'stake'}))).every(a=>!a.earned));
console.log('PASS 32 achievements: participation, exact play/streak/perfect thresholds and retired-game exclusion.');

assert(!earned(dates.slice(0,5).map(r=>({...r,arcadeScore:80,perfect:true})),'five-perfect'));assert(earned(dates.slice(0,5).map(r=>({...r,perfect:false})),'five-perfect'),'Five-star break uses actual 100/100 scores, not game-specific badge rules');
