/* Live entry verification with an inline locked Unlimited tab. */
(()=>{
 'use strict';
 const base=new URL('.',document.currentScript.src),accountURL=new URL('account.html#purchases',base).href;
 const account=()=>window.BREAK_ROOM_ACCOUNTS;
 let game,view;
 function restore(){if(!view)return;const v=view;view=null;v.panel.ownerDocument.body.classList.remove('membership-tab-locked');v.panel.classList.remove('membership-locked-panel');v.card.remove();v.icon.remove();if(v.description)v.description.textContent=v.descriptionText;for(const row of v.tabs){row.tab.setAttribute('aria-selected',row.selected);row.tab.tabIndex=row.index;row.tab.className=row.className;}if(v.label===null)v.panel.removeAttribute('aria-labelledby');else v.panel.setAttribute('aria-labelledby',v.label);if(v.unlimitedLabel===null)v.unlimited.removeAttribute('aria-label');else v.unlimited.setAttribute('aria-label',v.unlimitedLabel);v.list?.removeEventListener('keydown',v.keys,true);}
 function show(kind){
  if(kind==='allowed'){restore();return;}
  if(!view){
   const doc=game==='lowball'?(document.getElementById('lowball-game-frame')?.contentDocument||document):document;
   const unlimited=doc.querySelector(game==='lowball'?'#unlimitedModeBtn':'#mode-unlimited'),daily=doc.querySelector(game==='lowball'?'#normalModeBtn':'#mode-daily');
   const panel=doc.getElementById(game==='lowball'?'lowball-mode-panel':'game-panel');if(!panel||!unlimited||!daily)return;
   const tabs=[daily,unlimited].map(tab=>({tab,selected:tab.getAttribute('aria-selected'),index:tab.tabIndex,className:tab.className}));
   const card=doc.createElement('section');card.className='membership-lock';card.setAttribute('aria-labelledby','membership-lock-title');
   const title=doc.createElement('h2');title.id='membership-lock-title';title.textContent='Unlimited is locked';
   const text=doc.createElement('p');text.id='membership-lock-text';text.setAttribute('role','status');
   const link=doc.createElement('a');link.href=new URL('pricing.html',base).href;link.target='_top';link.textContent='View plans';
   const login=doc.createElement('a');login.href=new URL('login.html',base).href;login.target='_top';login.textContent='Sign in';
   const retry=doc.createElement('button');retry.type='button';retry.textContent='Check access again';retry.onclick=()=>unlimited.click();
   card.append(title,text,link,login,retry);
   const icon=doc.createElement('span');icon.className='membership-lock-icon';icon.setAttribute('aria-hidden','true');icon.textContent=' 🔒';unlimited.append(icon);
   const list=unlimited.closest('[role=tablist]');const keys=e=>{if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();daily.click();daily.focus();}else if(e.key==='End'){e.preventDefault();e.stopImmediatePropagation();unlimited.focus();}};
   const description=doc.getElementById('mode-description');view={panel,card,icon,tabs,unlimited,description,descriptionText:description?.textContent,label:panel.getAttribute('aria-labelledby'),unlimitedLabel:unlimited.getAttribute('aria-label'),list,keys};list?.addEventListener('keydown',keys,true);
   daily.setAttribute('aria-selected','false');daily.tabIndex=-1;daily.classList.remove('active');unlimited.setAttribute('aria-selected','true');unlimited.tabIndex=0;unlimited.classList.add('active');unlimited.setAttribute('aria-label','Unlimited, locked');panel.setAttribute('aria-labelledby',unlimited.id);doc.body.classList.add('membership-tab-locked');panel.classList.add('membership-locked-panel');panel.append(card);
  }
  if(view.description)view.description.textContent=kind==='checking'?'Unlimited · Checking access…':'Unlimited · Locked';
  view.card.querySelector('p').textContent={checking:'Checking your purchases…','signed-out':'Sign in to check your Unlimited access. Daily games are free.',required:'Unlock Unlimited with a monthly membership or a purchase of this game. Daily games are free.',unavailable:'We could not verify your purchases. Check your connection and try again. Your game progress is safe.'}[kind];
  view.card.querySelector('h2').textContent=kind==='checking'?'Checking Unlimited access…':'Unlimited is locked';view.card.querySelector('button').disabled=kind==='checking';
 }
 const guard=window.BREAK_ROOM_MEMBERSHIP_POLICY.createGuard({enforce:true,getActor:()=>account()?.getUser()?.id||null,readStatus:()=>account().billingRequest({action:'status'}),show});
 const cancel=()=>{guard.cancel();restore();};
 let currentActor=account()?.getUser()?.id||null;
 window.addEventListener('break-room:auth-change',()=>{const next=account()?.getUser()?.id||null;if(next!==currentActor){currentActor=next;cancel();}});
 window.BREAK_ROOM_MEMBERSHIP=Object.freeze({allow:(next,resume)=>{game=next;return guard.allow(next,resume);},cancel,enforced:guard.enforced,accountURL});
})();
