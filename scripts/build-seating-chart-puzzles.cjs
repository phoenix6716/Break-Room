/* Deterministic offline authoring. Production reads the frozen bank; no browser solver. */
function buildSeatingBank(start=0,end=360){
 const names='Ada Ben Cora Dev Eli Fern Gus Hana Ivy Jack Kai Lena Milo Nora Otis Pia Quinn Rosa Sam Tess Uma Vic Wren Xavi Yara Zane Alma Bram Cleo Dani Elsa Finn Gwen Hugo Iris Joss Kira Leo Mara Nico Olga Pete Ruth Seth Tara Ulla Vera Walt Yuri Zoe Abel Bea Carl Dora Egon Faye Gil Hope Ines Jem'.split(' ');
 function random(seed){let a=2166136261;for(const c of seed)a=Math.imul(a^c.charCodeAt(0),16777619);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const ok=(type,d,g)=>type==='A'?d===1:type==='N'?d!==1:type==='D'?d===2:d===g/2;
 const dist=(a,b,g)=>Math.min(Math.abs(a-b),g-Math.abs(a-b));
 function solve(g,rules){
  const positions=Array(g).fill(-1),seats=[0];positions[0]=0;let best=99,solution=null,visited=0;
  function visit(depth,bad){if(bad>=best)return;if(depth===g){best=bad;solution=seats.slice();return;}for(let v=1;v<g;v++)if(positions[v]===-1){positions[v]=depth;let extra=0;for(const rule of rules){if(rule.a!==v&&rule.b!==v)continue;const other=rule.a===v?rule.b:rule.a;if(positions[other]>=0&&!ok(rule.type,dist(depth,positions[other],g),g))extra++;}seats.push(v);visit(depth+1,bad+extra);seats.pop();positions[v]=-1;if(best===0)return;}}
  visit(1,0);return{best,solution};
 }
 const stories={A:['They share one dessert.','They promised to catch up over dinner.','They are rehearsing a toast together.','They are partners in the pub quiz.','They keep finishing each other’s sentences.','They brought a board game for two.'],N:['They still dispute the last slice of cake.','They argue about the thermostat.','They disagree about the playlist.','One never returned the other’s ladder.','Their last game of Scrabble ended badly.','They both claim the family recipe.'],D:['They want exactly one guest between them.','They agreed to leave one seat between them.','They need a little room: one guest between.'],O:['They want to exchange looks across the table.','They are sketching portraits of each other.','They want to face each other for the toast.']};
 const out=[];
 for(let index=start;index<end;index++){
  const tier=Math.floor(index/72)+1,number=index%72,g=tier+5,nr=[4,5,7,9,11][tier-1],types=tier===1?['A','N']:tier===2?['A','N','D']:g%2===0?['A','N','D','O']:['A','N','D'];
  const target=tier<4?0:tier===4?(number%3===0?0:1):number%3;
  let found=null;
  for(let trial=0;trial<2000&&!found;trial++){
   const r=random('seating-chart:v1:'+index+':'+trial),hidden=shuffle([...Array(g).keys()],r),pos=[];hidden.forEach((v,i)=>pos[v]=i);
   const pairs=shuffle(Array.from({length:g},(_,a)=>Array.from({length:g-a-1},(_,j)=>[a,a+j+1])).flat(),r),rules=[];
   for(const [a,b]of pairs){const fits=types.filter(t=>ok(t,dist(pos[a],pos[b],g),g));if(!fits.length)continue;const type=fits[Math.floor(r()*fits.length)];rules.push({type,a,b,story:stories[type][Math.floor(r()*stories[type].length)]});if(rules.length===nr)break;}
   if(rules.length!==nr||new Set(rules.flatMap(x=>[x.a,x.b])).size!==g||new Set(rules.map(x=>x.type)).size<(tier===1?2:tier===2?3:3))continue;
   if(target){for(let j=0;j<target+1;j++){const ri=Math.floor(r()*rules.length),x=rules[ri],falseTypes=types.filter(t=>!ok(t,dist(pos[x.a],pos[x.b],g),g));if(falseTypes.length){x.type=falseTypes[Math.floor(r()*falseTypes.length)];x.story=stories[x.type][Math.floor(r()*stories[x.type].length)];}}}
   const s=solve(g,rules);if(s.best!==target)continue;
   let randomTotal=0,optimal=0;for(let j=0;j<160;j++){const o=shuffle([...Array(g).keys()],r),ps=[];o.forEach((v,i)=>ps[v]=i);const c=rules.filter(x=>!ok(x.type,dist(ps[x.a],ps[x.b],g),g)).length;randomTotal+=c;if(c===s.best)optimal++;}
   if(randomTotal/160-s.best<[1.3,1.8,2.7,3,4][tier-1]||optimal> [45,25,12,8,4][tier-1])continue;
   found={id:'sc-'+tier+'-'+String(number+1).padStart(3,'0'),tier,g,names:shuffle(names,r).slice(0,g),rules:shuffle(rules,r),best:s.best,solution:s.solution};
  }
  if(!found)throw Error('Unable to generate '+index);
  let core=found.rules.map((_,i)=>i);if(found.best>0){for(const i of [...core]){const next=core.filter(j=>j!==i);if(solve(g,next.map(j=>found.rules[j])).best===found.best)core=next;}}else core=[];found.conflict=core;
  out.push(found);
 }
 return out;
}

if(require.main===module){const fs=require('node:fs'),path=require('node:path'),bank=buildSeatingBank();fs.writeFileSync(path.join(__dirname,'../content/seating-chart-puzzles.json'),JSON.stringify({version:1,tables:bank},null,2)+'\n');fs.writeFileSync(path.join(__dirname,'../games/seating-chart/puzzles.js'),'/* Frozen offline-generated Seating Chart v1 bank. */\nwindow.SEATING_CHART_PUZZLES = '+JSON.stringify(bank)+';\n');console.log('Built 360 Seating Chart tables: 72 five-table Daily sets.');}
module.exports={buildSeatingBank};
