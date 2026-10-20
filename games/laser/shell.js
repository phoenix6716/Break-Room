/* Laser shared shell: mode controls and accessible Help/Stats dialogs. */
(() => {
  'use strict';
  const tabs=[...document.querySelectorAll('[data-game-mode]')];
  const panel=document.getElementById('game-panel');
  const modeDescription=document.getElementById('mode-description');
  let mode='daily';
  function selectMode(next,focus=false){
    if(!['daily','unlimited'].includes(next))throw new RangeError('Unknown game mode');
    mode=next;
    tabs.forEach(tab=>{const active=tab.dataset.gameMode===mode;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active){panel.setAttribute('aria-labelledby',tab.id);if(focus)tab.focus()}});
    modeDescription.textContent=mode==='daily'?'Daily · Four boards. No timer.':'Unlimited · Free practice. No Daily score.';
    document.dispatchEvent(new CustomEvent('break-room:mode-change',{detail:{mode}}));
  }
  tabs.forEach(tab=>tab.addEventListener('click',()=>selectMode(tab.dataset.gameMode)));
  document.querySelector('.br-mode-tabs').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();selectMode(event.key==='Home'?'daily':event.key==='End'?'unlimited':mode==='daily'?'unlimited':'daily',true);
  });
  window.BREAK_ROOM_GAME_SHELL=Object.freeze({get mode(){return mode},selectMode});

  const dialogs=[...document.querySelectorAll('.game-popup-backdrop')];
  let active=null,opener=null,background=[],previousOverflow='';
  function closeDialog(restoreFocus=true){
    if(!active)return;
    active.hidden=true;active=null;
    background.forEach(([element,wasInert])=>{element.inert=wasInert});background=[];
    document.body.style.overflow=previousOverflow;
    if(restoreFocus&&opener?.isConnected)opener.focus();
  }
  function openDialog(id){
    closeDialog(false);opener=document.activeElement;active=document.getElementById(id);active.hidden=false;
    previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    background=[...document.body.children].filter(element=>element!==active&&!['SCRIPT','STYLE','TEMPLATE'].includes(element.tagName)).map(element=>[element,element.inert]);
    background.forEach(([element])=>{element.inert=true});
    active.querySelector('[data-popup-close]').focus();
  }
  document.getElementById('help-popup-open').addEventListener('click',()=>openDialog('help-popup'));
  document.getElementById('stats-popup-open').addEventListener('click',()=>openDialog('stats-popup'));
  dialogs.forEach(dialog=>{
    dialog.querySelectorAll('[data-popup-close]').forEach(button=>button.addEventListener('click',()=>closeDialog()));
    dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
  });
  document.addEventListener('keydown',event=>{
    if(!active)return;
    if(event.key==='Escape'){event.preventDefault();closeDialog();return}
    if(event.key!=='Tab')return;
    const controls=[...active.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(element=>element.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
})();
