/* Advisory browser-local puzzle history. Never grants access or changes Daily saves. */
(root=>{'use strict';
 const PREFIX='break-room:unlimited-library:v1:',WEEKLY_PREFIX='break-room:weekly-selection:v1:',LIMIT=100;
 function week(day){const date=new Date(day+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(+date)||date.toISOString().slice(0,10)!==day)throw Error('Invalid Sydney date');date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);return date.toISOString().slice(0,10);}
 function today(){return root.MIDNIGHT_ARCADE_CLOCK?.dayKey()||new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
 function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
 const actor=()=>{try{return root.localStorage.getItem('br:cloud:owner')||'guest';}catch{return'guest';}};
 function create(game,options={}){
  const owner=options.owner||actor(),getStore=name=>{try{return root[name];}catch{return null;}},storage=options.storage||getStore('localStorage'),session=options.session||getStore('sessionStorage'),key=PREFIX+owner+':'+game;
  let seen=new Set(),current=null,durable=true,damaged=false,lastRaw=null,batch=null,batchRaw=null,batchDamaged=false;
  const active=()=>options.owner?true:actor()===owner;
  const valid=id=>typeof id==='string'&&id.length>0&&id.length<=200;
  function read(){try{const raw=storage.getItem(key);if(raw&&raw!==lastRaw){const value=JSON.parse(raw);if(value.version!==1||!Array.isArray(value.seen)||value.seen.length>20000||!value.seen.every(valid))throw Error('Invalid history');value.seen.forEach(id=>seen.add(id));lastRaw=raw;}}catch{durable=false;damaged=true;}}
  function save(){if(!active()||damaged)return;try{const raw=JSON.stringify({version:1,seen:[...seen]});storage.setItem(key,raw);lastRaw=raw;}catch{durable=false;}}
  read();try{const saved=JSON.parse(session.getItem(key));if(saved&&valid(saved.id)&&typeof saved.replay==='boolean')current=saved;}catch{}
  function draw(id,resume=false){id=String(id);if(!valid(id)||!active())return;read();if(resume&&current?.id===id){if(!seen.has(id)){seen.add(id);save();}return;}current={id,replay:seen.has(id)};seen.add(id);save();try{session.setItem(key,JSON.stringify(current));}catch{durable=false;}}
  function seed(ids){if(!active())return;read();for(const id of ids.map(String))if(valid(id))seen.add(id);save();}
  function status(ids){read();const pool=[...new Set(ids.map(String))];return{total:pool.length,remaining:pool.filter(id=>!seen.has(id)).length,replay:!!current?.replay,durable:durable&&!damaged};}
  function unseen(items,id=x=>x.id){if(!active())return items;read();const fresh=items.filter(x=>!seen.has(String(id(x))));return fresh.length?fresh:items;}
  function select(items,id=x=>x.id,group=()=> ''){
   if(!active())return items;read();const monday=week(typeof options.day==='function'?options.day():today()),batchKey=WEEKLY_PREFIX+owner+':'+game;
   try{const raw=storage.getItem(batchKey);if(raw&&raw!==batchRaw){const saved=JSON.parse(raw);if(!saved||!/^\d{4}-\d{2}-\d{2}$/.test(saved.week)||week(saved.week)!==saved.week||!Array.isArray(saved.ids)||saved.ids.length>LIMIT||!saved.ids.every(valid)||new Set(saved.ids).size!==saved.ids.length)throw Error('Invalid weekly selection');batch=saved;batchRaw=raw;}}catch{durable=false;batchDamaged=true;}
   if(!batch||batch.week!==monday)batch={week:monday,ids:[]};
   const catalog=new Map(items.map(item=>[String(id(item)),item]).filter(([key])=>valid(key))),chosen=new Set(batch.ids);
   // Retired content cannot strand a player after a genuine catalogue replacement.
   if(batch.ids.length&&!batch.ids.some(key=>catalog.has(key))&&![...catalog.keys()].some(key=>seen.has(key))){batch={week:monday,ids:[]};chosen.clear();}
   const groups=new Map();if(batch.ids.length<LIMIT)for(const [key,item]of catalog)if(!seen.has(key)&&!chosen.has(key)){const kind=String(group(item));if(!groups.has(kind))groups.set(kind,[]);groups.get(kind).push(key);}
   const queues=[...groups].sort(([a],[b])=>a.localeCompare(b)).map(([,keys])=>keys.sort((a,b)=>hash(monday+game+a)-hash(monday+game+b)||a.localeCompare(b)));
   const before=batch.ids.length;while(batch.ids.length<LIMIT&&queues.some(q=>q.length))for(const queue of queues){if(queue.length&&batch.ids.length<LIMIT){const key=queue.shift();batch.ids.push(key);chosen.add(key);}}
   if(before!==batch.ids.length||batchRaw===null||batchRaw!==JSON.stringify(batch)){try{if(!batchDamaged){const raw=JSON.stringify(batch);storage.setItem(batchKey,raw);batchRaw=raw;}}catch{durable=false;}}
   return items.filter(item=>chosen.has(String(id(item)))||seen.has(String(id(item))));
  }
  function show(host,ids,id){if(!active())return;draw(id,true);const state=status(ids),box=host.ownerDocument.createElement('section');box.className='unlimited-library';box.setAttribute('aria-label','Unlimited puzzle library');box.dataset.exhausted=String(state.total>0&&state.remaining===0);box.dataset.replay=String(state.replay);
   const title=host.ownerDocument.createElement('strong');title.textContent=state.replay?'REPLAY':'NEW CHALLENGE';
   const detail=host.ownerDocument.createElement('p');detail.setAttribute('role','status');detail.hidden=state.remaining>0;detail.textContent=state.total===0?"No challenges currently match the next-round settings. Your current challenge is unchanged.":state.replay?"No unseen challenges remain in this week's selection for these settings today. Keep playing replays.":"This is the last unseen challenge currently available in this week's selection for these settings. Keep playing replays afterwards.";
   const note=host.ownerDocument.createElement('small');note.hidden=state.durable;note.textContent='Weekly selection history could not be saved reliably on this browser.';box.classList.toggle('unlimited-library-compact',state.remaining>0&&state.durable);box.dataset.total=String(state.total);box.dataset.remaining=String(state.remaining);box.append(title,detail,note);host.prepend(box);return state;
  }
  return Object.freeze({draw,seed,status,unseen,select,show});
 }
 root.BREAK_ROOM_UNLIMITED_LIBRARY=Object.freeze({PREFIX,WEEKLY_PREFIX,LIMIT,week,create});
})(typeof window==='undefined'?globalThis:window);
