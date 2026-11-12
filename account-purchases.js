/* Account billing display. Sandbox preview is presentation only, never game access. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id),accounts=window.BREAK_ROOM_ACCOUNTS;
 const environment=new URL(location.href).searchParams.get('billing_preview')==='sandbox'?'sandbox':'live';
 const returned=new URL(location.href).searchParams.has('returned');
 const sandbox=environment==='sandbox',names={'laser':'Laser','time-drop':'Time Drop','clue-ladder':'Clue Ladder','seating-chart':'Seating Chart','shift-work':'Desk Jam','codebreak':'Codebreak','stack-up':'Stack Up','pack':'Pack','lowball':'Lowball','inner-clock':'Time Sense'};
 const base=new URL('.',document.currentScript.src);
 let actor=null,generation=0,busy=false,manageable=false;
 const user=()=>accounts?.getUser()?.id||null;
 const message=(text,error=false)=>{$('purchase-status').textContent=text;$('purchase-status').dataset.error=String(error);};
 const controls=()=>{$('purchase-refresh').hidden=!actor;$('purchase-refresh').disabled=busy||!actor;$('purchase-manage').disabled=busy||!actor||!manageable;};
 const clear=()=>{$('purchase-plan').textContent='Purchase status has not been verified.';$('purchase-games').replaceChildren();manageable=false;controls();};
 const check=(id,epoch)=>{if(id!==user()||epoch!==generation)throw Error('Account changed. Please refresh purchase status.');};
 function render(status){
  if(status.environment!==environment)throw Error('Unexpected billing environment. Please refresh.');
  if(status.configured===false){clear();$('purchase-plan').textContent='Purchases are temporarily unavailable. Your progress is safe.';message('Try Refresh purchases again shortly.');return;}
  if(status.verified!==true||!Array.isArray(status.games))throw Error('Purchase status could not be verified.');
  if(status.subscription_active){const end=new Date(status.paid_through);if(!Number.isFinite(end.getTime()))throw Error('Subscription period could not be verified.');$('purchase-plan').textContent='Monthly '+(sandbox?'test ':'')+'membership active until '+end.toLocaleString('en-AU',{timeZone:'Australia/Sydney',dateStyle:'medium',timeStyle:'short'})+' Sydney time. '+(status.cancel_at_period_end?'Renewal is canceled.':'Renews monthly unless canceled.');}
  else $('purchase-plan').textContent='No active '+(sandbox?'test ':'')+'monthly membership.';
  $('purchase-games').replaceChildren();
  for(const id of status.games){if(!names[id])throw Error('Unknown purchased game.');const item=document.createElement('li'),link=document.createElement('a');link.href=new URL('games/'+id+'/index.html',base).href;link.textContent=names[id];item.append(link,document.createTextNode(sandbox?' — permanent test purchase':' — permanent Unlimited'));$('purchase-games').append(item);}
  if(!status.games.length){const item=document.createElement('li');item.textContent='No individual '+(sandbox?'test ':'')+'game purchases recorded.';$('purchase-games').append(item);}
  manageable=status.has_billing_account===true||status.subscription_active===true||status.games.length>0;
  message((sandbox?'Sandbox ':'')+'Purchase status verified.'+(status.pending?' A checkout is awaiting completion.':''));controls();
 }
 async function refresh(){
  await accounts.ready;const id=user(),epoch=generation;if(!id||busy)return;
  busy=true;controls();message('Checking your purchases…');
  try{const status=await accounts.billingRequest({action:'status'},environment);check(id,epoch);render(status);}
  catch(error){if(id===user()&&epoch===generation){manageable=false;message(error.message||'Purchases could not be checked. Try again.',true);}}
  finally{if(epoch===generation){busy=false;controls();}}
 }
 function adopt(){const id=user();if(id===actor)return;generation++;actor=id;busy=false;clear();if(actor){void refresh();}else{$('purchase-plan').textContent='Sign in to view your membership and purchased games.';message('Daily games are free. Explore plans for Unlimited.');}controls();}
 $('purchase-manage').textContent=sandbox?'Manage test billing':'Manage billing';
 $('purchase-preview').hidden=!sandbox;
 $('purchase-refresh').onclick=()=>{if(!busy)void refresh();};
 $('purchase-manage').onclick=async()=>{
  if(busy||!manageable||!actor)return;const id=actor,epoch=generation;busy=true;controls();message('Opening billing management…');
  try{const result=await accounts.billingRequest({action:'portal'},environment);check(id,epoch);const url=new URL(result.url);if(url.protocol!=='https:'||url.hostname!=='billing.stripe.com'||url.username||url.password||url.port)throw Error('Unexpected billing destination.');location.assign(url.href);}
  catch(error){if(epoch===generation)message(error.message||'Billing management is unavailable.',true);}
  finally{if(epoch===generation){busy=false;controls();}}
 };
 window.addEventListener('break-room:auth-change',adopt);
 accounts.ready.then(()=>{adopt();if(!actor){$('purchase-plan').textContent='Sign in to view your membership and purchased games.';message('Daily games are free. Explore plans for Unlimited.');}});
 const params=new URL(location.href).searchParams;
 if(params.has('returned')||params.has('canceled')){params.delete('returned');params.delete('canceled');history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+'#purchases');}
})();
