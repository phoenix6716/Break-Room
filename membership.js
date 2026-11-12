/* Live entry verification with an inline locked Unlimited tab. */
(()=>{
 'use strict';
 const base=new URL('.',document.currentScript.src),accountURL=new URL('account.html#purchases',base).href;
 const account=()=>window.BREAK_ROOM_ACCOUNTS;
 let game,view,waiting=false,waitVersion=0,authSettled=false;
 const pageGame=location.pathname.match(/\/games\/([^/]+)\//)?.[1];
 const marker=id=>'break-room:membership:locked:'+id;
 const marked=id=>{try{return sessionStorage.getItem(marker(id))==='1';}catch{return false;}};
 const mark=(id,value)=>{if(!id)return;try{if(value)sessionStorage.setItem(marker(id),'1');else sessionStorage.removeItem(marker(id));}catch{}};
 const reopenLocked=marked(pageGame);
 function restore(){if(!view)return;const v=view;view=null;v.panel.ownerDocument.body.classList.remove('membership-tab-locked');v.panel.classList.remove('membership-locked-panel');v.card.remove();v.icon.remove();if(v.description)v.description.textContent=v.descriptionText;for(const row of v.tabs){row.tab.setAttribute('aria-selected',row.selected);row.tab.tabIndex=row.index;row.tab.className=row.className;}if(v.label===null)v.panel.removeAttribute('aria-labelledby');else v.panel.setAttribute('aria-labelledby',v.label);if(v.unlimitedLabel===null)v.unlimited.removeAttribute('aria-label');else v.unlimited.setAttribute('aria-label',v.unlimitedLabel);v.list?.removeEventListener('keydown',v.keys,true);}
 function show(kind){
  if(kind==='allowed'){mark(game,false);restore();return;}
  mark(game,true);
  if(!view){
   const doc=game==='lowball'?(document.getElementById('lowball-game-frame')?.contentDocument||document):document;
   const unlimited=doc.querySelector(game==='lowball'?'#unlimitedModeBtn':'#mode-unlimited'),daily=doc.querySelector(game==='lowball'?'#normalModeBtn':'#mode-daily');
   const panel=doc.getElementById(game==='lowball'?'lowball-mode-panel':'game-panel');if(!panel||!unlimited||!daily)return;
   const tabs=[daily,unlimited].map(tab=>({tab,selected:tab.getAttribute('aria-selected'),index:tab.tabIndex,className:tab.className}));
   const card=doc.createElement('section');card.className='membership-lock';card.setAttribute('aria-labelledby','membership-lock-title');
   const artwork=doc.createElement('img');artwork.className='membership-lock-art';artwork.src=new URL('assets/ui/unlimited-lock.png?v=muted-20261113',base).href;artwork.alt='';artwork.width=96;artwork.height=96;
   const title=doc.createElement('h2');title.id='membership-lock-title';title.textContent='Unlock Unlimited';
   const text=doc.createElement('p');text.id='membership-lock-text';text.setAttribute('role','status');
   const link=doc.createElement('a');link.href=new URL('pricing.html',base).href;link.target='_top';link.textContent='View plans';
   const login=doc.createElement('a');login.href=new URL('login.html',base).href;login.target='_top';login.textContent='Sign in';

   const actions=doc.createElement('div');actions.className='membership-lock-actions';actions.append(link,login);
   const note=doc.createElement('p');note.className='membership-lock-note';note.textContent='Your Daily game stays free.';
   card.append(artwork,title,text,actions,note);
   const icon=doc.createElement('img');icon.className='membership-lock-icon';icon.setAttribute('aria-hidden','true');icon.alt='';icon.src=artwork.src;icon.width=24;icon.height=24;unlimited.append(icon);
   const list=unlimited.closest('[role=tablist]');const keys=e=>{if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();daily.click();daily.focus();}else if(e.key==='End'){e.preventDefault();e.stopImmediatePropagation();unlimited.focus();}};
   const description=doc.getElementById('mode-description');view={panel,card,icon,tabs,unlimited,login,description,descriptionText:description?.textContent,label:panel.getAttribute('aria-labelledby'),unlimitedLabel:unlimited.getAttribute('aria-label'),list,keys};list?.addEventListener('keydown',keys,true);
   daily.setAttribute('aria-selected','false');daily.tabIndex=-1;daily.classList.remove('active');unlimited.setAttribute('aria-selected','true');unlimited.tabIndex=0;unlimited.classList.add('active');unlimited.setAttribute('aria-label','Unlimited, locked');panel.setAttribute('aria-labelledby',unlimited.id);doc.body.classList.add('membership-tab-locked');panel.classList.add('membership-locked-panel');panel.append(card);
  }
  view.login.hidden=kind!=='signed-out'||!!account()?.getUser();
  if(view.description)view.description.textContent=kind==='checking'?'Unlimited · Checking access…':'Unlimited · Locked';
  view.card.querySelector('p').textContent={checking:'Checking your purchases…','signed-out':'Sign in to see your purchases, or choose a plan to keep playing.',required:'Choose a monthly membership or unlock this game with a one-time purchase.',unavailable:'We could not verify your purchases. Check your connection, then reload this page to try again. Your game progress is safe.'}[kind];
  view.card.querySelector('h2').textContent=kind==='checking'?'Checking Unlimited access…':kind==='unavailable'?'Access unavailable':'Unlock Unlimited';
 }
 const guard=window.BREAK_ROOM_MEMBERSHIP_POLICY.createGuard({enforce:true,getActor:()=>account()?.getUser()?.id||null,readStatus:()=>account().billingRequest({action:'status'}),show});
 const cancel=()=>{mark(game,false);waitVersion++;waiting=false;guard.cancel();restore();};
 function allow(next,resume){
  game=next;
  if(!guard.enforced)return guard.allow(next,resume);
  if(authSettled)return guard.allow(next,resume);
  if(waiting)return false;
  waiting=true;const version=++waitVersion;show('checking');
  const ready=account()?.ready||(document.readyState==='loading'?new Promise(resolve=>document.addEventListener('DOMContentLoaded',()=>resolve(account()?.ready),{once:true})):Promise.resolve());
  Promise.resolve(ready).then(()=>{if(version!==waitVersion)return;waiting=false;authSettled=true;if(guard.allow(next,resume))resume();}).catch(()=>{if(version===waitVersion){waiting=false;show('unavailable');}});
  return false;
 }
 let currentActor=account()?.getUser()?.id||null;
 window.addEventListener('break-room:auth-change',()=>{const next=account()?.getUser()?.id||null;if(next!==currentActor){currentActor=next;if(waiting)guard.cancel();else cancel();}});
 window.BREAK_ROOM_MEMBERSHIP=Object.freeze({allow,cancel,enforced:guard.enforced,accountURL});
 window.addEventListener('load',()=>{if(!reopenLocked||!marked(pageGame)||!window.BREAK_ROOM_MEMBERSHIP_POLICY.games.includes(pageGame))return;try{if(window.parent!==window&&window.parent.BREAK_ROOM_MEMBERSHIP)return;}catch{}const doc=pageGame==='lowball'?(document.getElementById('lowball-game-frame')?.contentDocument||document):document;doc.querySelector(pageGame==='lowball'?'#unlimitedModeBtn':'#mode-unlimited')?.click();},{once:true});
})();
