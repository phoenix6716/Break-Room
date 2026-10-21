/* Bouncer v1: finite spelling rules, immutable submissions, snapshot-only scores. */
(root=>{'use strict';
 const PREFIX='break-room:bouncer:daily:',LEVELS=['Warm-up','Standard','Tricky','Expert'];
 const int=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b,word=w=>typeof w==='string'&&/^[a-z]{3,12}$/.test(w);
 const date=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
 function rule(r,depth=0){if(!Array.isArray(r)||r.length!==2)return false;const[k,a]=r;
  if(['and','or','xor'].includes(k))return depth===0&&Array.isArray(a)&&a.length===2&&a.every(x=>rule(x,1))&&JSON.stringify(a[0])!==JSON.stringify(a[1]);
  if(['length','vowels'].includes(k))return int(a,k==='length'?3:0,k==='length'?12:6);
  if(['contains','prefix','suffix'].includes(k))return typeof a==='string'&&/^[a-z]{1,3}$/.test(a);
  return ['double','unique','palindrome','sameEnds','vowelPair','startsVowel','endsVowel','forward','backward','firstBeforeLast','rare'].includes(k)&&a===0;
 }
 function test(r,w){const[k,a]=r,vs=(w.match(/[aeiou]/g)||[]).length;
  switch(k){case'and':return a.every(x=>test(x,w));case'or':return a.some(x=>test(x,w));case'xor':return test(a[0],w)!==test(a[1],w);case'length':return w.length===a;case'vowels':return vs===a;case'contains':return w.includes(a);case'prefix':return w.startsWith(a);case'suffix':return w.endsWith(a);case'double':return /(.)\1/.test(w);case'unique':return new Set(w).size===w.length;case'palindrome':return w===[...w].reverse().join('');case'sameEnds':return w[0]===w.at(-1);case'vowelPair':return /[aeiou]{2}/.test(w);case'startsVowel':return /^[aeiou]/.test(w);case'endsVowel':return /[aeiou]$/.test(w);case'forward':return [...w].every((c,i)=>!i||w[i-1]<=c);case'backward':return [...w].every((c,i)=>!i||w[i-1]>=c);case'firstBeforeLast':return w[0]<w.at(-1);case'rare':return /[jqxz]/.test(w);default:throw Error('Unknown spelling rule');}
 }
 function say(r){const[k,a]=r;if(['and','or','xor'].includes(k))return `(${say(a[0])}) ${k==='and'?'AND':k==='or'?'OR (or both)':'OR, but not both'} (${say(a[1])})`;
  return k==='length'?`exactly ${a} letters`:k==='vowels'?`exactly ${a} vowel letters`:k==='contains'?`contains ${a.toUpperCase()}`:k==='prefix'?`starts with ${a.toUpperCase()}`:k==='suffix'?`ends with ${a.toUpperCase()}`:({double:'has adjacent double letters',unique:'has no repeated letters',palindrome:'reads the same forwards and backwards',sameEnds:'starts and ends with the same letter',vowelPair:'has two vowel letters side by side',startsVowel:'starts with a vowel letter',endsVowel:'ends with a vowel letter',forward:'letters run in alphabetical order (repeats allowed)',backward:'letters run in reverse alphabetical order (repeats allowed)',firstBeforeLast:'first letter comes before its last in the alphabet',rare:'contains J, Q, X or Z'})[k];
 }
 function puzzle(p){return !!p&&typeof p.id==='string'&&/^bouncer-v1-[0-3]-[0-9]+$/.test(p.id)&&p.id.length<=80&&int(p.level,0,3)&&p.id.split('-')[2]===String(p.level)&&rule(p.rule)&&Array.isArray(p.ins)&&p.ins.length===2&&p.ins.every(w=>word(w)&&test(p.rule,w))&&Array.isArray(p.outs)&&p.outs.length===2&&p.outs.every(w=>word(w)&&!test(p.rule,w))&&Array.isArray(p.words)&&p.words.length===8&&p.words.every(word)&&new Set([...p.ins,...p.outs,...p.words]).size===12&&p.words.filter(w=>test(p.rule,w)).length>=3&&p.words.filter(w=>!test(p.rule,w)).length>=3;}
 const empty=()=>Array(8).fill(null);
 function valid(r,day){
  if(!date(day)||!r||r.version!==1||r.day!==day||!int(r.edits,0,1000000)||!Array.isArray(r.doors)||r.doors.length!==2||!r.doors.every(puzzle)||r.doors[0].id===r.doors[1].id||!int(r.round,0,1)||!['test','sort','review','summary'].includes(r.phase)||!Array.isArray(r.picks)||r.picks.length>2||!r.picks.every(a=>Array.isArray(a)&&a.length===8&&a.every(v=>typeof v==='boolean'))||!Array.isArray(r.probes)||r.probes.length!==2||!r.probes.every((ps,i)=>Array.isArray(ps)&&ps.length<=4&&ps.every(v=>int(v,0,7))&&new Set(ps).size===ps.length&&(i<=r.round||!ps.length))||!Array.isArray(r.answers)||r.answers.length!==8||!r.answers.every(v=>v===null||typeof v==='boolean'))return false;
  const playing=['test','sort'].includes(r.phase);
  if(playing?r.picks.length!==r.round:r.picks.length!==r.round+1||r.phase==='summary'&&r.picks.length!==2)return false;
  for(let i=0;i<r.picks.length;i++)if(!r.probes[i].every(j=>r.picks[i][j]===test(r.doors[i].rule,r.doors[i].words[j])))return false;
  if(!r.probes[r.round].every(j=>r.answers[j]===test(r.doors[r.round].rule,r.doors[r.round].words[j])))return false;
  if(r.phase==='test'&&r.answers.some((v,j)=>!r.probes[r.round].includes(j)&&v!==null))return false;
  return playing||JSON.stringify(r.answers)===JSON.stringify(r.picks.at(-1));
 }
 function doorScore(p,picks,probes){const correct=picks.reduce((n,v,i)=>n+Number(v===test(p.rule,p.words[i])),0);return{correct,tests:probes.length,credit:correct-probes.length/2};}
 function record(r,day){if(!valid(r,day)||r.picks.length!==2)return null;const scores=r.doors.map((p,i)=>doorScore(p,r.picks[i],r.probes[i])),correct=scores.reduce((n,s)=>n+s.correct,0),tests=scores.reduce((n,s)=>n+s.tests,0);return{correct,tests,points:correct,arcadeScore:(correct-tests/2)/16*100};}
 function random(seed){let a=2166136261;for(const c of seed)a=Math.imul(a^c.charCodeAt(0),16777619);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 function rotation(pool,day,seed,count=1){const rnd=random(seed),deck=pool.slice().sort((a,b)=>a.id.localeCompare(b.id));for(let i=deck.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}const start=Math.floor(Date.parse(day+'T00:00:00Z')/86400000)*count;return Array.from({length:count},(_,i)=>deck[(start+i)%deck.length]);}
 function daily(bank,day){if(day>='2026-10-23'){const held=new Set(daily(bank,'2026-10-22').map(p=>p.id));return [1,3].map(level=>rotation(bank.filter(p=>!held.has(p.id)&&p.level===level&&(level!==3||Number(p.id.split('-').at(-1))>60)),day,'bouncer:rotation:v2:'+level)[0]);}const rnd=random('bouncer:daily:v1:'+day);return [1,2].map(level=>{const pool=bank.filter(p=>p.level===level).slice().sort((a,b)=>a.id.localeCompare(b.id));return pool[Math.floor(rnd()*pool.length)];});}
 root.BREAK_ROOM_BOUNCER=Object.freeze({PREFIX,LEVELS,date,rule,test,say,puzzle,empty,valid,doorScore,record,random,daily});
})(typeof window==='undefined'?globalThis:window);
