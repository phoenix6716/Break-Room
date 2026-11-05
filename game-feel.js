/* Presentation only: no scores, deadlines or game saves are changed here. */
(()=>{'use strict';
 const existingSound=document.currentScript?.dataset.sound==='existing',key='break-room:game-sound';
 const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 let enabled=false,context,control;const voices=new Map();let lastSound=-Infinity,lastPriority=-Infinity,lastKind='';
 try{enabled=localStorage.getItem(key)==='on';}catch{}
 const tones={
  pick:[[660],.04,.025,'sine',.025],move:[[262,392],.045,.025,'triangle',.025],place:[[392,523],.07,.035,'sine',.035],
  rotate:[[350,470],.045,.03,'triangle',.025],undo:[[440,330],.06,.04,'sine',.025],clear:[[330,262],.055,.035,'sine',.025],
  lock:[[196,294,392],.075,.045,'triangle',.03],reveal:[[392,587,784],.10,.055,'sine',.03],next:[[440,587],.06,.035,'sine',.025],
  win:[[523,659,784],.13,.07,'triangle',.035],perfect:[[523,659,784,1047],.15,.065,'sine',.035],
  miss:[[330,262],.11,.065,'sine',.025],timeout:[[330,247,196],.12,.075,'triangle',.025],achievement:[[523,659,784,1047,1319],.15,.055,'sine',.035]
 };
 function silence(immediate=true){for(const [voice,gain]of voices){try{if(!immediate&&context?.state==='running'){const now=context.currentTime;gain.gain.cancelScheduledValues(now);gain.gain.setTargetAtTime(.0001,now,.003);voice.stop(now+.015);}else voice.stop();}catch{}}voices.clear();}
 function audio(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!context&&Audio)context=new Audio();if(context?.state==='suspended')context.resume().catch(()=>{});}catch{}return context;}
 function sound(kind){if(existingSound||!enabled||document.hidden||document.body.classList.contains('clock-running'))return false;const ctx=audio();if(!ctx||ctx.state!=='running')return false;
  const now=performance.now(),major=['win','perfect','miss','timeout','achievement'].includes(kind);if(!major&&(kind===lastKind&&now-lastSound<45||now-lastPriority<180))return false;
  if(major){silence(false);lastPriority=now;}else if(voices.size>12)silence(false);lastSound=now;lastKind=kind;
  const [notes,duration,gap,wave,volume]=tones[kind]||tones.pick;
  notes.forEach((frequency,i)=>{try{const oscillator=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+i*gap;oscillator.type=wave;oscillator.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);oscillator.connect(gain);gain.connect(ctx.destination);voices.set(oscillator,gain);oscillator.onended=()=>{voices.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(start);oscillator.stop(start+duration+.015);}catch{}});return true;
 }
 function cue(target,{kind='win',variant='stamp',quiet=false}={}){if(!target||document.hidden||document.body.classList.contains('clock-running'))return;if(!quiet)sound(kind);if(motion())return;
  target.classList.remove('feel-enter');target.dataset.feelStable=String(target.matches('button,input,select,textarea,[role=button]')||!!target.querySelector('button,input,select,textarea,a[href]'));target.dataset.feel=variant;void target.offsetWidth;target.classList.add('feel-enter');
  // Local decoration is short-lived and cannot cover buttons or steal focus.
  if(kind==='perfect'){const bits=document.createElement('span');bits.className='feel-bits';bits.setAttribute('aria-hidden','true');for(let i=0;i<8;i++){const bit=document.createElement('i');bit.style.setProperty('--n',i);bits.append(bit);}target.append(bits);setTimeout(()=>bits.remove(),650);}
  setTimeout(()=>target.classList.remove('feel-enter'),650);
 }
 function meter(value,label){const n=Math.max(0,Math.min(100,Number(value)||0)),box=document.createElement('div');box.className='feel-meter';const copy=document.createElement('p');copy.textContent=label;const track=document.createElement('div');track.className='feel-meter-track';track.setAttribute('role','meter');track.setAttribute('aria-label',label);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(n));const fill=document.createElement('i');fill.style.width=n+'%';track.append(fill);box.append(copy,track);return box;}
 function result(target,{score,previous=[]}={}){target.querySelector(':scope > .feel-result')?.remove();if(!Number.isFinite(score))return;
  const old=previous.filter(n=>Number.isFinite(n)&&n>=0&&n<=100),best=old.length?Math.max(...old):null;
  const box=document.createElement('div');box.className='feel-result';box.dataset.perfect=String(score===100);
  const stamp=document.createElement('strong');stamp.className='feel-stamp';stamp.textContent=score===100?'PERFECT DAILY':best!==null&&score>best?'NEW SAVED BEST':'DAILY IN THE BOOKS';
  const note=document.createElement('p');note.className='feel-best';note.textContent=best===null?'Your first Daily in the available saved history.':score>best?'Previous best in saved history: '+Math.round(best*10)/10+' / 100.': 'Best in saved history: '+Math.round(Math.max(best,score)*10)/10+' / 100.';
  box.append(stamp,meter(score,'DAILY ARCADE SCORE · '+Math.round(score*10)/10+' / 100'),note);target.prepend(box);return box;
 }
 function mount(){if(existingSound)return;const main=document.querySelector('main');if(!main)return;const row=document.createElement('div');row.className='feel-sound-row';control=document.createElement('button');control.type='button';control.className='feel-sound';
  function paint(){control.textContent='♪  SOUND '+(enabled?'ON':'OFF');control.setAttribute('aria-pressed',String(enabled));control.setAttribute('aria-label','Game sound');}
  control.onclick=()=>{enabled=!enabled;try{localStorage.setItem(key,enabled?'on':'off');}catch{}paint();if(enabled){audio();sound('pick');}else silence();};paint();row.append(control);main.append(row);
 }
 for(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>{if(enabled&&!existingSound&&!document.body.classList.contains('clock-running'))audio();},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){silence();context?.suspend?.().catch(()=>{});}});
 window.addEventListener('storage',e=>{if(e.key===key){enabled=e.newValue==='on';if(control){control.setAttribute('aria-pressed',String(enabled));control.textContent='♪  SOUND '+(enabled?'ON':'OFF');}if(!enabled)silence();}});
 document.addEventListener('click',e=>{
  if(existingSound||document.body.classList.contains('clock-running'))return;const button=e.target.closest?.('button');if(!button||button.disabled||button.getAttribute('aria-disabled')==='true'||button.classList.contains('fixed'))return;
  if(button.matches('[id^="digit-"],#delete-digit,.td-steps button'))sound('pick');
  else if(button.matches('.laser-cell'))sound(button.classList.contains('placed')?'rotate':'place');
  else if(button.matches('#undo,#undo-seating,#undo-mirror'))sound('undo');
  else if(button.matches('#clear-bag,#clear-mirrors,#clear-guess'))sound('clear');
  else if(button.matches('#hint,#show-solution'))sound('reveal');
 },true);
 document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(b&&!b.disabled&&b.matches('#next-code,#next-button,#next-board'))sound('next');});
 document.addEventListener('input',e=>{if(e.target.id==='code-input')sound('pick');});
 document.addEventListener('change',e=>{if(e.target.id==='year-slider'||e.target.id==='year-era')sound('move');});
 document.addEventListener('break-room:mode-change',()=>silence());
 window.BREAK_ROOM_FEEL=Object.freeze({cue,meter,result,sound,silence});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
