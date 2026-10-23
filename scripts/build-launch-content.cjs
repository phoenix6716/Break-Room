/* Deterministic launch additions. Existing IDs/snapshots are never regenerated. */
const fs=require('node:fs'),vm=require('node:vm');
const game=process.argv[2];
function bank(name,file,key){const box={window:{}};vm.runInNewContext(fs.readFileSync('games/'+name+'/'+file+'.js','utf8'),box);return{box,rows:JSON.parse(JSON.stringify(box.window[key]))};}
function save(name,file,key,rows,extra=''){fs.writeFileSync('games/'+name+'/'+file+'.js','/* Rebuild with node scripts/build-launch-content.cjs '+name+'. Original IDs are frozen. */\n'+extra+'window.'+key+'='+JSON.stringify(rows)+';\n');}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
if(game==='pack'){
 require('../pack-model.js');const M=globalThis.BREAK_ROOM_PACK,rows=bank('pack','puzzles','PACK_PUZZLES').rows.filter(b=>b.items.length<10),hard=rows.filter(b=>b.difficulty==='hard'),rnd=M.random('pack:advanced:launch:v2');
 function optimum(b){const n=1<<b.items.length,w=new Int32Array(n),v=new Int32Array(n),ix={};b.items.forEach((_,i)=>ix[1<<i]=i);let points=-1,count=0;for(let m=1;m<n;m++){const bit=m&-m,i=ix[bit],p=m^bit;w[m]=w[p]+b.items[i].weight;v[m]=v[p]+b.items[i].points;if(w[m]>b.limit)continue;if(v[m]>points){points=v[m];count=1;}else if(v[m]===points)count++;}return{points,count};}
 for(let i=0;i<32;i++){let chosen;for(let a=0;a<100000;a++){const base=hard[Math.floor(rnd()*hard.length)],names=new Set(base.items.map(x=>x.name)),extras=shuffle(rows.filter(b=>b.title===base.title).flatMap(b=>b.items),rnd).filter(x=>!names.has(x.name)),items=base.items.map(x=>({...x}));
 for(const x of extras)if(!items.some(y=>y.name===x.name)){items.push({...x,weight:Math.max(1,Math.round(x.weight*(.7+rnd()*.6)))});if(items.length===10)break;}if(items.length!==10)continue;
 const b={...base,id:'pack-launch-hard-'+(i+1),items,limit:Math.round(items.reduce((n,x)=>n+x.weight,0)*(.4+rnd()*.2))};if(!M.validBag(b))continue;const best=optimum(b);if(best.count!==1)continue;let w=0,p=0;for(const x of items.slice().sort((a,b)=>b.points/b.weight-a.points/a.weight))if(w+x.weight<=b.limit){w+=x.weight;p+=x.points;}if(1-p/best.points<.14)continue;chosen=b;break;}if(!chosen)throw Error('Cannot build Pack '+i);rows.push(chosen);}
 save('pack','puzzles','PACK_PUZZLES',rows);
}
if(game==='bouncer'){
 require('../bouncer-model.js');const M=globalThis.BREAK_ROOM_BOUNCER,{box,rows:all}=bank('bouncer','puzzles','BOUNCER_PUZZLES'),rows=all.filter(p=>p.level!==3||Number(p.id.split('-').at(-1))<=60),experts=rows.filter(p=>p.level===3),source=require('../content/bouncer-words.json'),rnd=M.random('bouncer:expert:launch:v2');
 const seen=new Set(rows.map(p=>JSON.stringify([p.rule,p.ins.slice().sort(),p.outs.slice().sort(),p.words.slice().sort()])));
 for(let i=0;i<32;i++){let chosen;for(let a=0;a<10000;a++){const base=experts[(i+a)%experts.length],used=new Set([...base.ins,...base.outs]),groups=Array.from({length:4},()=>[]);for(const w of source.words)if(!used.has(w))groups[Number(M.test(base.rule[1][0],w))*2+Number(M.test(base.rule[1][1],w))].push(w);
 const counts=base.rule[0]==='or'?[3,1,2,2]:[2,2,2,2];if(groups.some((g,j)=>g.length<counts[j]))continue;const p={...base,id:'bouncer-v1-3-'+(61+i),words:shuffle(groups.flatMap((g,j)=>shuffle(g,rnd).slice(0,counts[j])),rnd)},sig=JSON.stringify([p.rule,p.ins.slice().sort(),p.outs.slice().sort(),p.words.slice().sort()]);if(seen.has(sig)||!M.puzzle(p))continue;seen.add(sig);chosen=p;break;}if(!chosen)throw Error('Cannot build Bouncer '+i);rows.push(chosen);}
 save('bouncer','puzzles','BOUNCER_PUZZLES',rows,'window.BOUNCER_RULES='+JSON.stringify(box.window.BOUNCER_RULES)+';\n');
}
if(!['pack','bouncer','alibi','laser','stack-up'].includes(game))throw Error('Choose pack, bouncer, alibi, laser or stack-up');

