/* Physical feedback around native engines. No storage, audio, scores or timers. */
(() => {
 'use strict';
 const scene=document.body.dataset.gameScene;
 if(!scene)return;
 const root=document.querySelector('#engine-slot')||document.querySelector('#game-panel')||document.querySelector('.card');
 if(!root)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),animations=new Set();
 let armed=false,pending=false,before=null;
 const running=()=>scene==='inner-clock'&&document.body.classList.contains('clock-running');
 const identity=()=>[
  document.querySelector('[role=tab][aria-selected=true]')?.id||'',
  root.dataset.questionId||root.dataset.eventId||root.dataset.puzzleId||root.dataset.boardId||
   root.querySelector('[data-board-id]')?.dataset.boardId||
   document.querySelector('#cards')?.dataset.stackId||
   document.querySelector('#counterItemNumber')?.textContent||'',
  scene==='inner-clock'?root.dataset.round||'':''
 ].join(':');
 const phase=()=>root.dataset.phase||
  (root.querySelector('.laser-feedback,.pack-result,.sw-review')?'review':
   document.querySelector('.result-modal.open,#resultArea.show')?'review':'play');
 const summary=()=>!!document.querySelector('#td-summary,#cl-summary,.sc-summary,.sw-summary,#dc-summary-heading,.laser-final-score,.clock-total,#finalScreen.show,#daily-summary:not([hidden])');
 const result=()=>document.querySelector('.td-review,.cl-review,.sc-review,.sw-review,.dc-review,.laser-feedback,.pack-result,.clock-review,.result-modal.open .result-card,#resultArea.show');
 function cancel(){for(const a of animations)a.cancel();animations.clear();}
 function play(node,frames,options={}){
  if(!node||reduce.matches||running()||document.hidden||typeof node.animate!=='function')return;
  const a=node.animate(frames,{duration:230,easing:'cubic-bezier(.2,.8,.2,1)',...options});
  animations.add(a);a.finished.then(()=>animations.delete(a),()=>animations.delete(a));
 }
 function props(){
  // An original score-tower prop replaces the old radar; real scores stay in the native tiles.
  const radar=root.querySelector('.sleeper-radar');
  if(radar){
   const box=document.createElement('div');box.innerHTML='<svg class="scene-score-tower scene-set-dressing" viewBox="0 0 300 180" fill="none" aria-hidden="true" focusable="false"><path d="M77 166h166v8H77z" fill="#17263a"/><path d="M93 25h124v136H93z" fill="#17263a"/><path d="M87 19h124v136H87z" fill="#fffaf0" stroke="#17263a" stroke-width="3"/><path d="M102 34h94v16h-94z" fill="#edc465" stroke="#17263a" stroke-width="3"/><path d="M102 56h94v16h-94z" fill="#b39ac9" stroke="#17263a" stroke-width="3"/><path d="M102 78h94v16h-94z" fill="#9cbfce" stroke="#17263a" stroke-width="3"/><path d="M102 100h94v16h-94z" fill="#bcd4cd" stroke="#17263a" stroke-width="3"/><path d="M102 122h94v16h-94z" fill="#e0dad2" stroke="#17263a" stroke-width="3"/><path d="m224 12 6 15 16 1-12 11 4 16-14-9-14 9 4-16-12-11 16-1z" fill="#edc465" stroke="#17263a" stroke-width="3"/><path d="M51 111h93v41H51z" fill="#17263a"/><path d="M45 105h93v41H45z" fill="#d6e5e7" stroke="#17263a" stroke-width="3"/><path d="M57 119h65M57 131h42M52 53h17m-9-8v16M240 98h18m-9-9v18" stroke="#17263a" stroke-width="3"/></svg>';
   radar.replaceWith(box.firstElementChild);
  }
 }
 function pieces(){
  const map=new Map();
  root.querySelectorAll('.sort-card[data-value],.sw-piece[data-piece],.cl-climber,.sc-seat:not(.empty)').forEach(el=>{
   // Seat identity follows the person, so swaps travel between their actual places.
   const key=el.classList.contains('sc-seat')?'guest:'+el.querySelector('span')?.textContent:
    el.classList.contains('cl-climber')?'climber':el.dataset.value?'card:'+el.dataset.value:'furniture:'+el.dataset.piece;
   if(!key)return;const rect=el.getBoundingClientRect();
   if(rect.width&&rect.height)map.set(key,{el,x:rect.x,y:rect.y});
  });
  return map;
 }
 function snapshot(){return{id:identity(),phase:phase(),summary:summary(),pieces:scene==='inner-clock'?new Map():pieces()};}
 let last;
 function flush(){
  pending=false;props();
  const now=snapshot(),old=before||last;
  if(armed&&old&&!running()&&!reduce.matches){
   if(old.id===now.id){
    for(const [key,p]of now.pieces){
     const q=old.pieces.get(key);if(!q){if(scene==='seating-chart')play(p.el,[{opacity:.5,scale:'.85'},{opacity:1,scale:'1'}],{duration:180});continue;}
     const dx=q.x-p.x,dy=q.y-p.y;if(Math.abs(dx)+Math.abs(dy)<2)continue;
     const transform=getComputedStyle(p.el).transform,final=transform==='none'?'':transform;
     play(p.el,[{transform:'translate('+dx+'px,'+dy+'px) '+final},{transform:final||'none'}],{duration:200});
    }
   }else{
    const incoming=root.querySelector('.td-card,.cl-card,.sc-layout,.sw-stage,.pack-workbench,.laser-stage')||
     document.querySelector('#cards,.product-display');
    play(incoming,[{opacity:.65,translate:'0 8px'},{opacity:1,translate:'0 0'}]);
   }
   if(old.phase!==now.phase&&now.phase==='review'){
    const card=result();
    // Paper prints, a date is stamped, and the other surfaces settle in place.
    if(scene==='time-drop')play(card,[{opacity:.6,translate:'0 8px',rotate:'-1deg'},{opacity:1,translate:'0 0',rotate:'0deg'}]);
    else if(scene==='lowball-counter')play(card,[{opacity:.6,clipPath:'inset(0 0 15% 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}]);
    else play(card,[{opacity:.65,translate:'0 6px'},{opacity:1,translate:'0 0'}]);
   }
   if(!old.summary&&now.summary){
    const target=root.querySelector('.arcade-score,.clock-total,.td-total,.cl-total,.pack-score,#summary-score');
    play(target,[{opacity:.6,scale:'.97'},{opacity:1,scale:'1'}]);
   }
   if(scene==='pack'){
    // Animate only newly added contents; their labels and values remain native.
    root.querySelectorAll('.bag-tag').forEach(el=>{
     if(before?.tags&&!before.tags.has(el.textContent))play(el,[{opacity:.5,translate:'0 -8px'},{opacity:1,translate:'0 0'}],{duration:180});
    });
   }
  }
  last=now;before=null;armed=false;
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(flush);}}
 function capture(event){
  if(event.type==='keydown'&&!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(event.key))return;
  if(!root.contains(event.target)&&!event.target.closest?.('.br-mode-tabs'))return;
  if(!armed){before=snapshot();if(scene==='pack')before.tags=new Set([...root.querySelectorAll('.bag-tag')].map(e=>e.textContent));}
  armed=true;schedule();
 }
 props();last=snapshot();
 // Keep the timing game's measurement ahead of all presentation work.
 if(scene==='inner-clock'){
  for(const type of ['click','keydown','pointerup','submit'])document.addEventListener(type,event=>{
   if(root.contains(event.target)){armed=!running();schedule();}
  },{passive:true});
  new MutationObserver(()=>{if(running()){armed=false;cancel();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 }else{
  for(const type of ['pointerdown','keydown','click','submit','drop'])document.addEventListener(type,capture,{capture:true,passive:true});
 }
 new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['data-phase','data-question-id','data-event-id','data-puzzle-id','data-board-id','data-stack-id','class']});
 function remote(){armed=false;before=null;cancel();schedule();}
 window.addEventListener('storage',remote);
 window.addEventListener('break-room:saves-loaded',remote);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)remote();});
 reduce.addEventListener('change',()=>{if(reduce.matches)cancel();});
 document.body.dataset.sceneReady='true';
})();
