/* Stable native IDs: metadata only; no new authored questions. */
const fs=require('node:fs'),vm=require('node:vm');
function catalogue(){
 const c={};c.window=c;vm.createContext(c);const load=p=>vm.runInContext(fs.readFileSync(p,'utf8'),c),rows=[];
 const add=(game,id,group,eligible=true)=>rows.push({game,id:String(id),group:String(group??''),eligible});
 for(const [game,file,key]of [['laser','boards','LASER_BOARDS'],['time-drop','events','TIME_DROP_EVENTS'],['clue-ladder','puzzles','CLUE_LADDER_PUZZLES'],['seating-chart','puzzles','SEATING_CHART_PUZZLES'],['shift-work','boards','SHIFT_WORK_BOARDS'],['pack','puzzles','PACK_PUZZLES']]){
  load(`games/${game}/${file}.js`);for(const b of c[key]){
   let eligible=true;if(game==='laser')eligible=b.level===0?!b.id.startsWith('laser-v3-'):b.id.startsWith('laser-v3-');if(game==='seating-chart')eligible=b.id.startsWith('sc-v3-');if(game==='pack')eligible=b.difficulty!=='hard'||b.items.length===10;
   add(game,b.id,b.tier??b.difficulty??b.category??b.level,eligible);
  }
 }
 load('games/stack-up/stacks.js');load('games/stack-up/familiar-stacks.js');
 const replacements=new Map(c.STACK_UP_REPLACEMENT_STACKS.map(s=>[s.id,s])),pool=[...c.STACK_UP_STACKS.map(s=>replacements.get(s.id)||s),...c.STACK_UP_FAMILIAR_STACKS],themes=new Set();
 for(const s of [...pool.filter(s=>s.collection==='familiar'),...pool.filter(s=>s.collection!=='familiar')]){const id=s.theme||s.prompt;if(themes.has(id))continue;themes.add(id);add('stack-up',id,s.category,s.category!=='NUMBER SENSE');}
 for(let t=2000;t<=12000;t+=50)add('inner-clock',t,t<=4000?'short':t<=8000?'medium':'long',t%100===0);
 load('codebreak-model.js');for(const code of c.BREAK_ROOM_CODEBREAK.CODES)add('codebreak',code,code[0]);
 const low=fs.readFileSync('games/lowball/engine/index.html','utf8'),items=vm.runInNewContext(low.match(/const ITEMS = (\[[\s\S]*?\n\]);/)[1]);for(const item of items)add('lowball',item.name,'');
 return rows;
}
if(require.main===module)process.stdout.write(JSON.stringify(catalogue()));
module.exports={catalogue};
