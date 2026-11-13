/* Advisory browser-local puzzle history. Never grants access or changes Daily saves. */
(root=>{'use strict';
 const PREFIX='break-room:unlimited-library:v1:';
 const units={laser:'boards','time-drop':'events','clue-ladder':'puzzles','seating-chart':'tables','shift-work':'boards',codebreak:'codes','stack-up':'stacks',pack:'bags',lowball:'items','inner-clock':'targets'};
 const actor=()=>{try{return root.localStorage.getItem('br:cloud:owner')||'guest';}catch{return'guest';}};
 function create(game,options={}){
  const owner=options.owner||actor(),getStore=name=>{try{return root[name];}catch{return null;}},storage=options.storage||getStore('localStorage'),session=options.session||getStore('sessionStorage'),key=PREFIX+owner+':'+game;
  let seen=new Set(),current=null,durable=true,damaged=false,lastRaw=null;
  const active=()=>options.owner?true:actor()===owner;
  const valid=id=>typeof id==='string'&&id.length>0&&id.length<=200;
  function read(){try{const raw=storage.getItem(key);if(raw&&raw!==lastRaw){const value=JSON.parse(raw);if(value.version!==1||!Array.isArray(value.seen)||value.seen.length>20000||!value.seen.every(valid))throw Error('Invalid history');value.seen.forEach(id=>seen.add(id));lastRaw=raw;}}catch{durable=false;damaged=true;}}
  function save(){if(!active()||damaged)return;try{const raw=JSON.stringify({version:1,seen:[...seen]});storage.setItem(key,raw);lastRaw=raw;}catch{durable=false;}}
  read();try{const saved=JSON.parse(session.getItem(key));if(saved&&valid(saved.id)&&typeof saved.replay==='boolean')current=saved;}catch{}
  function draw(id,resume=false){id=String(id);if(!valid(id)||!active())return;read();if(resume&&current?.id===id){if(!seen.has(id)){seen.add(id);save();}return;}current={id,replay:seen.has(id)};seen.add(id);save();try{session.setItem(key,JSON.stringify(current));}catch{durable=false;}}
  function seed(ids){if(!active())return;read();for(const id of ids.map(String))if(valid(id))seen.add(id);save();}
  function status(ids){read();const pool=[...new Set(ids.map(String))];return{total:pool.length,remaining:pool.filter(id=>!seen.has(id)).length,replay:!!current?.replay,durable:durable&&!damaged};}
  function unseen(items,id=x=>x.id){if(!active())return items;read();const fresh=items.filter(x=>!seen.has(String(id(x))));return fresh.length?fresh:items;}
  function show(host,ids,id){if(!active())return;draw(id,true);const state=status(ids),box=host.ownerDocument.createElement('section');box.className='unlimited-library';box.setAttribute('aria-label','Unlimited puzzle library');box.dataset.exhausted=String(state.total>0&&state.remaining===0);box.dataset.replay=String(state.replay);
   const title=host.ownerDocument.createElement('strong');title.textContent=state.replay?'REPLAY':'NEW IN UNLIMITED';
   const unit=units[game]||'puzzles';const detail=host.ownerDocument.createElement('p');detail.setAttribute('role','status');detail.textContent=state.total&&state.remaining===0?'Current pool exhausted — all '+state.total+' '+unit+' for these settings have been shown. Keep playing replays; new additions count as unseen.':state.remaining+' unseen of '+state.total+' '+unit+' available for these settings.';
   const note=host.ownerDocument.createElement('small');note.textContent=(state.durable?'Saved per account on this browser.':'History could not be saved reliably; counts may reset.')+' Counts track Unlimited puzzles shown. Earlier unsaved play isn’t included.';box.append(title,detail,note);host.prepend(box);return state;
  }
  return Object.freeze({draw,seed,status,unseen,show});
 }
 root.BREAK_ROOM_UNLIMITED_LIBRARY=Object.freeze({PREFIX,create});
})(typeof window==='undefined'?globalThis:window);