if(game==='alibi'){
 require('../alibi-model.js');const M=globalThis.BREAK_ROOM_ALIBI,original=bank('alibi','cases','ALIBI_CASES').rows.filter(p=>Number(p.id.split('-').at(-1))<=24),rows=original.slice(),seen=new Set(original.map(M.signature));
function candidates(p,types){const list=[];for(let a=0;a<p.n;a++)for(let b=0;b<p.n;b++)for(const type of types){if(['at','notat'].includes(type))list.push([type,a,b,0]);else if(a!==b){if(type==='gap'){for(let x=0;x<p.n;x++)for(let y=0;y<x;y++)list.push([type,a,b,p.times[x]-p.times[y]]);}else list.push([type,a,b,0]);}}return [...new Map(list.map(s=>[s.join(),s])).values()];}
function clueMetrics(p){const rows=M.reconstruct(p,{accounts:false,evidence:[]}).map(w=>({c:w.culprit,ok:[...p.evidence.map(e=>M.claim(p,e.rule,w.order)),...w.truth.map((t,i)=>t!==(i===w.culprit))]})),n=p.n+p.evidence.length;let best=n;for(let mask=1;mask<1<<n;mask++){const count=mask.toString(2).replaceAll('0','').length;if(count>=best)continue;if(new Set(rows.filter(w=>w.ok.every((v,i)=>!(mask&1<<i)||v)).map(w=>w.c)).size===1)best=count;}return best;}

 for(let level=0;level<4;level++){
  const rnd=M.random('alibi:launch:curation:v3:'+level),bases=original.filter(p=>p.level===level),target=level===3?32:9;let found=0;
  const prepared=bases.map(p=>{const order=M.solve(p)[0].order,culprit=order[M.incident(p)],types=level===0?['at','notat']:level===1?['at','notat','before','after']:['at','notat','before','after','next','gap'],pool=candidates(p,types);
   return{p,accounts:Array.from({length:p.n},(_,i)=>pool.filter(s=>s[1]===i&&M.claim(p,s,order)===(i!==culprit))),evidence:candidates(p,level<2?['at','before']:['at','before','next','gap']).filter(s=>M.claim(p,s,order)&&!(s[0]==='at'&&s[2]===M.incident(p)))};
  });
  for(let attempt=0;found<target&&attempt<300000;attempt++){
   const base=prepared[Math.floor(rnd()*prepared.length)],p=structuredClone(base.p),edits=1+(rnd()*3|0);
   for(let j=0;j<edits;j++){const i=rnd()*p.n|0;p.s[i]=base.accounts[i][rnd()*base.accounts[i].length|0];}
   if(rnd()<.6){const i=rnd()*p.evidence.length|0;p.evidence[i]={rule:base.evidence[rnd()*base.evidence.length|0],title:'Verified visit record',detail:'Verified visit record.'};}
   if(new Set(p.evidence.map(e=>e.rule.join())).size!==p.evidence.length||p.s.filter(s=>!['at','notat'].includes(s[0])).length<[0,2,3,4][level])continue;
   if(M.reconstruct(p).length!==1||new Set(M.reconstruct(p,{evidence:[]}).map(w=>w.culprit)).size<2||new Set(M.reconstruct(p,{accounts:false}).map(w=>w.culprit)).size<2||clueMetrics(p)<[3,3,4,6][level])continue;
   const sig=M.signature(p);if(seen.has(sig))continue;seen.add(sig);p.id='alibi-v2-'+level+'-'+(25+found);p.evidence.forEach(e=>e.detail=M.account(p,e.rule,false));
   if(!M.puzzle(p))throw Error('Invalid scenario');rows.push(p);found++;
  }
  if(found!==target)throw Error('Insufficient '+M.LEVELS[level]+' cases');console.log('Curated '+found+' additional '+M.LEVELS[level]+' cases');
 }
 save('alibi','cases','ALIBI_CASES',rows);
}

if(game==='laser'){
 require('../laser-model.js');const M=globalThis.BREAK_ROOM_LASER,rows=bank('laser','boards','LASER_BOARDS').rows.filter(b=>!b.id.startsWith('laser-v2-')||Number(b.id.split('-').at(-1))<=96),experts=rows.filter(b=>b.level===3),rnd=M.random('laser:advanced:launch:v3'),seen=new Set(rows.map(b=>JSON.stringify([b.row,b.t,b.fx,b.w]))),paths=new Set(experts.map(b=>JSON.stringify(M.trace(b,M.solve(b)[0]).path)));
 for(let attempt=0;rows.length<248&&attempt<300000;attempt++){
  const base=experts[Math.floor(rnd()*experts.length)],b=structuredClone(base),spot=()=>{const used=new Set([b.t,...b.fx,...b.w].map(p=>p.slice(0,2).join()));for(;;){const p=[rnd()*7|0,rnd()*7|0];if(!used.has(p.join()))return p;}};
  const i=rnd()*6|0;b.fx[i]=[...spot(),rnd()<.5?'/':'\\'];b.t=spot();b.row=rnd()*7|0;
  if(!M.board(b)||b.fx.some(p=>p[0]===b.row&&p[1]===0))continue;
  const sig=JSON.stringify([b.row,b.t,b.fx,b.w]);if(seen.has(sig))continue;const solutions=M.solve(b);if(solutions.length!==1)continue;
  const path=M.trace(b,solutions[0]).path,visited=new Set(path.map(p=>p.join())),key=JSON.stringify(path);
  if(path.length<24||path.length>40||b.fx.filter(p=>visited.has(p.slice(0,2).join())).length<5||paths.has(key))continue;
  b.id='laser-v2-3-'+(rows.length-119);seen.add(sig);paths.add(key);rows.push(b);
 }
 if(rows.length!==248)throw Error('Insufficient advanced routes');save('laser','boards','LASER_BOARDS',rows);
}

