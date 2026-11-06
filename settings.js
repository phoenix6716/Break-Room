(()=>{'use strict';
 const api=window.BREAK_ROOM_ACCOUNTS,prefs=window.BREAK_ROOM_PREFERENCES,$=id=>document.getElementById(id);if(!api||!prefs)return;
 let currentId=null,sharingRequest=0,accountBusy=false;
 const message=(text,error=false)=>{$('settings-message').textContent=text;$('settings-message').dataset.error=String(error);};
 const tabs=[...document.querySelectorAll('[role=tab]')];function tab(next,focus=false){for(const item of tabs){const active=item===next;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;$(item.getAttribute('aria-controls')).hidden=!active;}if(focus)next.focus();message('');}
 tabs.forEach((item,i)=>{item.addEventListener('click',()=>tab(item));item.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();tab(tabs[e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowLeft'?2:1))%3],true);});});
 function paintPrefs(){const p=prefs.get();$('settings-sound').checked=p.sound;$('settings-volume').value=String(p.volume*100);$('volume-label').value=Math.round(p.volume*100)+'%';$('settings-motion').checked=p.motion==='reduce';}
 function preference(value){const p=prefs.set(value);if(!p.durable)message('Changed for this page. Your browser is blocking settings storage.',true);}
 $('settings-sound').onchange=()=>preference({sound:$('settings-sound').checked});$('settings-volume').oninput=()=>preference({volume:Number($('settings-volume').value)/100});$('settings-motion').onchange=()=>preference({motion:$('settings-motion').checked?'reduce':'system'});
 window.addEventListener('break-room:preferences',paintPrefs);paintPrefs();
 async function loadSharing(){const id=api.getUser()?.id,request=++sharingRequest;$('sharing-label').hidden=true;$('sharing-retry').hidden=true;$('sharing-note').textContent=id?'Loading sharing setting…':'Log in to manage score sharing.';if(!id)return;
  try{const hub=await api.friendsRPC('friend_hub',{p_action:'list'});if(api.getUser()?.id!==id||request!==sharingRequest)return;if(hub?.me){$('settings-sharing').checked=hub.me.sharing;$('sharing-label').hidden=false;$('sharing-note').textContent='Only your Daily scores are shared when you choose this.';}else{const link=document.createElement('a');link.href='friends.html';link.textContent='Set up Friends';$('sharing-note').replaceChildren('Score sharing is off. ',link,' to choose who you play with.');}}
  catch(error){if(api.getUser()?.id!==id||request!==sharingRequest)return;$('sharing-note').textContent='Could not load score sharing. Your choice has not changed.';$('sharing-retry').hidden=false;}
 }
 function render(force=false){const user=api.getUser(),id=user?.id??null;$('settings-guest').hidden=!!user;$('settings-auth').hidden=!user;$('settings-sync').hidden=!user;
  if(!accountBusy&&(force===true||id!==currentId)){$('settings-name').value=user?.user_metadata?.display_name||'';$('settings-email').value=user?.email||'';}
  if(id!==currentId){message('');currentId=id;loadSharing();}
  if(!user)document.querySelector('[data-account-status]').textContent='Saved on this browser. Log in to save across devices.';
 }
 async function run(control,task,success,refresh=false){if(accountBusy)return;const id=api.getUser()?.id;accountBusy=true;const controls=[...document.querySelectorAll('#settings-auth input,#settings-auth button,#settings-sharing,#settings-sync')];controls.forEach(el=>el.disabled=true);message('Saving…');let saved=false;try{await task();saved=true;if(api.getUser()?.id===id)message(success);}catch(error){if(api.getUser()?.id===id)message(error.message||'Could not save. Please try again.',true);}finally{accountBusy=false;controls.forEach(el=>el.disabled=false);render(refresh&&saved);}}
 $('name-form').onsubmit=e=>{e.preventDefault();run(e.submitter,()=>api.updateName($('settings-name').value),'Display name saved.',true);};
 $('email-form').onsubmit=e=>{e.preventDefault();const email=$('settings-email').value;run(e.submitter,()=>api.updateEmail(email),'Email change requested. Follow the confirmation instructions sent by email.',true);};
 $('settings-password').onclick=e=>run(e.currentTarget,()=>api.resetPassword(),'Password reset requested. Check your email for the secure link.');
 $('settings-sharing').onchange=e=>{const value=e.target.checked;run(e.target,()=>api.setSharing(value),value?'Daily score sharing is on.':'Daily score sharing is off.').then(loadSharing);};
 $('sharing-retry').onclick=loadSharing;
 $('settings-sync').onclick=e=>run(e.currentTarget,async()=>{if(!await api.sync())throw Error('Could not sync. Your browser saves are safe. Please try again.');},'Your saves are up to date.');
 $('settings-export').onclick=()=>api.exportSaves();
 window.addEventListener('break-room:auth-change',render);api.ready.then(()=>{render();loadSharing();});render();
})();
