/* Inner Clock v1: millisecond snapshots, signed misses and target-relative accuracy. */
(root=>{'use strict';
 const PREFIX='break-room:inner-clock:daily:',LIMIT=30000;
 const int=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 const date=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
 const target=t=>int(t,2000,12000)&&t%50===0;
 function attempt(a){return !!a&&int(a.elapsed,0,LIMIT)&&['stop','timeout'].includes(a.kind)&&(a.kind!=='timeout'||a.elapsed===LIMIT);}
 const accuracy=(t,a)=>a.kind==='timeout'?0:Math.max(0,100*(1-Math.abs(a.elapsed-t)/(t*.25)));
 const band=(t,a)=>a.kind==='timeout'?'TIMEOUT':Math.abs(a.elapsed-t)/t<=.02?'IN SYNC':Math.abs(a.elapsed-t)/t<=.05?'CLOSE':Math.abs(a.elapsed-t)/t<=.125?'DRIFTING':'WIDE';
 function valid(r,day){return date(day)&&!!r&&r.version===1&&r.day===day&&int(r.edits,0,1000000)&&Array.isArray(r.targets)&&r.targets.length===5&&r.targets.every(target)&&new Set(r.targets).size===5&&Array.isArray(r.picks)&&r.picks.length<=5&&r.picks.every(attempt)&&int(r.round,0,4)&&['ready','running','review','summary'].includes(r.phase)&&(['ready','running'].includes(r.phase)?r.picks.length===r.round:r.picks.length===r.round+1&&(r.phase!=='summary'||r.picks.length===5))&&(r.phase==='running'?int(r.startedAt,1,8640000000000000):r.startedAt===null);}
 function record(r,day){if(!valid(r,day)||r.picks.length!==5)return null;const avgMissMs=r.picks.reduce((n,a,i)=>n+Math.abs(a.elapsed-r.targets[i]),0)/5,arcadeScore=r.picks.reduce((n,a,i)=>n+accuracy(r.targets[i],a),0)/5;return{avgMissMs,points:avgMissMs/1000,arcadeScore,inSync:r.picks.filter((a,i)=>band(r.targets[i],a)==='IN SYNC').length};}
 function random(seed){let a=2166136261;for(const c of seed)a=Math.imul(a^c.charCodeAt(0),16777619);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 function legacyDaily(day){const rnd=random('inner-clock:daily:v1:'+day);return Array.from({length:5},(_,i)=>(20+20*i+(rnd()*20|0))*100);}
 const DAILY_CUTOVER='2026-10-26',DAILY_PERIOD=39;
 // Freeze the launch-day targets, then rotate all other 50ms slots without replacement.
 const heldTargets=legacyDaily('2026-10-25'),dailyDecks=Array.from({length:5},(_,lane)=>{
  const values=Array.from({length:40},(_,slot)=>2000+lane*2000+slot*50).filter(t=>t!==heldTargets[lane]),rnd=random('inner-clock:daily:v2:'+lane);
  for(let i=values.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[values[i],values[j]]=[values[j],values[i]];}return values;
 });
 function daily(day){if(day<DAILY_CUTOVER)return legacyDaily(day);const ordinal=Math.floor((Date.parse(day+'T00:00:00Z')-Date.UTC(2026,9,26))/86400000),index=((ordinal%DAILY_PERIOD)+DAILY_PERIOD)%DAILY_PERIOD;return dailyDecks.map(deck=>deck[index]);}
 root.BREAK_ROOM_INNER_CLOCK=Object.freeze({PREFIX,LIMIT,DAILY_CUTOVER,DAILY_PERIOD,date,target,attempt,accuracy,band,valid,record,random,daily});
})(typeof window==='undefined'?globalThis:window);
