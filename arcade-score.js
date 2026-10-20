/* Break Room Arcade score v1: pure, deterministic and independent of game storage. */
(root=>{
 'use strict';
 const STACK_MAX=31000,WINDOW_DAYS=120;
 const clamp=value=>Number.isFinite(value)?Math.min(100,Math.max(0,value)):null;
 const mean=values=>values.length?values.reduce((sum,value)=>sum+value,0)/values.length:null;
 function stake(bets,picks,answers){
  if(!Array.isArray(bets)||!Array.isArray(picks)||!Array.isArray(answers)||!bets.length||bets.length!==picks.length||bets.length!==answers.length||!bets.every(n=>Number.isInteger(n)&&n>=1&&n<=3)||!picks.every(n=>Number.isInteger(n)&&n>=-1&&n<=2)||!answers.every(n=>Number.isInteger(n)&&n>=0&&n<=2))return null;
  const total=bets.reduce((a,b)=>a+b,0),won=bets.reduce((sum,bet,i)=>sum+(picks[i]===answers[i]?bet:0),0);
  return won/total*100;
 }
 function summary(records,today,ids=['lowball','stake','stack-up']){
  const from=new Date(Date.parse(today+'T00:00:00Z')-(WINDOW_DAYS-1)*86400000).toISOString().slice(0,10);
  const recent=records.filter(r=>r.date>=from&&r.date<=today&&Number.isFinite(r.arcadeScore)&&r.arcadeScore>=0&&r.arcadeScore<=100);
  const games=ids.map(id=>{
   const scores=recent.filter(r=>r.game===id).map(r=>r.arcadeScore);
   return{id,count:scores.length,average:mean(scores),best:scores.length?Math.max(...scores):null};
  });
  const available=games.filter(g=>g.count>0);
  return{version:1,windowDays:WINDOW_DAYS,from,to:today,games,average:mean(available.map(g=>g.average)),gamesPlayed:available.length,runs:available.reduce((sum,g)=>sum+g.count,0)};
 }
 function badge(value){
  const el=root.document.createElement('div');el.className='arcade-score';
  const label=root.document.createElement('span');label.className='arcade-score-label';label.textContent='ARCADE SCORE';
  const number=root.document.createElement('strong');number.textContent=format(value);
  const outOf=root.document.createElement('small');outOf.textContent=' / 100';number.appendChild(outOf);
  el.append(label,number);return el;
 }
 const format=value=>value===null||!Number.isFinite(value)?'—':new Intl.NumberFormat('en-AU',{maximumFractionDigits:1}).format(value);
 root.BREAK_ROOM_SCORE=Object.freeze({version:1,STACK_MAX,WINDOW_DAYS,lowball:clamp,stake,stackUp:points=>Number.isFinite(points)?clamp(points/STACK_MAX*100):null,summary,format,badge});
})(typeof window==='undefined'?globalThis:window);
