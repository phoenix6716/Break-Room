/* Stack Up: one saved daily run, wall-clock timers, and free practice. */
(() => {
 'use strict';
 const P=window.BREAK_ROOM_PRACTICE,$=id=>document.getElementById(id),clock=window.MIDNIGHT_ARCADE_CLOCK;
 const pool=[...window.STACK_UP_STACKS,...window.STACK_UP_FAMILIAR_STACKS], prefix='break-room:stack-up:daily:',version=2;
 const memory=new Map();let persistent=true,run=null,mode='daily',dialog=null,feedbackTimer=null,warnedDeadline=null;let practiceRun=null,practiceCategory='familiar';const stackDeck=P.deck(s=>s.id||s.prompt);
 const read=key=>{if(!persistent&&memory.has(key))return memory.get(key);try{return localStorage.getItem(key)||memory.get(key)||null}catch{return memory.get(key)||null}};
 function write(key,value){memory.set(key,value);try{localStorage.setItem(key,value);window.dispatchEvent(new Event("break-room:save"))}catch{persistent=false;$('save-warning').hidden=false;}}
 try{localStorage.setItem('break-room:stack-up:storage-check','1');localStorage.removeItem('break-room:stack-up:storage-check')}catch{persistent=false;$('save-warning').hidden=false;}
 const format=n=>Math.round(n).toLocaleString('en-AU');
 function seeded(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h+=0x6D2B79F5;let x=Math.imul(h^(h>>>15),1|h);x^=x+Math.imul(x^(x>>>7),61|x);return((x^(x>>>14))>>>0)/4294967296;};}
 function shuffle(items,random=Math.random){const copy=items.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
 function dailySet(day){const familiar=pool.some(s=>s.collection==='familiar');if(familiar&&day>='2026-10-23'){const ordinal=Math.floor(Date.parse(day+'T00:00:00Z')/86400000);return Array.from({length:5},(_,lane)=>{const deck=shuffle(pool.map((s,i)=>({s,i})).filter(x=>x.s.collection==='familiar'&&x.s.lane===lane).sort((a,b)=>a.s.id.localeCompare(b.s.id)),seeded('stack-up:familiar:1:'+lane));return deck[ordinal%deck.length].i;});}const original=pool.map((s,i)=>({s,i})).filter(x=>x.s.collection!=='familiar');return shuffle(original.filter(x=>!x.s.id.startsWith('stack-launch-')).map(x=>x.i),seeded('stack-up:'+day)).slice(0,5);}
 function valid(r,day){return r&&r.version===version&&(!Object.hasOwn(r,'scoreVersion')||[1,2].includes(r.scoreVersion))&&r.day===day&&Number.isInteger(r.round)&&r.round>=0&&r.round<5&&Number.isFinite(r.score)&&Number.isInteger(r.streak)&&r.streak>=0&&Array.isArray(r.results)&&r.results.length<=5&&r.results.every(x=>x&&typeof x.correct==='boolean'&&Number.isFinite(x.points)&&Number.isInteger(x.mistakes)&&x.mistakes>=0)&&['playing','review','complete'].includes(r.status)&&Array.isArray(r.order)&&r.order.length===5&&new Set(r.order).size===5&&r.order.every(x=>Number.isInteger(x)&&x>=1&&x<=5)&&Number.isFinite(r.deadline)&&Number.isInteger(r.mistakes)&&r.mistakes>=0&&(r.status==='playing'?r.results.length===r.round:r.results.length===r.round+1)&&(r.status!=='complete'||r.round===4);}
 function load(day){try{const r=JSON.parse(read(prefix+day));
  // Earlier runs used a twelve-item bank. Freeze their original questions before the bank grows.
  if(r?.version===1&&!r.stacks){const old=window.STACK_UP_LEGACY_STACKS;r.stacks=shuffle(old.map((_,i)=>i),seeded('stack-up:'+day)).slice(0,5).map(i=>old[i]);r.version=version;}
  const snapshots=r?.stacks;
  const validStacks=Array.isArray(snapshots)&&snapshots.length===5&&snapshots.every(s=>s&&typeof s.prompt==='string'&&typeof s.fact==='string'&&Array.isArray(s.ends)&&s.ends.length===2&&Array.isArray(s.cards)&&s.cards.length===5&&s.cards.every((c,i)=>c&&typeof c.name==='string'&&c.value===i+1));
  return validStacks&&valid(r,day)?r:null}catch{return null;}}
 function save(){if(mode==='daily'&&run)write(prefix+run.day,JSON.stringify(run));}
 function stack(){return (mode==='daily'?run.stacks[run.round]:pool[run.stack]);}
 function secondsLeft(){return Math.max(0,Math.min(90,Math.ceil((run.deadline-Date.now())/1000)));}
 function makeRound(){run.order=shuffle([1,2,3,4,5],mode==='daily'?seeded(run.day+':'+run.round):Math.random);if(run.order.every((v,i)=>v===i+1))run.order.push(run.order.shift());run.deadline=Date.now()+90000;run.mistakes=0;run.status='playing';save();}
 function nextPracticeStack(){const excluded=new Set((load(clock.dayKey())?.stacks||dailySet(clock.dayKey()).map(i=>pool[i])).map(s=>s.id||s.prompt)),eligible=pool.filter(s=>!excluded.has(s.id||s.prompt)),choices=eligible.filter(s=>practiceCategory==='familiar'?s.collection==='familiar':practiceCategory==='challenge'?s.collection!=='familiar':practiceCategory==='all'||s.category===practiceCategory);return pool.indexOf(stackDeck.pick(choices.length?choices:eligible));}
 function newRun(nextMode){return{version,scoreVersion:2,day:clock.dayKey(),round:0,score:0,streak:0,results:[],order:[],deadline:0,mistakes:0,status:'playing',stacks:nextMode==='daily'?dailySet(clock.dayKey()).map(i=>pool[i]):null,stack:nextMode==='daily'?0:nextPracticeStack()};}
 function currentDay(){if(mode==='daily'&&run&&run.day!==clock.dayKey()){closeDialog();run=null;start('daily');$('day-notice').hidden=false;return false;}return true;}
 function start(nextMode){if(nextMode===mode&&run&&currentDay())return;closeDialog();if(mode==='infinite'&&run)practiceRun=run;mode=nextMode;run=mode==='daily'?load(clock.dayKey()):practiceRun;if(!run){run=newRun(mode);makeRound();if(mode==='infinite')practiceRun=run;}$('game-interface').hidden=false;$('game-interface').setAttribute('aria-hidden','false');$('day-notice').hidden=true;document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-selected',String(b.dataset.mode===mode));b.tabIndex=b.dataset.mode===mode?0:-1;});$('game-panel').setAttribute('aria-labelledby',mode==='daily'?'mode-daily':'mode-unlimited');render();if(run.status==='playing')tick();else if(run.status==='review')openResult();}
 function render(){
  const complete=run.status==='complete',s=stack();$('cards').dataset.stackId=s.id||s.prompt;const practiceSlot=$('stack-practice');practiceSlot.replaceChildren();if(mode==='infinite')practiceSlot.append(P.panel({id:'stack-topic',label:'Topic',options:[['familiar','Familiar mix'],['challenge','Challenge mix'],['all','All topics'],...[...new Set(pool.map(s=>s.category))].sort().map(c=>[c,c])],value:practiceCategory,onChange:v=>{practiceCategory=v;},summary:`${run.results.length} ${run.results.length===1?'stack':'stacks'} · ${run.results.filter(r=>r.correct).length} cleared · ${run.results.filter(r=>r.correct&&r.mistakes===0).length} clean`}));
  $('daily-summary').hidden=!complete;document.querySelector('.game-column>.game-board').hidden=complete;
  $('timer-card').hidden=complete;
  $('eyebrow').textContent=mode==='daily'?(run.scoreVersion===2?'DAILY CHALLENGE':'SAVED DAILY · ORIGINAL SCORING'):'UNLIMITED · FREE PRACTICE';
  $('score-caption').textContent=mode==='daily'?'daily points':'practice points';$('run-score').textContent=format(run.score);
  $('category-tag').textContent=s.category;$('prompt').textContent=s.prompt;
  document.querySelector('.instructions').textContent='Drag or use the arrows to sort. With a card focused, press Enter to lock it in.';
  $('round-label').textContent=mode==='daily'?`ROUND ${run.round+1} / 5`:`STACK #${run.round+1}`;
  $('streak-label').innerHTML=`STREAK <b>${run.streak}</b>`;
  const labels=document.querySelectorAll('.sort-line span');labels[0].textContent=s.ends[0];labels[1].textContent=s.ends[1];
  $('round-dots').innerHTML=Array.from({length:5},(_,i)=>`<i class="${mode==='daily'?(i<run.results.length?'done':i===run.round?'current':''):(i===run.round%5?'current':'')}"></i>`).join('');
  const locked=run.status!=='playing';$('check-button').disabled=complete;$('check-button').textContent=locked?'VIEW RESULT':'LOCK IT IN ↵';
  $('message').className='message';$('message').textContent=locked?'This stack is finished. View the answer to continue.':'Every correct stack earns points. Wrong guesses cost points.';
  renderCards();updateTimer();refreshStats();if(complete)renderSummary();
 }
 function move(from,to){if(!currentDay()||!run||run.status!=='playing'||to<0||to>4)return;if(secondsLeft()===0){finish(false);return;}const [value]=run.order.splice(from,1);run.order.splice(to,0,value);save();renderCards();const card=$('cards').querySelector(`[data-value="${value}"]`);card.focus();$('message').textContent=`${stack().cards.find(c=>c.value===value).name} moved to position ${to+1}.`;}
 function clearPositionFeedback(){
  clearTimeout(feedbackTimer);feedbackTimer=null;
  [...$('cards').children].forEach((card,index)=>{
   card.classList.remove('correct','wrong');card.removeAttribute('aria-description');
   card.querySelector('.card-number').textContent=String(index+1).padStart(2,'0');
  });
 }
 function flashPositions(){
  clearPositionFeedback();let correctCount=0;
  [...$('cards').children].forEach((card,index)=>{
   const correct=run.order[index]===index+1;if(correct)correctCount++;
   card.classList.add(correct?'correct':'wrong');
   card.setAttribute('aria-description',correct?'Correct position':'Incorrect position');
   card.querySelector('.card-number').textContent=String(index+1).padStart(2,'0')+(correct?' ✓':' ✕');
  });
  feedbackTimer=setTimeout(clearPositionFeedback,1100);
  return correctCount;
 }
 function renderCards(){
  clearPositionFeedback();
  const locked=run.status!=='playing',s=stack();$('cards').textContent='';
  run.order.forEach((value,index)=>{
   const item=s.cards.find(c=>c.value===value),card=document.createElement('article');card.className='sort-card';card.draggable=!locked;card.dataset.value=value;card.tabIndex=0;card.setAttribute('aria-label',`${item.name}, position ${index+1} of 5. Use arrow keys to move.`);card.setAttribute('aria-describedby','prompt');
   const number=document.createElement('span');number.className='card-number';number.textContent=String(index+1).padStart(2,'0');
   const symbol=document.createElement('span');symbol.className='card-symbol alt-'+index;symbol.textContent=item.symbol;symbol.setAttribute('aria-hidden','true');
   const name=document.createElement('div');name.className='card-name';name.textContent=item.name;
   const detail=document.createElement('div');detail.className='card-detail';detail.textContent='';
   const moves=document.createElement('div');moves.className='card-moves';
   [-1,1].forEach(offset=>{const button=document.createElement('button');button.type='button';button.textContent=offset<0?'←':'→';button.setAttribute('aria-label',`Move ${item.name} ${offset<0?'earlier':'later'}`);button.disabled=locked||index+offset<0||index+offset>4;button.onclick=()=>move(index,index+offset);moves.append(button);});
   card.append(number,symbol,name,detail,moves);
   card.onkeydown=e=>{if(e.target===card&&e.key==='Enter'){e.preventDefault();check();return;}if(e.target!==card||!['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key))return;e.preventDefault();move(index,index+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1));};
   card.ondragstart=e=>{if(locked||e.target.closest('button')){e.preventDefault();return;}e.dataTransfer.setData('text/plain',String(value));e.dataTransfer.effectAllowed='move';card.classList.add('dragging');};
   card.ondragend=()=>card.classList.remove('dragging');card.ondragover=e=>{if(!locked){e.preventDefault();e.dataTransfer.dropEffect='move';}};
   card.ondrop=e=>{e.preventDefault();const from=run.order.indexOf(Number(e.dataTransfer.getData('text/plain')));if(from>=0)move(from,index);};
   $('cards').append(card);
  });
 }
 function updateTimer(){if(!run)return;const seconds=run.status==='playing'?secondsLeft():(run.results.at(-1)?.seconds||0);if(run.status==='playing'&&seconds>0&&seconds<=10&&warnedDeadline!==run.deadline){warnedDeadline=run.deadline;$('stack-announcement').textContent=seconds+' seconds left to finish this stack.';}$('timer').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;$('timer').setAttribute('aria-label',seconds+' seconds remaining');$('timer-fill').style.width=seconds/90*100+'%';$('timer-card').classList.toggle('warning',run.status==='playing'&&seconds<=20);$('timer-card').classList.toggle('urgent',run.status==='playing'&&seconds<=10);$('timer-caption').textContent=run.status==='playing'?'The clock keeps running if you leave this stack.':'Clock stopped. Continue when you are ready.';}
 function check(){if(!run||!currentDay())return;if(run.status==='review'){openResult();return;}if(run.status!=='playing')return;if(secondsLeft()===0){finish(false);return;}if(run.order.every((v,i)=>v===i+1)){finish(true);return;}const loss=mode==='daily'&&run.scoreVersion!==2?300:30;run.score-=loss;run.streak=0;run.mistakes++;save();$('run-score').textContent=format(run.score);$('streak-label').innerHTML='STREAK <b>0</b>';$('message').className='message bad';const correctCount=flashPositions();$('message').textContent=`Not quite. −${loss} points. ${correctCount} of 5 cards in the right position.`;}
 function finish(correct){if(!run||run.status!=='playing'||!currentDay())return;const seconds=secondsLeft(),multiplier=mode==='daily'&&run.scoreVersion!==2?10:1,points=correct?Math.round((100+seconds*5+run.streak*35)*multiplier):-40*multiplier;run.score+=points;run.streak=correct?run.streak+1:0;run.results.push({correct,points,seconds,mistakes:run.mistakes});run.status=mode==='daily'&&run.round===4?'complete':'review';save();render();openResult();window.BREAK_ROOM_FEEL.cue(document.querySelector('.result-card'),{kind:correct&&run.mistakes===0?'perfect':correct?'win':'miss',variant:'cards'});}
 function openResult(){if(!run||run.status==='playing')return;const r=run.results.at(-1),complete=run.status==='complete';$('result-kicker').textContent=complete?'DAILY COMPLETE':r.correct?'STACK COMPLETE':'TIME RAN OUT';$('result-title').textContent=complete?'Daily set finished.':r.correct?'Nice ordering.':'The clock got you.';$('result-detail').textContent=(r.points>=0?'+':'−')+format(Math.abs(r.points))+' points';$('fact-text').textContent=stack().fact;
  let order=$('correct-order');if(!order){order=document.createElement('p');order.id='correct-order';order.className='correct-order';$('fact-text').after(order);}order.textContent='Correct order: '+stack().cards.slice().sort((a,b)=>a.value-b.value).map(c=>c.name).join(' → ');
  $('result-title').textContent=r.correct&&r.mistakes===0?'Clean stack.':$('result-title').textContent;let breakdown=$('feel-stack-breakdown');if(!breakdown){breakdown=document.createElement('p');breakdown.id='feel-stack-breakdown';breakdown.className='local-note';$('result-detail').after(breakdown);}breakdown.textContent=r.correct?`${r.seconds} seconds banked · ${r.mistakes} wrong submissions`:'The next stack is a fresh start.';$('result-detail').after($('next-button'));$('next-button').textContent=complete?'SEE DAILY RESULTS →':'NEXT STACK →';openDialog($('result-modal'),$('check-button'));
 }
 function focusPrompt(){const prompt=$('prompt');prompt.focus({preventScroll:true});const r=prompt.getBoundingClientRect();if(r.top<140||r.bottom>innerHeight)prompt.scrollIntoView({block:'start',behavior:'instant'});}
 function next(){if(!run||!currentDay())return;closeDialog();if(run.status==='complete'){renderSummary();window.BREAK_ROOM_FEEL.cue($('daily-summary').querySelector('.feel-result'),{kind:window.BREAK_ROOM_SCORE.stackUp(run.score,run.scoreVersion)===100?'perfect':'win'});$('summary-copy').focus();return;}if(run.status!=='review')return;run.round++;if(mode==='infinite'){run.stack=nextPracticeStack();}makeRound();render();focusPrompt();}
 function renderSummary(){window.BREAK_ROOM_FEEL.result($('daily-summary'),{score:window.BREAK_ROOM_SCORE.stackUp(run.score,run.scoreVersion),previous:records().filter(r=>r.day<run.day).map(r=>window.BREAK_ROOM_SCORE.stackUp(r.score,r.scoreVersion))});$('summary-arcade').replaceChildren(window.BREAK_ROOM_SCORE.badge(window.BREAK_ROOM_SCORE.stackUp(run.score,run.scoreVersion)));$('summary-score').textContent=format(run.score)+' points';$('summary-detail').textContent=`${run.results.filter(x=>x.correct).length} / 5 stacks cleared · ${run.day}. Your next daily arrives at midnight Sydney time.`;}
 function records(){const keys=new Set(memory.keys());try{for(let i=0;i<localStorage.length;i++)keys.add(localStorage.key(i));}catch{}return [...keys].filter(k=>k?.startsWith(prefix)).map(k=>load(k.slice(prefix.length))).filter(r=>r?.status==='complete').sort((a,b)=>a.day.localeCompare(b.day));}
 function refreshStats(){const all=records(),scores=all.map(r=>window.BREAK_ROOM_SCORE.stackUp(r.score,r.scoreVersion)),best=scores.length?Math.max(...scores):null,average=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null,days=new Set(all.map(r=>r.day));let day=clock.dayKey(),streak=0;if(!days.has(day))day=clock.previousDay(day);while(days.has(day)){streak++;day=clock.previousDay(day);}const values={played:all.length,best:best===null?'—':format(best),average:average===null?'—':format(average),streak,perfect:all.filter(r=>r.results.every(x=>x.correct&&x.mistakes===0)).length,last:all.length?format(window.BREAK_ROOM_SCORE.stackUp(all.at(-1).score,all.at(-1).scoreVersion)):'—'};for(const [key,value]of Object.entries(values)){if($('record-'+key)){$('record-'+key).textContent=value;$('record-'+key).classList.toggle('compact-score',String(value).length>4);}$('stat-'+key).textContent=value;}}
 function openDialog(overlay,opener){if(dialog)closeDialog();const previous=document.activeElement;overlay.hidden=false;overlay.setAttribute('aria-hidden','false');overlay.classList.add('open');const background=[...document.body.children].filter(x=>x!==overlay&&!['SCRIPT','LINK'].includes(x.tagName)).map(x=>[x,x.inert]);background.forEach(([x])=>x.inert=true);dialog={overlay,opener:opener||previous,background};document.body.style.overflow='hidden';overlay.querySelector('button').focus();}
 function closeDialog(){if(!dialog)return;const {overlay,opener,background}=dialog;overlay.hidden=true;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');background.forEach(([x,inert])=>x.inert=inert);document.body.style.overflow='';dialog=null;if(opener?.isConnected&&!opener.closest('[hidden]'))opener.focus();}
 async function copy(){if(!run||run.status!=='complete')return;const text=`Stack Up ${run.day} ${run.results.map(r=>r.correct?'🟩':'⬜').join('')} ${run.score} points\nArcade score: ${window.BREAK_ROOM_SCORE.format(window.BREAK_ROOM_SCORE.stackUp(run.score,run.scoreVersion))}/100\n${new URL('index.html',location.href).href}`;let copied=false;try{await navigator.clipboard.writeText(text);copied=true;}catch{const field=document.createElement('textarea'),focus=document.activeElement;field.value=text;field.style.cssText='position:fixed;left:-9999px';document.body.append(field);field.select();try{copied=document.execCommand('copy')}catch{}field.remove();focus?.focus();}$('share-status').textContent=copied?'Copied!':"Couldn't copy in this browser. Try opening the game through a local web server.";}
 function tick(){if(!run||!currentDay())return;if(run.status==='playing'){updateTimer();if(secondsLeft()===0)finish(false);}}
 document.querySelectorAll('[data-mode],[data-start-mode]').forEach(b=>b.onclick=e=>{start(b.dataset.mode||b.dataset.startMode);if(run.status==='playing')focusPrompt();});
 document.querySelector('.br-mode-tabs').addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();const next=e.key==='Home'?'daily':e.key==='End'?'infinite':mode==='daily'?'infinite':'daily';
  start(next);document.querySelector(`[data-mode="${next}"]`).focus();
 });
 $('check-button').onclick=check;$('next-button').onclick=next;$('result-close').onclick=closeDialog;
 $('help-open').onclick=e=>openDialog($('help-dialog'),e.currentTarget);
 $('stats-open').onclick=e=>{refreshStats();openDialog($('stats-dialog'),e.currentTarget);};
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeDialog);
 for(const id of ['result-modal','help-dialog','stats-dialog'])$(id).onclick=e=>{if(e.target===$(id))closeDialog();};
 $('summary-copy').onclick=copy;$('summary-infinite').onclick=()=>start('infinite');
 document.addEventListener('keydown',e=>{if(!dialog)return;if(e.key==='Escape'){e.preventDefault();closeDialog();return;}if(e.key==='Tab'){const list=[...dialog.overlay.querySelectorAll('button:not(:disabled),a[href]')],first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 document.addEventListener('visibilitychange',tick);window.addEventListener('pageshow',tick);
 window.addEventListener('storage',e=>{if(mode==='daily'&&run&&e.key===prefix+run.day){const saved=load(run.day);if(saved){closeDialog();run=saved;render();tick();}}});
 setInterval(tick,250);refreshStats();
 start('daily');if(run.status==='playing')focusPrompt();
})();
