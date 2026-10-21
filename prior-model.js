/* Prior v1: snapshot-only chronology, deterministic pair selection and read-only scoring. */
(root=>{'use strict';
 const PREFIX='break-room:prior:daily:',levels=['easy','medium','medium','hard','hard'];
 function date(day){return typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day+'T00:00:00Z'))&&new Date(day+'T00:00:00Z').toISOString().slice(0,10)===day;}
 function event(e){return !!e&&typeof e.id==='string'&&[...e.id].length>0&&[...e.id].length<=80&&typeof e.title==='string'&&[...e.title].length>0&&[...e.title].length<=180&&Number.isInteger(e.year)&&e.year>=1&&e.year<=2100&&typeof e.category==='string'&&[...e.category].length>0&&[...e.category].length<=40&&typeof e.fact==='string'&&[...e.fact].length>0&&[...e.fact].length<=800&&typeof e.source==='string'&&e.source.length<=1000&&/^[!-~]+$/.test(e.source)&&/^https:\/\/[^\s/]+\/[^\s]*$/.test(e.source);}
 function pair(p){return Array.isArray(p)&&p.length===2&&p.every(event)&&p[0].id!==p[1].id&&p[0].title!==p[1].title&&p[0].year!==p[1].year;}
 const answer=p=>p[0].year<p[1].year?0:1;
 const gap=p=>Math.abs(p[0].year-p[1].year),level=p=>gap(p)>=60?'easy':gap(p)>=12?'medium':'hard';
 function valid(r,day){return date(day)&&!!r&&r.version===1&&r.day===day&&Array.isArray(r.pairs)&&r.pairs.length===5&&r.pairs.every(pair)&&new Set(r.pairs.flat().map(e=>e.id)).size===10&&Array.isArray(r.picks)&&r.picks.length<=5&&r.picks.every(p=>p===0||p===1)&&Number.isInteger(r.round)&&r.round>=0&&r.round<5&&['play','review','summary'].includes(r.phase)&&(r.phase==='play'?r.picks.length===r.round:r.picks.length===r.round+1&&(r.phase!=='summary'||r.picks.length===5));}
 function record(r,day){if(!valid(r,day)||r.picks.length!==5)return null;const correct=r.pairs.reduce((n,p,i)=>n+(r.picks[i]===answer(p)?1:0),0);return{correct,points:correct,arcadeScore:correct*20};}
 function random(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h+=0x6D2B79F5;let t=Math.imul(h^h>>>15,1|h);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
 function candidates(bank,tier,used=new Set()){const pairs=[];for(let i=0;i<bank.length;i++)for(let j=i+1;j<bank.length;j++){const a=bank[i],b=bank[j],p=[a,b];if(used.has(a.id)||used.has(b.id)||a.year===b.year||(a.family&&a.family===b.family)||gap(p)>600||level(p)!==tier)continue;pairs.push(p);}return pairs;}
 function pick(bank,tier,r,used){const options=candidates(bank,tier,used);if(!options.length)throw Error('Prior needs more distinct '+tier+' pairs.');const p=options[Math.floor(r()*options.length)];return r()<.5?p:p.slice().reverse();}
 let monthBank=null,monthDeck=null;
 function launchPairs(bank,day){
  if(monthBank!==bank){const sorted=bank.slice().sort((a,b)=>a.id.localeCompare(b.id)),rnd=random('prior:rotation:v2'),usedPairs=new Set(daily(bank,'2026-10-22').map(p=>p.map(e=>e.id).sort().join('|'))),pools=Object.fromEntries(['easy','medium','hard'].map(t=>[t,candidates(sorted,t).filter(p=>t!=='hard'||gap(p)<=3)]));
   for(const pool of Object.values(pools))for(let i=pool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
   monthDeck=Array.from({length:32},()=>{const used=new Set();return levels.map(t=>{const p=pools[t].find(p=>!used.has(p[0].id)&&!used.has(p[1].id)&&!usedPairs.has(p.map(e=>e.id).sort().join('|')));if(!p)throw Error('Prior needs more fresh '+t+' pairs');p.forEach(e=>used.add(e.id));usedPairs.add(p.map(e=>e.id).sort().join('|'));return p;});});monthBank=bank;
  }
  const ordinal=Math.floor(Date.parse(day+'T00:00:00Z')/86400000),rnd=random('prior:sides:v2:'+day);return monthDeck[ordinal%32].map(p=>rnd()<.5?p:p.slice().reverse());
 }
 function daily(bank,day){if(day>='2026-10-23')return launchPairs(bank,day);const r=random('prior:v1:'+day),used=new Set();return levels.map(tier=>{const p=pick(bank,tier,r,used);p.forEach(e=>used.add(e.id));return p;});}
 root.BREAK_ROOM_PRIOR=Object.freeze({PREFIX,levels,date,event,pair,answer,gap,level,valid,record,random,candidates,daily,pick});
})(typeof window==='undefined'?globalThis:window);
