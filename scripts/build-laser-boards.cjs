/* The original v1 layouts are frozen. Only new Expert boards use the v2 rules. */
const fs=require('node:fs');require('../laser-model.js');const M=globalThis.BREAK_ROOM_LASER;
const original=require('../content/laser-v1-boards.json'),out=original.filter(b=>b.level<3),rnd=M.random('laser:expert:v2'),seen=new Set();
function signature(b,flip=false){const p=([r,c,t])=>[flip?b.n-1-r:r,c,...(t?[flip?(t==='/'?'\\':'/'):t]:[])];return JSON.stringify([flip?b.n-1-b.row:b.row,p(b.t),b.fx.map(p).sort(),b.w.map(p).sort()]);}
for(let attempts=0;out.length<216&&attempts<6000000;attempts++){
 const n=7,row=rnd()*n|0,used=new Set(),pick=()=>{for(;;){const p=[rnd()*n|0,rnd()*n|0];if(!used.has(p.join())){used.add(p.join());return p;}}};
 const fx=Array.from({length:6},()=>[...pick(),rnd()<.5?'/':'\\']),w=Array.from({length:4},pick);
 const b={id:'laser-v2-3-'+(out.length-119),level:3,n,row,t:pick(),fx,w};
 // No repeated mandatory opening staircase. The beam can enter on any row.
 if(fx.some(p=>p[0]===row&&p[1]===0))continue;
 const signatureKey=[signature(b),signature(b,true)].sort()[0];if(seen.has(signatureKey))continue;
 const solutions=M.solve(b);if(solutions.length!==1)continue;
 const path=M.trace(b,solutions[0]).path,visited=new Set(path.map(p=>p.join()));
 // Exactly three necessary placements, a unique route, and at least seven meaningful turns.
 if(path.length<18||path.length>40||fx.filter(p=>visited.has(p.slice(0,2).join())).length<4)continue;
 seen.add(signatureKey);out.push(b);
 if((out.length-120)%24===0)console.log('Generated '+(out.length-120)+' / 96 new Expert boards.');
}
if(out.length!==216)throw Error('Could not generate the full unique Expert library.');
const destination='games/laser/boards.js',temporary=destination+'.tmp';fs.writeFileSync(temporary,'/* Frozen v1 Warm-up/Standard/Tricky; solver-checked v2 three-mirror Expert. */\nwindow.LASER_BOARDS='+JSON.stringify(out)+';\n');fs.renameSync(temporary,destination);console.log('Built 216 boards: 120 unchanged easier boards and 96 new three-mirror Experts.');

require('node:child_process').execFileSync(process.execPath,['scripts/build-launch-content.cjs','laser'],{stdio:'inherit'});
