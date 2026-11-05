/* Achievement notices use real completed Daily records; never write game saves. */
(()=>{
 'use strict';if(window!==window.top)return;
 const base=new URL('.',document.currentScript.src),prefix='br:achievement-notices:v1:';
 let completion=null,waiting=false,returnFocus=null,owner='',epoch=0,earned=new Set(),seen=new Set(),timer=null,hideTimer=null,toast=null,live=null,items=[],closed=true;
 const popoverOpen=()=>!!toast&&typeof toast.showPopover==='function'&&toast.matches(':popover-open');
 const partition=()=>{try{return localStorage.getItem('br:cloud:owner')||'guest';}catch{return 'guest';}};
 const model=()=>{try{const m=BREAK_ROOM_RECORDS.active(BREAK_ROOM_RECORDS.read(localStorage));return m.unavailable?null:m;}catch{return null;}};
 function stored(){try{const a=JSON.parse(localStorage.getItem(prefix+owner)||'[]');return new Set(Array.isArray(a)?a.filter(x=>typeof x==='string'):[]);}catch{return new Set();}}
 function remember(ids){for(const id of stored())seen.add(id);for(const id of ids)seen.add(id);try{localStorage.setItem(prefix+owner,JSON.stringify([...seen]));}catch{}}
 function close(){clearTimeout(hideTimer);closed=true;items=[];if(!toast)return;const focused=toast.contains(document.activeElement);if(popoverOpen())toast.hidePopover();toast.hidden=true;live.textContent='';if(focused){const target=returnFocus?.isConnected&&returnFocus.getClientRects().length&&!returnFocus.closest('[inert],[hidden]')?returnFocus:host().querySelector('button:not(:disabled),a[href],input:not(:disabled)');target?.focus({preventScroll:true});}}
 function currentCompletion(){
  try{const id=location.pathname.match(/\/games\/([^/]+)\//)?.[1],day=MIDNIGHT_ARCADE_CLOCK.dayKey();if(!id)return null;
   const allowed=id==='lowball'?['pc_history','pc_last','pc_last_avg']:['break-room:'+id+':daily:'+day],keys=allowed.filter(k=>localStorage.getItem(k)!==null);
   const view={length:keys.length,key:i=>keys[i]??null,getItem:k=>allowed.includes(k)?localStorage.getItem(k):null};
   const done=BREAK_ROOM_RECORDS.read(view,day).records.some(r=>r.game===id&&r.date===day);
   return day+':'+(done?'complete':'pending');
  }catch{return null;}
 }
 function baseline(){waiting=false;epoch++;clearTimeout(timer);close();owner=partition();seen=stored();completion=currentCompletion();const m=model();earned=new Set(m?.achievements.filter(a=>a.earned).map(a=>a.id)||[]);if(m)remember(earned);}
 function host(){const modals=[...document.querySelectorAll('dialog[open],[aria-modal="true"]')].filter(n=>n.getClientRects().length&&!n.closest('[hidden],[aria-hidden="true"],[inert]'));return modals.at(-1)||document.body;}
 function place(){if(closed||!toast)return;const parent=host();toast.inert=false;live.inert=false;if(live.parentElement!==parent)parent.append(live);if(toast.parentElement===parent)return;const open=popoverOpen();if(open)toast.hidePopover();parent.append(toast);if(typeof toast.showPopover==='function')try{toast.showPopover();}catch{}}
 function pause(){clearTimeout(hideTimer);}
 function resume(){pause();if(!closed&&!document.hidden&&!toast.matches(':hover')&&!toast.contains(document.activeElement))hideTimer=setTimeout(close,8500);}
 function setup(){if(toast)return;
  toast=document.createElement('aside');toast.className='br-achievement-toast';toast.hidden=true;toast.setAttribute('aria-label','New achievements');if(typeof toast.showPopover==='function')toast.setAttribute('popover','manual');
  const header=document.createElement('div');header.className='br-achievement-header';const icon=document.createElement('img');icon.src=new URL('assets/icons/trophy.svg',base);icon.alt='';const title=document.createElement('strong');title.className='br-achievement-heading';const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='br-achievement-close';dismiss.setAttribute('aria-label','Dismiss achievement notification');dismiss.textContent='×';dismiss.onclick=close;header.append(icon,title,dismiss);
  const list=document.createElement('ul');list.className='br-achievement-list';const link=document.createElement('a');link.href=new URL('profile.html#achievements-title',base);link.textContent='View achievements →';toast.append(header,list,link);
  live=document.createElement('div');live.className='br-achievement-announcer';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');document.body.append(live);
  toast.addEventListener('pointerenter',pause);toast.addEventListener('pointerleave',resume);toast.addEventListener('focusin',pause);toast.addEventListener('focusout',()=>setTimeout(resume,0));
  new MutationObserver(()=>{if(!closed)place();}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open','hidden','aria-hidden','inert','class']});
 }
 function show(unlocks){setup();if(closed)returnFocus=document.activeElement;items=[...items,...unlocks.filter(a=>!items.some(b=>b.id===a.id))];closed=false;
  toast.querySelector('.br-achievement-heading').textContent=items.length===1?'Achievement unlocked!':items.length+' achievements unlocked!';
  toast.querySelector('.br-achievement-list').replaceChildren(...items.map(a=>{const li=document.createElement('li');li.dataset.achievement=a.id;const name=document.createElement('strong'),detail=document.createElement('span');name.textContent=a.name;detail.textContent=a.detail;li.append(name,detail);return li;}));
  toast.hidden=false;place();if(typeof toast.showPopover==='function'&&!popoverOpen())try{toast.showPopover();}catch{}
  live.textContent='Achievement unlocked: '+unlocks.map(a=>a.name+'. '+a.detail).join(' ');resume();
 }
 async function check(){if(document.hidden){waiting=true;return;}waiting=false;if(partition()!==owner){baseline();return;}const generation=epoch,id=owner;
  const award=()=>{if(generation!==epoch||id!==partition())return;const next=currentCompletion();if(next===completion)return;completion=next;if(!next?.endsWith(':complete'))return;const m=model();if(!m)return;const now=m.achievements.filter(a=>a.earned),unlocks=now.filter(a=>!earned.has(a.id));earned=new Set(now.map(a=>a.id));for(const k of stored())seen.add(k);const fresh=unlocks.filter(a=>!seen.has(a.id));if(!fresh.length)return;remember(fresh.map(a=>a.id));show(fresh);};
  if(navigator.locks?.request)await navigator.locks.request(prefix+id,award);else award();
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(()=>{check().catch(()=>{});},100);}
 function init(){baseline();window.addEventListener('break-room:save',schedule);window.addEventListener('break-room:auth-change',()=>{if(partition()!==owner)baseline();});window.addEventListener('break-room:saves-loaded',baseline);
  window.addEventListener('storage',e=>{if(e.key==='br:cloud:owner'||e.key==='br:cloud:generation')baseline();else if(e.key===prefix+owner){for(const id of stored())seen.add(id);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else{if(waiting)schedule();resume();}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
