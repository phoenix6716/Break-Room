/* Presentation only: no scores, deadlines or game saves are changed here. */
(()=>{'use strict';
 const existingSound=document.currentScript?.dataset.sound==='existing',key='break-room:game-sound';
 const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 let enabled=false,context,control;const voices=new Set();
 try{enabled=localStorage.getItem(key)==='on';}catch{}
 function silence(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
 function audio(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!context&&Audio)context=new Audio();if(context?.state==='suspended')context.resume().catch(()=>{});}catch{}return context;}
 function sound(kind){if(existingSound||!enabled||document.hidden)return;const ctx=audio();if(!ctx||ctx.state!=='running')return;
  silence();const notes=kind==='perfect'?[523,659,784,1047]:kind==='win'?[523,784]:kind==='pick'?[440]:[330];
  notes.forEach((frequency,i)=>{try{const oscillator=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+i*.065;oscillator.type='triangle';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.035,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+.10);oscillator.connect(gain);gain.connect(ctx.destination);voices.add(oscillator);oscillator.onended=()=>{voices.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(start);oscillator.stop(start+.12);}catch{}});
 }
 function cue(target,{kind='win',variant='stamp',quiet=false}={}){if(!target)return;if(!quiet)sound(kind);if(motion())return;
  target.classList.remove('feel-enter');target.dataset.feel=variant;void target.offsetWidth;target.classList.add('feel-enter');
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
 document.addEventListener('pointerdown',()=>{if(enabled&&!existingSound)audio();},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)silence();});
 window.addEventListener('storage',e=>{if(e.key===key){enabled=e.newValue==='on';if(control){control.setAttribute('aria-pressed',String(enabled));control.textContent='♪  SOUND '+(enabled?'ON':'OFF');}if(!enabled)silence();}});
 window.BREAK_ROOM_FEEL=Object.freeze({cue,meter,result,sound});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
