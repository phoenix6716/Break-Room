/* Per-game first-visit instructions. Preferences are local, separate from scores. */
(()=>{'use strict';
 const id=document.currentScript.dataset.game,key=id==='lowball'?'pc_help_seen':'break-room:help-seen:'+id;
 let seen=false;try{seen=localStorage.getItem(key)==='1';}catch{}
 let pending=!seen;const callbacks=[];
 function ready(){pending=false;callbacks.splice(0).forEach(fn=>fn());}
 window.BREAK_ROOM_HELP=Object.freeze({whenReady(fn){if(pending)callbacks.push(fn);else fn();}});
 function init(){
  if(pending)try{if(localStorage.getItem(key)==='1'){seen=true;ready();}}catch{}
  const button=document.querySelector('#help-popup-open,#help-open,#helpBtn'),dialog=document.querySelector('#help-popup,#help-dialog,#helpModal');
  if(!button||!dialog){ready();return;}
  const shown=()=>!dialog.hidden&&(id!=='lowball'||dialog.classList.contains('show'));
  const remember=()=>{try{localStorage.setItem(key,'1');}catch{}seen=true;};
  button.addEventListener('click',()=>{if(shown())remember();});
  if(!pending)return;
  const observer=new MutationObserver(()=>{if(!shown()){observer.disconnect();ready();}});
  function open(){if(document.visibilityState==='hidden')return;document.removeEventListener('visibilitychange',open);button.focus({preventScroll:true});button.click();if(shown()){remember();observer.observe(dialog,{attributes:true,attributeFilter:['hidden','class','style']});}else ready();}
  if(document.visibilityState==='hidden')document.addEventListener('visibilitychange',open);else open();
 }
 if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
