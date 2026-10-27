/* Original decorative objects. Selection uses visible labels, never hidden answers or scores. */
(()=>{
'use strict';
const id=document.body.dataset.gameArt,art=window.BREAK_ROOM_ART_FILES;
if(!id||!art)return;
const base=new URL('assets/game-art/',document.currentScript.src);
const url=file=>new URL(file+'?v=objects-20261027',base).href;
const own=(map,key)=>Object.prototype.hasOwnProperty.call(map,key)?map[key]:null;
function image(file,cls=''){const e=document.createElement('img');e.src=url(file);e.className='native-game-art '+cls;e.alt='';e.setAttribute('aria-hidden','true');e.width=64;e.height=64;e.decoding='async';e.draggable=false;return e;}
if(id==='inner-clock'){
 let loaded=false;
 const activate=()=>{if(loaded&&!document.body.classList.contains('clock-running'))document.body.dataset.clockArtLoaded='true';};
 const preload=new Image();preload.src=url('timing/stopwatch.svg');preload.decode().then(()=>{loaded=true;activate();}).catch(()=>{});
 new MutationObserver(activate).observe(document.body,{attributes:true,attributeFilter:['class']});
 document.body.dataset.gameArtReady='true';return;
}
if(id==='lowball'){document.body.dataset.gameArtReady='true';return;}
const root=document.querySelector('#engine-slot')||document.querySelector('#game-panel');
if(!root)return;
function replace(el,file,cls=''){if(!el||el.dataset.objectArt)return;el.replaceChildren(image(file,cls));el.dataset.objectArt='true';}
function decorate(){
 if(id==='stack-up')root.querySelectorAll('.sort-card').forEach(card=>{
  const category=document.querySelector('#category-tag')?.textContent.trim(),name=card.querySelector('.card-name')?.textContent.trim();
  replace(card.querySelector('.card-symbol'),own(art.subjects,category+'|'+name)||own(art.topics,category)||'motifs/scroll.svg');
 });
 if(id==='seating-chart'){
  const guests=[...root.querySelectorAll('.sc-pool button')],names=(guests.length?guests.map(e=>e.dataset.artGuest||e.firstChild?.textContent.trim()):[...root.querySelectorAll('.sc-seat:not(.empty)>span')].map(e=>e.textContent.trim())).filter(Boolean).sort();
  const portrait=name=>art.portraits[(Math.max(0,names.indexOf(name))*3)%art.portraits.length];
  guests.forEach(e=>{if(e.dataset.artGuest)return;const name=e.firstChild.textContent.trim(),copy=document.createElement('span');copy.className='native-guest-copy';while(e.firstChild)copy.append(e.firstChild);e.append(image(portrait(name),'native-portrait'),copy);e.dataset.artGuest=name;});
  root.querySelectorAll('.sc-seat:not(.empty)').forEach(e=>{if(e.querySelector('.native-portrait'))return;const name=e.querySelector('span')?.textContent.trim();e.prepend(image(portrait(name),'native-portrait'));});
 }
 if(id==='shift-work')root.querySelectorAll('.sw-piece').forEach((e,i)=>{
  const old=e.querySelector('svg');if(!old)return;const label=e.getAttribute('aria-label'),len=/3 spaces/.test(label)?3:2,horizontal=/horizontal/.test(label);
  old.replaceWith(image(i===0?'furniture/trolley.svg':'furniture/'+(horizontal?'desk':'cabinet')+'-'+len+'-'+i%2+'.svg','native-furniture-art'));
 });
 if(id==='laser'){
  root.querySelectorAll('.laser-mirror').forEach(e=>replace(e,e.closest('.fixed')?'laser/fixed-mirror.svg':'laser/mirror.svg'));
  root.querySelectorAll('.laser-bullseye').forEach(e=>replace(e,'laser/receiver.svg'));
  root.querySelectorAll('.laser-block').forEach(e=>replace(e,'laser/wall.svg'));
  root.querySelectorAll('.laser-entry').forEach(e=>replace(e,'laser/emitter.svg'));
 }
 if(id==='clue-ladder'){
  root.querySelectorAll('.cl-climber').forEach(e=>replace(e,'clues/climber.svg'));
  root.querySelectorAll('.cl-rung.locked').forEach(e=>{if(!e.querySelector('.native-lock'))e.append(image('motifs/lock.svg','native-lock'));});
 }
 if(id==='hidden-gem'){
  const topic=root.querySelector('.dc-round-top .dc-kicker')?.textContent.trim()||root.querySelector('.dc-kicker')?.textContent.trim()||'';
  const key=Object.keys(art.topics).find(k=>topic.includes(k));
  root.querySelectorAll('svg.hg-topic-art').forEach(e=>e.replaceWith(image(own(art.topics,key)||'motifs/magnifier.svg',e.getAttribute('class'))));
 }
 if(id==='time-drop'){
  const tag=root.querySelector('#era-tag'),file=tag&&own(art.eras,tag.textContent.trim());
  if(file&&!tag.querySelector('img'))tag.append(image(file,'native-era-art'));
 }
}
decorate();new MutationObserver(decorate).observe(root,{childList:true,subtree:true});
document.body.dataset.gameArtReady='true';
})();
