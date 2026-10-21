const fs=require('node:fs');require('../bouncer-model.js');const M=BREAK_ROOM_BOUNCER,source=require('../content/bouncer-words.json'),rnd=M.random('bouncer:bank:v1'),shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;},out=[];
const signatures=new Set();for(const candidate of source.rules){if(!M.rule(candidate.rule))throw Error('Bad rule '+candidate.id);const sig=source.words.map(w=>Number(M.test(candidate.rule,w))).join('');if(signatures.has(sig))throw Error('Equivalent rules '+candidate.id);signatures.add(sig);}
for(let level=0;level<4;level++)for(let index=0;index<60;index++){
 const chosen=source.rules.filter(r=>r.level===level)[index%12],rule=chosen.rule,inside=source.words.filter(w=>M.test(rule,w)),outside=source.words.filter(w=>!M.test(rule,w));let found;
 if(inside.length<7||outside.length<7)throw Error('Rule pool too small '+chosen.id+': '+inside.length+'/'+outside.length);
 for(let attempt=0;attempt<100000;attempt++){
  const ins=shuffle(inside).slice(0,2),outs=shuffle(outside).slice(0,2);
  const fits=source.rules.filter(r=>ins.every(w=>M.test(r.rule,w))&&outs.every(w=>!M.test(r.rule,w)));if(fits.length!==1)continue;
  const used=new Set([...ins,...outs]),n=3+(rnd()*3|0),words=shuffle([...shuffle(inside.filter(w=>!used.has(w))).slice(0,n),...shuffle(outside.filter(w=>!used.has(w))).slice(0,8-n)]);
  if(level>=2){const [a,b]=rule[1],categories=new Set([...ins,...outs,...words].map(w=>Number(M.test(a,w))*2+Number(M.test(b,w))));if(categories.size!==4)continue;}
  found={id:`bouncer-v1-${level}-${index+1}`,level,rule,ins,outs,words};break;
 }
 if(!found)throw Error('No uniquely clued puzzle '+chosen.id);if(!M.puzzle(found))throw Error('Invalid generated puzzle');out.push(found);
}
const file='games/bouncer/puzzles.js';fs.writeFileSync(file+'.tmp','/* Spelling-verified puzzles; examples identify one rule in the published rulebook. */\nwindow.BOUNCER_RULES='+JSON.stringify(source.rules)+';\nwindow.BOUNCER_PUZZLES='+JSON.stringify(out)+';\n');fs.renameSync(file+'.tmp',file);console.log('Built '+out.length+' uniquely clued Bouncer doors.');

require('node:child_process').execFileSync(process.execPath,['scripts/build-launch-content.cjs','bouncer'],{stdio:'inherit'});
