/* Time Drop v1: frozen event snapshots, range-aware linear scoring and Sydney-date decks. */
(root=>{'use strict';
 const PREFIX='break-room:time-drop:daily:',VERSION=1,ROUNDS=10,MIN_YEAR=-4000,MAX_YEAR=2100;
 const int=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 const year=y=>int(y,MIN_YEAR,MAX_YEAR)&&y!==0;
 const date=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
 const text=(s,n)=>typeof s==='string'&&s.trim().length>0&&s.length<=n;
 const ordinal=y=>y<0?y:y-1;
 const span=(a,b)=>Math.abs(ordinal(a)-ordinal(b));
 const format=y=>y<0?Math.abs(y)+' BCE':y<1000?y+' CE':String(y);
 function event(e){return !!e&&text(e.id,100)&&/^[a-z0-9-]+$/.test(e.id)&&text(e.title,180)&&text(e.fact,1000)&&text(e.category,40)&&text(e.source,2000)&&/^https:\/\//.test(e.source)&&year(e.year)&&year(e.earliest)&&year(e.latest)&&e.earliest<=e.year&&e.year<=e.latest&&span(e.earliest,e.latest)<=200;}
 const distance=(e,g)=>g<e.earliest?span(g,e.earliest):g>e.latest?span(g,e.latest):0;
 const allowance=y=>y<0?500:y<1000?250:y<1700?150:y<1900?100:50;
 function result(e,g){if(!event(e)||!year(g))return null;const error=distance(e,g),points=Math.max(0,Math.round(1000*(1-error/allowance(e.year))));return{error,points,exact:error===0&&e.earliest===e.latest,band:error===0?(e.earliest===e.latest?'Bullseye':'In range'):points>=900?'Very close':points>=700?'Close':points>=400?'In the era':'Wide'};}
 function valid(r,day){return date(day)&&!!r&&r.version===VERSION&&r.scoreVersion===1&&r.day===day&&int(r.edits,0,1000000)&&Array.isArray(r.events)&&r.events.length===ROUNDS&&r.events.every(event)&&new Set(r.events.map(e=>e.id)).size===ROUNDS&&Array.isArray(r.picks)&&r.picks.length<=ROUNDS&&r.picks.every(year)&&int(r.round,0,ROUNDS-1)&&year(r.guess)&&['guess','review','summary'].includes(r.phase)&&(r.phase==='guess'?r.picks.length===r.round:r.picks.length===r.round+1&&r.guess===r.picks.at(-1)&&(r.phase!=='summary'||r.picks.length===ROUNDS));}
 function record(r,day){if(!valid(r,day)||r.picks.length!==ROUNDS)return null;const results=r.picks.map((g,i)=>result(r.events[i],g)),points=results.reduce((n,r)=>n+r.points,0);return{points,arcadeScore:points/100,exact:results.filter(r=>r.exact).length,results};}
 function random(seed){let a=2166136261;for(const c of seed)a=Math.imul(a^c.charCodeAt(0),16777619);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 const era=y=>y<1000?0:y<1700?1:y<1900?2:y<1950?3:y<1990?4:5;
 function deck(bank){
  if(bank.length<330||bank.length%ROUNDS||!bank.every(event)||new Set(bank.map(e=>e.id)).size!==bank.length)throw Error('Time Drop needs a complete, distinct event bank divisible by ten.');
  const days=bank.length/ROUNDS,buckets=Array.from({length:days},()=>[]),rnd=random('time-drop:balanced-deck:v1');
  for(let group=0;group<6;group++)for(const e of shuffle(bank.filter(e=>era(e.year)===group).sort((a,b)=>a.id.localeCompare(b.id)),rnd)){
   const candidates=shuffle(buckets.map((_,i)=>i),rnd).filter(i=>buckets[i].length<ROUNDS).sort((a,b)=>buckets[a].length-buckets[b].length||buckets[a].filter(x=>x.category===e.category).length-buckets[b].filter(x=>x.category===e.category).length);
   buckets[candidates[0]].push(e);
  }
  return buckets.map((b,i)=>shuffle(b,random('time-drop:day-order:v1:'+i)));
 }
 function daily(bank,day){if(!date(day))throw Error('Invalid Sydney date');const groups=deck(bank),n=Math.floor((Date.parse(day+'T00:00:00Z')-Date.UTC(2026,9,23))/86400000),index=((n%groups.length)+groups.length)%groups.length;return JSON.parse(JSON.stringify(groups[index]));}
 function create(bank,day){return{version:VERSION,scoreVersion:1,day,events:daily(bank,day),round:0,picks:[],guess:1900,phase:'guess',edits:0};}
 function guess(r,y){if(!valid(r,r.day)||r.phase!=='guess'||!year(y))return false;r.guess=y;r.edits++;return true;}
 function lock(r){if(!valid(r,r.day)||r.phase!=='guess')return false;r.picks.push(r.guess);r.phase='review';r.edits++;return true;}
 function next(r){if(!valid(r,r.day)||r.phase!=='review')return false;if(r.picks.length===ROUNDS)r.phase='summary';else{r.round++;r.phase='guess';r.guess=1900;}r.edits++;return true;}
 root.BREAK_ROOM_TIME_DROP=Object.freeze({PREFIX,VERSION,ROUNDS,MIN_YEAR,MAX_YEAR,year,date,event,span,format,distance,allowance,result,valid,record,random,shuffle,era,deck,daily,create,guess,lock,next});
})(typeof window==='undefined'?globalThis:window);
