/* Device preferences only: never part of a gameplay or cloud save. */
(()=>{'use strict';
 const keys={sound:'break-room:game-sound',volume:'break-room:game-volume',motion:'break-room:motion'},memory={};let durable=true;
 const read=k=>{try{return localStorage.getItem(k);}catch{durable=false;return memory[k]??null;}};
 const write=(k,v)=>{memory[k]=v;try{localStorage.setItem(k,v);}catch{durable=false;}};
 const legacy=read('pc_sound');if(!['on','off'].includes(read(keys.sound))&&['0','1'].includes(legacy))write(keys.sound,legacy==='1'?'on':'off');
 let state={sound:read(keys.sound)==='on',volume:1,motion:read(keys.motion)==='reduce'?'reduce':'system'};
 const savedVolume=read(keys.volume);if(savedVolume!==null&&Number.isFinite(Number(savedVolume)))state.volume=Math.max(0,Math.min(1,Number(savedVolume)));
 const nativeMatch=window.matchMedia.bind(window),device=nativeMatch('(prefers-reduced-motion: reduce)'),queries=new Map();
 const reduced=()=>state.motion==='reduce'||device.matches;
 function paint(){document.documentElement.toggleAttribute('data-reduce-motion',state.motion==='reduce');}
 // Existing game controllers and CSS share the same effective motion preference.
 window.matchMedia=query=>{
  if(!/^\(prefers-reduced-motion:\s*(reduce|no-preference)\)$/.test(query))return nativeMatch(query);
  if(queries.has(query))return queries.get(query).list;
  const target=new EventTarget(),reduce=/:\s*reduce/.test(query),legacyListeners=new Map();let prior=reduce?reduced():!reduced();
  const list=Object.assign(target,{media:query,onchange:null,addListener(fn){if(!fn||legacyListeners.has(fn))return;const cb=e=>fn.call(list,e);legacyListeners.set(fn,cb);target.addEventListener('change',cb);},removeListener(fn){target.removeEventListener('change',legacyListeners.get(fn));legacyListeners.delete(fn);}});
  Object.defineProperty(list,'matches',{get:()=>reduce?reduced():!reduced()});
  queries.set(query,{list,notify(){if(prior===list.matches)return;prior=list.matches;const event=new Event('change');Object.defineProperties(event,{matches:{value:list.matches},media:{value:query}});list.dispatchEvent(event);if(typeof list.onchange==='function')list.onchange.call(list,event);}});return list;
 };
 function notify(){paint();for(const q of queries.values())q.notify();window.dispatchEvent(new CustomEvent('break-room:preferences',{detail:{...state,durable}}));}
 function set(next){
  if(typeof next.sound==='boolean'){state.sound=next.sound;write(keys.sound,state.sound?'on':'off');write('pc_sound',state.sound?'1':'0');}
  if(typeof next.volume==='number'&&Number.isFinite(next.volume)){state.volume=Math.max(0,Math.min(1,next.volume));write(keys.volume,String(state.volume));}
  if(['system','reduce'].includes(next.motion)){state.motion=next.motion;write(keys.motion,state.motion);}
  notify();return {...state,durable};
 }
 window.addEventListener('storage',event=>{
  if(event.key===keys.sound||event.key===null)state.sound=read(keys.sound)==='on';
  if(event.key==='pc_sound'&&['0','1'].includes(event.newValue))return set({sound:event.newValue==='1'});
  if(event.key===keys.volume||event.key===null){const v=read(keys.volume);state.volume=v!==null&&Number.isFinite(Number(v))?Math.max(0,Math.min(1,Number(v))):1;}
  if(event.key===keys.motion||event.key===null)state.motion=read(keys.motion)==='reduce'?'reduce':'system';
  if(Object.values(keys).includes(event.key)||event.key===null)notify();
 });
 device.addEventListener('change',notify);paint();
 window.BREAK_ROOM_PREFERENCES=Object.freeze({get:()=>({...state,durable}),set});
})();
