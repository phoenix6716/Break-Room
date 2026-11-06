/* Enhance the existing account link; the ordinary link remains the no-JS fallback. */
(()=>{'use strict';
 const base=new URL('.',document.currentScript.src),api=window.BREAK_ROOM_ACCOUNTS;if(!api)return;
 const menu=document.createElement('div');menu.id='br-account-menu';menu.className='br-account-menu';menu.setAttribute('role','menu');menu.setAttribute('aria-label','Account');menu.hidden=true;
 const profile=document.createElement('a'),settings=document.createElement('a'),action=document.createElement('a'),status=document.createElement('p');
 profile.textContent='Your profile';profile.href=new URL('profile.html',base);settings.textContent='Settings';settings.href=new URL('settings.html',base);
 for(const a of [profile,settings,action])a.setAttribute('role','menuitem');status.setAttribute('role','status');menu.append(profile,settings,action,status);document.body.append(menu);
 let trigger=null,pending=false;
 function links(){return [...document.querySelectorAll('header a[href],nav a[data-account-link]')].filter(a=>a.dataset.accountLink==='true'||['account.html','login.html'].some(path=>a.href===new URL(path,base).href));}
 function paint(){for(const a of links()){a.textContent='ACCOUNT';a.setAttribute('role','button');a.setAttribute('aria-haspopup','menu');a.setAttribute('aria-controls',menu.id);a.setAttribute('aria-expanded',String(a===trigger&&!menu.hidden));}action.textContent=api.getUser()?'Log out':'Log in';action.href=new URL(api.getUser()?'account.html':'login.html',base);}
 function close(focus=false){menu.hidden=true;if(trigger){trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}trigger=null;}
 function position(){if(!trigger)return;const box=trigger.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(innerWidth-menu.offsetWidth-8,box.right-menu.offsetWidth))+'px';menu.style.top=Math.max(8,Math.min(innerHeight-menu.offsetHeight-8,box.bottom+8))+'px';}
 function open(a,last=false){if(pending)return;trigger=a;status.textContent='';menu.hidden=false;paint();position();(last?action:profile).focus();}
 document.addEventListener('click',event=>{const a=event.target.closest('a');if(a&&links().includes(a)&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();if(trigger===a&&!menu.hidden)close();else open(a);}else if(!menu.contains(event.target))close();});
 document.addEventListener('keydown',event=>{const a=event.target.closest('a');if(a&&links().includes(a)&&[' ','ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open(a,event.key==='ArrowUp');return;}if(menu.hidden)return;
  if(event.key==='Tab'){close(true);return;}if(event.key==='Escape'){event.preventDefault();close(true);}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const items=[profile,settings,action],i=items.indexOf(document.activeElement);items[event.key==='Home'?0:event.key==='End'?2:(i+(event.key==='ArrowUp'?2:1))%3].focus();}
 });
 document.addEventListener('focusin',event=>{if(!menu.hidden&&!menu.contains(event.target)&&event.target!==trigger)close();});
 action.addEventListener('click',async event=>{if(!api.getUser())return;event.preventDefault();if(pending)return;pending=true;action.setAttribute('aria-disabled','true');status.textContent='Saving and logging out…';try{if(!await api.signOut())throw Error('Could not log out. Please try again.');location.assign(new URL('account.html',base));}catch(error){status.textContent=error.message;}finally{pending=false;action.removeAttribute('aria-disabled');}});
 window.addEventListener('break-room:auth-change',()=>{if(!pending)close();paint();});window.addEventListener('resize',position);window.addEventListener('scroll',position,{passive:true});
 new MutationObserver(()=>{for(const a of links())if(!a.hasAttribute('aria-haspopup'))paint();}).observe(document.body,{childList:true,subtree:true});paint();
})();
