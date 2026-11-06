/* A device-only appearance toggle; never reads or writes native game saves. */
(()=>{'use strict';
 const prefs=window.BREAK_ROOM_PREFERENCES;if(!prefs)return;
 const moon='<path d="M20.7 13A9 9 0 0 1 11 3.3 9 9 0 1 0 20.7 13Z"/>',sun='<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';
 let toggle=null;
 function paint(){if(!toggle)return;const dark=prefs.get().theme==='dark',label=dark?'Switch to light mode':'Switch to dark mode';toggle.setAttribute('aria-label',label);toggle.setAttribute('aria-pressed',String(dark));toggle.title=label;toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(dark?sun:moon)+'</svg>';}
 function mount(){if(toggle?.isConnected)return;const header=document.querySelector('header');if(!header)return;const link=header.querySelector('.game-header-account,.login,[data-account-link],a[href$="account.html"],a[href$="login.html"]');if(!link)return;
  let actions=link.closest('.account,.br-header-actions');if(!actions){actions=document.createElement('div');actions.className='br-header-actions';link.before(actions);actions.append(link);}
  toggle=document.createElement('button');toggle.type='button';toggle.className='br-theme-toggle';actions.prepend(toggle);
  const status=document.createElement('span');status.className='br-theme-status';status.setAttribute('role','status');actions.append(status);
  toggle.addEventListener('click',()=>{const p=prefs.set({theme:prefs.get().theme==='dark'?'light':'dark'});status.textContent=p.durable?'':'Theme changed for this page. Your browser is blocking settings storage.';});paint();
 }
 window.addEventListener('break-room:preferences',paint);new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});mount();
})();
