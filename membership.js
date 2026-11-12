/* Live Unlimited entry checks. Browser flags and sandbox receipts cannot grant ownership. */
(()=>{
 'use strict';
 const base=new URL('.',document.currentScript.src),accountURL=new URL('account.html#purchases',base).href;
 const account=()=>window.BREAK_ROOM_ACCOUNTS;
 let dialog,opener;
 function show(kind){
  if(kind==='allowed'){dialog?.close();return;}
  if(!dialog){
   dialog=document.createElement('dialog');dialog.className='membership-dialog';
   const title=document.createElement('h2');title.id='membership-dialog-title';title.textContent='Unlimited play';
   const text=document.createElement('p');text.id='membership-dialog-text';text.setAttribute('role','status');
   const link=document.createElement('a');link.href=new URL('pricing.html',base).href;link.textContent='View plans & purchases';
   const close=document.createElement('button');close.type='button';close.textContent='Stay here';close.onclick=()=>{guard.cancel();dialog.close();};
   dialog.setAttribute('aria-labelledby',title.id);dialog.append(title,text,link,close);document.body.append(dialog);
   dialog.addEventListener('cancel',()=>guard.cancel());dialog.addEventListener('close',()=>opener?.focus());
  }
  dialog.querySelector('p').textContent={checking:'Checking your purchases…','signed-out':'Sign in to check your Unlimited access.',required:'Unlimited requires a monthly membership or a purchase of this game. Daily games are free.',unavailable:'We could not verify your purchases. Check your connection and try again. Your game progress is safe.'}[kind];
  if(!dialog.open){opener=document.activeElement;dialog.showModal();}
 }
 const guard=window.BREAK_ROOM_MEMBERSHIP_POLICY.createGuard({
  enforce:true,
  getActor:()=>account()?.getUser()?.id||null,
  readStatus:()=>account().billingRequest({action:'status'}),show
 });
 let currentActor=account()?.getUser()?.id||null;
 window.addEventListener('break-room:auth-change',()=>{const next=account()?.getUser()?.id||null;if(next!==currentActor){currentActor=next;guard.cancel();dialog?.close();}});
 window.BREAK_ROOM_MEMBERSHIP=Object.freeze({allow:guard.allow,cancel:guard.cancel,enforced:guard.enforced,accountURL});
})();
