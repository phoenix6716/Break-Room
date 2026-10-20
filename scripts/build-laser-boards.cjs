const fs=require('fs');require('../laser-model.js');const M=globalThis.BREAK_ROOM_LASER;const out=[];
for(let level=0;level<4;level++)for(let index=0;index<40;index++){
const rnd=M.random('laser:curated:v1:'+level+':'+index),n=M.CONFIG[level][0],f=M.CONFIG[level][1],w=M.CONFIG[level][2];let accepted;
for(let at=0;at<20000;at++){
const bottom=rnd()<.5,row=bottom?n-1:0,used=new Set(),pick=()=>{for(;;){let p=[rnd()*n|0,rnd()*n|0];if(!used.has(p.join(','))){used.add(p.join(','));return p}}},fx=[];
if(level>0){fx.push([row,0,bottom?'/':'\\']);used.add([row,0].join(','));}
if(level===3){const second=[row+(bottom?-1:1),0,bottom?'/':'\\'];fx.push(second);used.add(second.slice(0,2).join(','));}
while(fx.length<f)fx.push([...pick(),rnd()<.5?'/':'\\']);const walls=[];while(walls.length<w)walls.push(pick());const b={id:`laser-v1-${level}-${index+1}`,level,n,row,t:pick(),fx,w:walls};if(!M.board(b))continue;
const sol=M.solve(b);if(sol.length<1||sol.length>3)continue;
if(!sol.every(ps=>{const path=M.trace(b,ps).path,set=new Set(path.map(p=>p.join(',')));return path.length>=[5,7,8,10][level]&&path.length<=30&&fx.filter(m=>set.has(m.slice(0,2).join(','))).length>=[0,1,1,2][level]}))continue;
accepted=b;break;
}
if(!accepted)throw Error('Timeout at '+level+':'+index);out.push(accepted);
}
const destination='games/laser/boards.js',temporary=destination+'.tmp';fs.writeFileSync(temporary,'/* Solver-checked route-graded library. Rebuild with scripts/build-laser-boards.cjs. */\nwindow.LASER_BOARDS='+JSON.stringify(out)+';\n');fs.renameSync(temporary,destination);console.log('Built '+out.length+' route-graded two-mirror boards.');
