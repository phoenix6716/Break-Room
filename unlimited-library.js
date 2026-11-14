/* Private account history with a retained local recovery ledger. Never grants paid access. */
(root=>{'use strict';
 const PREFIX='break-room:unlimited-library:v1:',WEEKLY_PREFIX='break-room:weekly-selection:v1:',LIMIT=100;
 function week(day){const date=new Date(day+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(+date)||date.toISOString().slice(0,10)!==day)throw Error('Invalid Sydney date');date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);return date.toISOString().slice(0,10);}
 function today(){return root.MIDNIGHT_ARCADE_CLOCK?.dayKey()||new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
 function hash(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
 const actor=()=>{try{return root.localStorage.getItem('br:cloud:owner')||'guest';}catch{return'guest';}};
 const libraries=new Map();
 function create(game,options={}){
  const owner=options.owner||actor(),getStore=name=>{try{return root[name];}catch{return null;}},storage=options.storage||getStore('localStorage'),session=options.session||getStore('sessionStorage'),key=PREFIX+owner+':'+game;
  let cloud=null,cloudTask=null,queue=Promise.resolve(),cloudError=false,shownPromise=null,permit=false,advancing=false,advanceEpoch=0;const dailyObserved=new Set();
  const account=()=>{try{return root.BREAK_ROOM_ACCOUNTS||root.parent?.BREAK_ROOM_ACCOUNTS;}catch{return null;}};
  const remote=()=>!options.owner&&account()?.getUser()?.id===owner&&typeof account()?.contentRequest==='function';
  const request=body=>{if(!active()||!remote())throw Error('Account changed');return account().contentRequest({game,...body},owner);};
  const emit=()=>root.dispatchEvent?.(new Event('break-room:library-change'));
  function accept(value){if(!active()||!remote())throw Error('Account changed');if(!Array.isArray(value.seen)||!Array.isArray(value.ids))throw Error('Invalid history reply');value.seen.forEach(id=>seen.add(id));cloud=value;cloudError=false;save();return value;}
  function prepare(allocate=true){
   if(!remote())return Promise.resolve();
   if(cloudTask)return cloudTask.then(()=>allocate&&!cloud?.ids.length?prepare(true):undefined);
   read();const imported=[...seen];
   cloudTask=queue.then(()=>request({action:'sync',seen:imported,allocate})).then(accept).catch(e=>{cloudError=true;throw e;}).finally(()=>{cloudTask=null;});
   queue=cloudTask.catch(()=>{});return cloudTask;
  }
  function exposure(id,selection){
   if(!remote())return null;
   const job=queue.then(()=>request({action:'shown',id,allocate:selection})).then(value=>{accept(value);return value.replay;}).catch(e=>{cloudError=true;throw e;});
   queue=job.catch(()=>{});return job;
  }
  function advance(resume){
   if(!active())return false;if(!remote())return !(owner!=='guest'&&typeof account()?.contentRequest==='function');if(permit){permit=false;return true;}if(advancing)return false;
   advancing=true;const epoch=advanceEpoch;prepare(true).then(()=>{if(epoch!==advanceEpoch||!active()||!remote())return;permit=true;try{resume();}finally{permit=false;}}).catch(()=>{
    const box=root.document?.querySelector('.unlimited-library');if(box){let note=box.querySelector('small');if(note){note.hidden=false;note.textContent='Question history could not sync. Your current round is safe. Try Next again when connected.';}}}).finally(()=>{advancing=false;});return false;
  }
  function observe(id){if(id===undefined||id===null||!active())return;id=String(id);if(!valid(id)||dailyObserved.has(id))return;dailyObserved.add(id);
   const boot=account()?.ready||(root.document&&root.document.readyState!=='complete'?new Promise(resolve=>root.document.addEventListener('DOMContentLoaded',()=>resolve(account()?.ready),{once:true})):Promise.resolve());Promise.resolve(boot).then(()=>{if(!remote())return;if(!cloud)return prepare(false);}).then(()=>{if(!remote())return;const job=exposure(id,false);job?.catch(()=>{if(active()&&remote()){seen.add(id);save();dailyObserved.delete(id);}});}).catch(()=>{dailyObserved.delete(id);});
  }
  let seen=new Set(),current=null,durable=true,damaged=false,lastRaw=null,batch=null,batchRaw=null,batchDamaged=false;
  const active=()=>options.owner?true:actor()===owner;
  const valid=id=>typeof id==='string'&&id.length>0&&id.length<=200;
  function read(){try{const raw=storage.getItem(key);if(raw&&raw!==lastRaw){const value=JSON.parse(raw);if(value.version!==1||!Array.isArray(value.seen)||value.seen.length>20000||!value.seen.every(valid))throw Error('Invalid history');value.seen.forEach(id=>seen.add(id));lastRaw=raw;}}catch{durable=false;damaged=true;}}
  function save(){if(!active()||damaged)return;try{const raw=JSON.stringify({version:1,seen:[...seen]});storage.setItem(key,raw);lastRaw=raw;}catch{durable=false;}}
  read();try{const saved=JSON.parse(session.getItem(key));if(saved&&valid(saved.id)&&typeof saved.replay==='boolean')current={id:saved.id,replay:saved.replay};}catch{}
  function draw(id,resume=false){id=String(id);if(!valid(id)||!active())return;read();if(resume&&current?.id===id){if(!seen.has(id)){seen.add(id);save();}return;}current={id,replay:seen.has(id)};const captured=current;shownPromise=exposure(id,true);if(shownPromise){captured.pending=true;shownPromise.then(replay=>{if(current===captured){current.replay=replay;current.pending=false;emit();}}).catch(()=>{if(current===captured){current.pending=false;current.unchecked=true;emit();}});}seen.add(id);save();try{session.setItem(key,JSON.stringify(current));}catch{durable=false;}}
  function seed(ids){if(!active())return;read();for(const id of ids.map(String))if(valid(id))seen.add(id);save();}
  function status(ids){read();const pool=[...new Set(ids.map(String))];return{total:pool.length,remaining:pool.filter(id=>!seen.has(id)).length,replay:!!current?.replay,durable:durable&&!damaged};}
  function unseen(items,id=x=>x.id){if(!active())return items;read();const fresh=items.filter(x=>!seen.has(String(id(x))));return fresh.length?fresh:items;}
  function select(items,id=x=>x.id,group=()=> ''){
   if(!active())return items;read();if(remote()){if(!cloud)return items.filter(item=>seen.has(String(id(item))));const chosen=new Set(cloud.ids);return items.filter(item=>chosen.has(String(id(item)))||seen.has(String(id(item))));}const monday=week(typeof options.day==='function'?options.day():today()),batchKey=WEEKLY_PREFIX+owner+':'+game;
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
   const title=host.ownerDocument.createElement('strong');const label=()=>title.textContent=remote()&&(current?.pending||current?.unchecked||cloudError)?(current?.pending?'CHECKING HISTORY':'HISTORY OFFLINE'):state.replay?'REPLAY':'NEW CHALLENGE';label();
   if(remote()&&shownPromise){const captured=current;shownPromise.finally(()=>{if(current===captured){state.replay=!!current.replay;box.dataset.replay=String(state.replay);label();if(cloudError){note.hidden=false;note.textContent='Account question history could not sync. Your current round is safe; reload when connected.';}if(state.remaining===0&&state.replay)detail.textContent="No unseen challenges remain in this week's selection for these settings today. Keep playing replays.";}}).catch(()=>{});}
   const detail=host.ownerDocument.createElement('p');detail.setAttribute('role','status');detail.hidden=state.remaining>0;detail.textContent=state.total===0?"No challenges currently match the next-round settings. Your current challenge is unchanged.":state.replay?"No unseen challenges remain in this week's selection for these settings today. Keep playing replays.":"This is the last unseen challenge currently available in this week's selection for these settings. Keep playing replays afterwards.";
   const note=host.ownerDocument.createElement('small');note.hidden=state.durable&&!cloudError;note.textContent=cloudError?'Account question history could not sync. Your current round is safe; reload when connected.':'Weekly selection history could not be saved reliably on this browser.';box.classList.toggle('unlimited-library-compact',state.remaining>0&&state.durable);box.dataset.total=String(state.total);box.dataset.remaining=String(state.remaining);box.append(title,detail,note);host.prepend(box);return state;
  }
  const library=Object.freeze({draw,seed,status,unseen,select,show,prepare,observe,advance,generation:()=>advanceEpoch,cancelPending:()=>{advanceEpoch++;permit=false;}});libraries.set(game,library);return library;
 }
 root.BREAK_ROOM_UNLIMITED_LIBRARY=Object.freeze({PREFIX,WEEKLY_PREFIX,LIMIT,week,create,cancelPending:()=>libraries.forEach(l=>l.cancelPending()),prepare:game=>libraries.get(game)?.prepare(true)||Promise.resolve()});
})(typeof window==='undefined'?globalThis:window);