if(game==='stack-up'){
 const retained=bank('stack-up','stacks','STACK_UP_STACKS').rows;
 if(retained.length===208&&retained.filter(s=>s.id.startsWith('stack-launch-')).length===96){require('./review-question-banks.cjs');}else{
 const rows=bank('stack-up','stacks','STACK_UP_STACKS').rows.filter(s=>!s.id.startsWith('stack-launch-')),audit=JSON.parse(fs.readFileSync('content/question-audit.json','utf8'));audit.stack_up=audit.stack_up.filter(s=>!s.id.startsWith('stack-launch-'));
 const gcd=(a,b)=>b?gcd(b,a%b):a,pool=[],seen=new Set(rows.map(s=>s.cards.map(c=>c.name).sort().join('|')));
 for(let d=11;d<=43;d++)for(let n=1;n<d;n++)if(gcd(n,d)===1&&n/d>=.48&&n/d<=.68)pool.push({n,d});
 for(let i=0;i<64;i++){let chosen;for(let a=0;a<pool.length*3;a++){const start=i*17+a*11,r=Array.from({length:5},(_,j)=>pool[(start+j*(13+i%9))%pool.length]).sort((a,b)=>a.n*b.d-b.n*a.d);
 if(new Set(r.map(x=>x.n+'/'+x.d)).size<5||r.at(-1).n/r.at(-1).d-r[0].n/r[0].d>.14)continue;const sig=r.map(x=>x.n+'/'+x.d).sort().join('|');if(seen.has(sig))continue;seen.add(sig);chosen=r;break;}if(!chosen)throw Error('Insufficient fraction sets');
 const id='stack-launch-'+String(i+1).padStart(3,'0'),names=chosen.map(x=>x.n+'/'+x.d),values=chosen.map(x=>x.n/x.d);
 rows.push({id,difficulty:'hard',category:'NUMBER SENSE',prompt:'Order these fractions from smallest to largest.',ends:['SMALLER','LARGER'],fact:names.map((n,j)=>n+': '+values[j].toFixed(4)).join('; ')+'.',cards:names.map((name,j)=>({name,detail:'',value:j+1,symbol:'∑'})),source:'math'});
 audit.stack_up.push({id,kind:'expanded',source:'math',measure:'result',unit:'',ordered:names.map((key,j)=>({key,name:key,value:values[j]})),calculations:Object.fromEntries(names.map(x=>[x,x]))});
 }
 const families=new Map();for(const s of rows.filter(s=>!s.id.startsWith('stack-launch-'))){const row=audit.stack_up.find(a=>a.id===s.id);if(row.source==='math')continue;const key=row.source+':'+row.measure;if(!families.has(key))families.set(key,{s,row,items:new Map()});for(const x of row.ordered)families.get(key).items.set(x.key,x);}
 const groups=[...families.values()];
 for(let i=0;i<32;i++){const f=groups[i%groups.length],items=[...f.items.values()];let chosen;
 for(let a=0;a<10000;a++){let state=104729+i*7919+a*65537;const copy=items.slice();for(let j=copy.length-1;j>0;j--){state=(Math.imul(state,1664525)+1013904223)>>>0;const k=state%(j+1);[copy[j],copy[k]]=[copy[k],copy[j]];}const r=copy.slice(0,5).sort((a,b)=>a.value-b.value),gap={number:1,melt:20,density_g_cm3:.2,area:1500,year:1,latitude:1,longitude:2,elevation_ft:150}[f.row.measure];
 if(r.some((x,j)=>j&&x.value-r[j-1].value<gap))continue;const sig=r.map(x=>x.name).sort().join('|');if(seen.has(sig))continue;seen.add(sig);chosen=r;break;}
 if(!chosen)throw Error('Insufficient sourced sets');const id='stack-launch-fact-'+String(i+1).padStart(3,'0'),row={...f.row,id,kind:'expanded',ordered:chosen};
 rows.push({...f.s,id,fact:chosen.map(x=>x.name+': '+x.value+(row.unit?' '+row.unit:'')).join('; ')+'.',cards:chosen.map((x,j)=>({name:x.name,detail:'',value:j+1,symbol:f.s.cards[0].symbol}))});audit.stack_up.push(row);
 }
 save('stack-up','stacks','STACK_UP_STACKS',rows);fs.writeFileSync('content/question-audit.json',JSON.stringify(audit,null,2)+'\n');
 }
}
