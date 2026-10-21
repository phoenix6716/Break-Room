/* Offline finite search. Distinct means distinct under renaming AND truth inversion. */
const fs=require('fs');require('../alibi-model.js');const M=globalThis.BREAK_ROOM_ALIBI;
const counts=[24,32,40,48],out=[],seen=new Set();
const themes=[
 ['The last biscuit vanished.','One person took the last biscuit from the shared tin. Everyone was in the break room.','BISCUIT'],
 ['The good stapler disappeared.','One person borrowed the only stapler that never jams. It is still somewhere in the office.','STAPLER'],
 ['Someone changed the playlist.','One person replaced the Friday playlist with hold music. Nobody is admitting it.','PLAYLIST'],
 ['The office plant moved.','One person relocated the desk plant to the photocopier. The plant has declined to comment.','PLANT'],
 ['The fridge note was edited.','One person added a very unhelpful footnote to the fridge rules. The handwriting offers no clues.','FRIDGE NOTE'],
 ['The meeting was renamed.','One person renamed the team meeting “Mandatory Fun”. The calendar log has gone missing.','CALENDAR'],
 ['The fancy pen went missing.','One person borrowed the reception pen and forgot to return it. Nobody else touched it.','PEN'],
 ['The mug collection grew.','One person put a mystery mug in the cupboard. It says “World’s Okayest Colleague”.','MUG'],
 ['Someone hid the remote.','One person hid the air-conditioning remote inside a stationery drawer. The office is divided.','REMOTE'],
 ['The printer got a name.','One person labelled the printer “Paper Goblin”. There is only one label and one culprit.','PRINTER'],
 ['Someone took the window seat.','One person moved the reserved sign onto the window desk. The sign itself is not evidence.','DESK SIGN'],
 ['The tea tin was swapped.','One person swapped the labels on two tea tins. Everyone has agreed this has gone far enough.','TEA TIN']
];
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
for(let level=0;level<4;level++){
 const r=M.random('alibi:library:v1:'+level),n=M.SIZES[level];let found=0;
 for(let attempt=0;attempt<1000000&&found<counts[level];attempt++){
  const ord=shuffle(Array.from({length:n},(_,i)=>i),r),s=Array(n),meta=[0,1,2,3][level];
  ord.forEach((speaker,i)=>{if(i<n-meta)s[speaker]=[r()<.5?'is':'not',Math.floor(r()*n),0];else if(level>=2&&i===n-1){const refs=shuffle(ord.slice(0,i),r);s[speaker]=[r()<.5?'either':'both',refs[0],refs[1]];}else s[speaker]=[r()<.5?'tru':'lie',ord[Math.floor(r()*i)],0];});
  const p={n,s,k:1+Math.floor(r()*(n-1))};if(new Set(s.map(x=>x.join())).size!==n||M.solve(p).length!==1)continue;
  const m=M.metrics(p);if(level===1&&m.core<3||level===2&&(m.core<3||m.depth!==2)||level===3&&(m.core<4||m.depth!==2))continue;
  const sig=M.signature(p);if(seen.has(sig))continue;seen.add(sig);
  const theme=themes[found%themes.length],names=shuffle(['Ava','Ben','Cleo','Dev','Ellis','Frankie','Gia','Hari'],r).slice(0,n);
  const complete={id:`alibi-v1-${level}-${found+1}`,level,n,k:p.k,s,names,crime:theme[0],detail:theme[1],item:theme[2]};if(!M.puzzle(complete))throw Error('Invalid case');out.push(complete);found++;
 }
 if(found!==counts[level])throw Error(`Insufficient distinct level ${level}: ${found}`);
 console.log(M.LEVELS[level]+': '+found+' distinct cases');
}
fs.writeFileSync('games/alibi/cases.js','/* Rebuild with scripts/build-alibi-cases.cjs; no answers stored. */\nwindow.ALIBI_CASES='+JSON.stringify(out)+';\n');
