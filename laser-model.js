/* Laser v1/v2: immutable board snapshots, exact reflection tracing and first-fire scores. */
(root=>{'use strict';
 const PREFIX='break-room:laser:daily:',CONFIG=[[5,2,0],[6,3,0],[6,3,2],[7,4,3]],LEVELS=['Warm-up','Standard','Tricky','Expert'];
 const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
 function date(day){return typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day+'T00:00:00Z'))&&new Date(day+'T00:00:00Z').toISOString().slice(0,10)===day;}
 const coord=(p,n,mirror=false)=>Array.isArray(p)&&p.length===(mirror?3:2)&&integer(p[0],0,n-1)&&integer(p[1],0,n-1)&&(!mirror||['/','\\'].includes(p[2]));
 const expert=b=>!!b&&typeof b.id==='string'&&/^laser-v2-3-[0-9]+$/.test(b.id);
 const budget=b=>expert(b)?3:2;
 function board(b){if(!b||typeof b.id!=='string'||!(/^laser-v1-[0-3]-[0-9]+$/.test(b.id)||expert(b))||b.id.length>80||!integer(b.level,0,3))return false;if(expert(b)&&b.level!==3)return false;const [n,f,w]=expert(b)?[7,6,4]:CONFIG[b.level];if(b.n!==n||!integer(b.row,0,n-1)||!coord(b.t,n)||!Array.isArray(b.fx)||b.fx.length!==f||!b.fx.every(p=>coord(p,n,true))||!Array.isArray(b.w)||b.w.length!==w||!b.w.every(p=>coord(p,n)))return false;const all=[b.t,...b.fx,...b.w].map(p=>p[0]+','+p[1]);return new Set(all).size===all.length;}
 function empty(b){const occupied=new Set([b.t,...b.fx,...b.w].map(p=>p[0]+','+p[1])),out=[];for(let r=0;r<b.n;r++)for(let c=0;c<b.n;c++)if(!occupied.has(r+','+c))out.push([r,c]);return out;}
 function placements(b,ps,complete=false){if(!Array.isArray(ps)||ps.length>budget(b)||(complete&&ps.length!==budget(b))||!ps.every(p=>coord(p,b.n,true))||new Set(ps.map(p=>p[0]+','+p[1])).size!==ps.length)return false;const legal=new Set(empty(b).map(p=>p.join(',')));return ps.every(p=>legal.has(p[0]+','+p[1]));}
 function trace(b,ps){const grid=new Map(),seen=new Set(),path=[];b.fx.forEach(p=>grid.set(p[0]+','+p[1],p[2]));b.w.forEach(p=>grid.set(p.join(','),'wall'));ps.forEach(p=>grid.set(p[0]+','+p[1],p[2]));let r=b.row,c=-1,dx=1,dy=0;for(;;){c+=dx;r+=dy;if(r<0||c<0||r>=b.n||c>=b.n)return{hit:false,path,reason:'exit'};const state=[r,c,dx,dy].join(',');if(seen.has(state))return{hit:false,path,reason:'loop'};seen.add(state);path.push([r,c]);if(r===b.t[0]&&c===b.t[1])return{hit:true,path,reason:'target'};const k=grid.get(r+','+c);if(k==='wall')return{hit:false,path,reason:'wall'};if(k==='/')[dx,dy]=[-dy,-dx];else if(k==='\\')[dx,dy]=[dy,dx];}}
 // Search beam decisions, not all combinations of empty cells. A cell passed straight
 // remains empty on later visits: placing there retroactively would change the earlier ray.
 function solve(b){
  const n=b.n,limit=budget(b),grid=new Map(),solutions=new Map();let shortcut=false;
  b.fx.forEach(p=>grid.set(p[0]*n+p[1],p[2]));b.w.forEach(p=>grid.set(p[0]*n+p[1],'wall'));
  const target=b.t[0]*n+b.t[1];
  function walk(r,c,dr,dc,ps,decided,seen){
   while(!shortcut){
    r+=dr;c+=dc;if(r<0||c<0||r>=n||c>=n)return;
    const cell=r*n+c,state=cell*4+(dr===-1?0:dc===1?1:dr===1?2:3);
    if(seen.has(state))return;seen.add(state);
    if(cell===target){if(ps.length<limit){shortcut=true;return;}const p=ps.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);solutions.set(JSON.stringify(p),p);return;}
    const own=ps.find(p=>p[0]===r&&p[1]===c),tile=own?.[2]||grid.get(cell);
    if(tile==='wall')return;
    if(tile==='/'){[dr,dc]=[-dc,-dr];continue;}
    if(tile==='\\'){[dr,dc]=[dc,dr];continue;}
    if(!decided.has(cell)&&ps.length<limit){
     walk(r,c,-dc,-dr,[...ps,[r,c,'/']],new Set(decided),new Set(seen));
     walk(r,c,dc,dr,[...ps,[r,c,'\\']],new Set(decided),new Set(seen));
    }
    decided.add(cell);
   }
  }
  walk(b.row,-1,0,1,[],new Set(),new Set());
  return shortcut?[]:[...solutions.values()];
 }
 function valid(r,day){return date(day)&&!!r&&r.version===1&&integer(r.edits,0,1000000)&&r.day===day&&Array.isArray(r.boards)&&r.boards.length===4&&r.boards.every(board)&&new Set(r.boards.map(b=>b.id)).size===4&&Array.isArray(r.picks)&&r.picks.length<=4&&r.picks.every((p,i)=>placements(r.boards[i],p,true))&&integer(r.round,0,3)&&['play','review','summary'].includes(r.phase)&&(r.phase==='play'?r.picks.length===r.round:r.picks.length===r.round+1&&(r.phase!=='summary'||r.picks.length===4))&&placements(r.boards[r.round],r.mirrors,r.phase!=='play')&&(r.phase==='play'||JSON.stringify(r.mirrors)===JSON.stringify(r.picks.at(-1)));}
 function record(r,day){if(!valid(r,day)||r.picks.length!==4)return null;const solved=r.picks.reduce((sum,p,i)=>sum+Number(trace(r.boards[i],p).hit),0);return{solved,points:solved,arcadeScore:solved*25};}
 function random(seed){let a=2166136261;for(const c of seed)a=Math.imul(a^c.charCodeAt(0),16777619);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 function rotation(pool,day,seed,count=1){const rnd=random(seed),deck=pool.slice().sort((a,b)=>a.id.localeCompare(b.id));for(let i=deck.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}const start=Math.floor(Date.parse(day+'T00:00:00Z')/86400000)*count;return Array.from({length:count},(_,i)=>deck[(start+i)%deck.length]);}
 function daily(bank,day){if(day>='2026-10-23'){const held=new Set(daily(bank,'2026-10-22').map(b=>b.id));return CONFIG.map((_,level)=>rotation(bank.filter(b=>!held.has(b.id)&&b.level===level&&(level!==3||Number(b.id.split('-').at(-1))>96)),day,'laser:rotation:v3:'+level)[0]);}const rnd=random('laser:daily:v1:'+day);return CONFIG.map((_,level)=>{const pool=bank.filter(b=>b.level===level&&(day>='2026-10-23'||!expert(b)||Number(b.id.split('-').at(-1))<=96)).slice().sort((a,b)=>a.id.localeCompare(b.id));return pool[Math.floor(rnd()*pool.length)];});}
 root.BREAK_ROOM_LASER=Object.freeze({PREFIX,CONFIG,LEVELS,budget,date,board,empty,placements,trace,solve,valid,record,random,daily});
})(typeof window==='undefined'?globalThis:window);
