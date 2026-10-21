/* Scenario v2. Generate and independently check visit reconstructions, not reskinned v1 claims. */
const fs=require('fs');require('../alibi-model.js');const M=globalThis.BREAK_ROOM_ALIBI;
const themes=[
 {crime:'The last slice.',item:'CAKE',place:'the break room',visit:'break-room visit',detail:'The last slice of birthday cake was still in its box at {a}. By {b}, only a suspiciously clean fork remained. The cake was taken during one of the logged visits.',title:'Door camera'},
 {crime:'The borrowed stapler.',item:'STAPLER',place:'the stationery cupboard',visit:'cupboard visit',detail:'The good stapler was on its shelf at {a}. The stock check at {b} found its outline in the dust, but no stapler. One visitor took it.',title:'Cupboard log'},
 {crime:'The playlist incident.',item:'PLAYLIST',place:'the music terminal',visit:'terminal session',detail:'The office playlist was normal at {a}. By {b}, someone had replaced it with elevator music. The change happened during one of the recorded sessions.',title:'Terminal audit'},
 {crime:'The paper goblin.',item:'PRINTER',place:'the printer station',visit:'printer-station visit',detail:'The printer had its normal label at {a}. At {b}, it was called “Paper Goblin”. One visitor applied the new label.',title:'Printer camera'},
 {crime:'The vanished raffle jar.',item:'RAFFLE JAR',place:'the reception counter',visit:'reception visit',detail:'The office raffle jar was photographed on the counter at {a}. It was gone by {b}. One visitor moved it, and nobody outside this group used the counter.',title:'Reception camera'},
 {crime:'A very mobile plant.',item:'PLANT',place:'the window desk',visit:'window-desk visit',detail:'The office plant was by the window at {a}. By {b}, it had been moved into a cardboard box. Someone thought they were helping.',title:'Desk camera'},
 {crime:'The fridge manifesto.',item:'FRIDGE NOTE',place:'the kitchen noticeboard',visit:'noticeboard visit',detail:'The fridge rules were ordinary at {a}. At {b}, an extra rule read “All cheese must be labelled by mood”. One visitor wrote it.',title:'Kitchen camera'},
 {crime:'A meeting called Fun.',item:'CALENDAR',place:'the shared booking terminal',visit:'booking-terminal session',detail:'The team meeting had its usual name at {a}. By {b}, it had become “Mandatory Fun”. One recorded user changed it.',title:'Booking audit'},
 {crime:'The emergency biscuits.',item:'BISCUIT TIN',place:'the snack cupboard',visit:'snack-cupboard visit',detail:'The emergency biscuit tin was sealed at {a}. At {b}, the seal was broken and the chocolate ones were missing. One visitor opened it.',title:'Cupboard camera'},
 {crime:'The missing remote.',item:'REMOTE',place:'the meeting-room cabinet',visit:'cabinet visit',detail:'The air-conditioning remote was in its tray at {a}. By {b}, someone had tucked it into a stationery box. One of the visitors moved it.',title:'Cabinet log'},
 {crime:'The mystery mug.',item:'MUG',place:'the coffee station',visit:'coffee-station visit',detail:'The mug shelf was normal at {a}. By {b}, it held a new mug saying “World’s Okayest Colleague”. One visitor left it there.',title:'Coffee-station camera'},
 {crime:'The tea switch.',item:'TEA TINS',place:'the tea station',visit:'tea-station visit',detail:'The two tea tins had the right labels at {a}. By {b}, their labels had been swapped. One visitor made the change.',title:'Tea-station camera'}
];
const people=[['Ben',0],['Dev',1],['Hari',2],['Owen',3],['Ava',4],['Cleo',5],['Gia',6],['Frankie',7]];
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function candidates(p,types){const list=[];for(let a=0;a<p.n;a++)for(let b=0;b<p.n;b++)for(const type of types){if(['at','notat'].includes(type))list.push([type,a,b,0]);else if(a!==b){if(type==='gap'){for(let x=0;x<p.n;x++)for(let y=0;y<x;y++)list.push([type,a,b,p.times[x]-p.times[y]]);}else list.push([type,a,b,0]);}}return [...new Map(list.map(s=>[s.join(),s])).values()];}
function clueMetrics(p){const rows=M.reconstruct(p,{accounts:false,evidence:[]}).map(w=>({culprit:w.culprit,ok:[...p.evidence.map(e=>M.claim(p,e.rule,w.order)),...w.truth.map((t,i)=>t!==(i===w.culprit))]}));let keep=Array.from({length:p.evidence.length+p.n},(_,i)=>i);for(const i of [...keep]){const trial=keep.filter(j=>j!==i),possible=new Set(rows.filter(w=>trial.every(j=>w.ok[j])).map(w=>w.culprit));if(possible.size===1)keep=trial;}return keep.length;}
const output=[],seen=new Set(),counts=[24,24,24,24];
for(let level=0;level<4;level++){
 const r=M.random('alibi:scenario:curation:v2:'+level),n=M.SIZES[level];let found=0;
 for(let attempt=0;attempt<500000&&found<counts[level];attempt++){
  const times=[660+Math.floor(r()*180)];while(times.length<n)times.push(times.at(-1)+5+Math.floor(r()*8));const slot=Math.floor(r()*n),order=shuffle(Array.from({length:n},(_,i)=>i),r),culprit=order[slot],types=[['at','notat'],['at','notat','before','after'],['at','notat','before','after','next','gap'],['before','after','next','gap','notat']][level],p={version:2,id:`alibi-v2-${level}-${found+1}`,level,n,times,window:[times[slot]-2,times[slot]+2],s:[],evidence:[]};
  const pool=candidates(p,types);for(let i=0;i<n;i++){const options=pool.filter(s=>s[1]===i&&M.claim(p,s,order)===(i!==culprit));p.s.push(options[Math.floor(r()*options.length)]);}
  if(p.s.filter(s=>!['at','notat'].includes(s[0])).length<[0,2,3,4][level])continue;
  const ep=candidates(p,level<2?['at','before']:['at','before','next','gap']).filter(s=>M.claim(p,s,order)&&!(s[0]==='at'&&s[2]===slot));shuffle(ep,r);
  // Add only evidence which changes the remaining possibilities.
  for(const rule of ep){const prior=M.reconstruct(p).length;p.evidence.push({rule,title:'Record',detail:'Verified visit record.'});const next=M.reconstruct(p);if(next.length===prior){p.evidence.pop();continue;}if(next.length===1||p.evidence.length===3)break;}
  if(M.reconstruct(p).length!==1)continue;
  for(let i=p.evidence.length-1;i>=0;i--){const trial=p.evidence.filter((_,j)=>j!==i);if(M.reconstruct(p,{evidence:trial}).length===1)p.evidence=trial;}
  if(p.evidence.length<[1,1,2,2][level]||new Set(M.reconstruct(p,{evidence:[]}).map(w=>w.culprit)).size<2||new Set(M.reconstruct(p,{accounts:false}).map(w=>w.culprit)).size<2||clueMetrics(p)<[3,3,4,5][level])continue;
  const sig=M.signature(p);if(seen.has(sig))continue;seen.add(sig);
  let cast=shuffle([...people],r).slice(0,n);if(cast.filter(x=>x[1]<4).length<2||cast.filter(x=>x[1]>=4).length<2){cast=shuffle([...shuffle(people.slice(0,4),r).slice(0,2),...shuffle(people.slice(4),r).slice(0,n-2)],r);}
  const theme=themes[(found+level*3)%themes.length];Object.assign(p,{names:cast.map(x=>x[0]),portraits:(()=>{const male=shuffle([0,1,2,3],r),female=shuffle([4,5,6,7],r);return cast.map(x=>(x[1]<4?male:female).pop());})(),crime:theme.crime,item:theme.item,place:theme.place,visit:theme.visit,detail:theme.detail.replace('{a}',M.clock(p.window[0])).replace('{b}',M.clock(p.window[1]))});
  p.evidence.forEach((e,i)=>{e.title=e.rule[0]==='at'?theme.title+' timestamp':e.rule[0]==='gap'?theme.title+' timecodes':e.rule[0]==='next'?theme.title+' sequence':'Verified witness sighting';e.detail=M.account(p,e.rule,false);});
  if(!M.puzzle(p))throw Error('Invalid scenario');output.push(p);found++;
 }
 if(found!==counts[level])throw Error('Insufficient '+M.LEVELS[level]+' scenarios: '+found);
 console.log(M.LEVELS[level]+': '+found+' unique evidence-dependent scenarios');
}
fs.writeFileSync('games/alibi/cases.js','/* Scenario v2: reconstruct visits from verified evidence. Rebuild scripts/build-alibi-cases.cjs. */\nwindow.ALIBI_CASES='+JSON.stringify(output)+';\n');
