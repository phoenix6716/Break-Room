/* Unlisted sandbox tool. Uses the official shared Auth session, never game saves. */
(async()=>{
 'use strict';
 const $=id=>document.getElementById(id),config=window.BREAK_ROOM_ACCOUNT_CONFIG;
 const message=(text,error=false)=>{$('billing-message').textContent=text;$('billing-message').dataset.error=String(error);};
 const names=Object.fromEntries([...$('billing-item').options].map(o=>[o.value,o.textContent.split(' — ')[0]]));
 let client,actor=null,busy=false,configured=false,generation=0;
 const buttons=()=>{for(const id of ['billing-checkout','billing-refresh','billing-portal'])$(id).disabled=busy||!actor||!configured;};
 async function call(body){
  const expected=actor,epoch=generation;
  if(!expected)throw Error('Log in first, then refresh this page.');
  const {data,error}=await client.auth.getSession();if(error||data.session?.user.id!==expected)throw Error('Account changed. Refresh this page.');
  const response=await fetch(config.url+'/functions/v1/billing',{method:'POST',headers:{apikey:config.publishableKey,Authorization:'Bearer '+data.session.access_token,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});
  const value=await response.json();
  const current=await client.auth.getSession();
  if(epoch!==generation||actor!==expected||current.data.session?.user.id!==expected)throw Error('Account changed. Refresh this page.');
  if(!response.ok)throw Error(value.error||'Could not verify billing. Try again.');return value;
 }
 async function run(task){if(busy)return;busy=true;buttons();try{await task();}catch(error){message(error.message||'Could not verify billing. Try again.',true);}finally{busy=false;buttons();}}
 function display(value){
  if(value.environment!=='sandbox'||value.verified!==true)throw Error('Sandbox purchase status could not be verified.');
  const parts=[];
  if(value.subscription_active){parts.push('Monthly test subscription active until '+new Date(value.paid_through).toLocaleString('en-AU',{timeZone:'Australia/Sydney'})+' Sydney time'+(value.cancel_at_period_end?' (renewal canceled).':'.'));}
  for(const game of value.games)parts.push((names[game]||game)+' test purchase verified.');
  if(!parts.length)parts.push('No active sandbox purchases verified for this account.');
  if(value.pending)parts.push('An unfinished test checkout is pending.');
  $('billing-purchases').textContent=parts.join(' ');
 }
 async function refresh(){message('Verifying purchases with Stripe…');display(await call({action:'status'}));message('Sandbox purchase status verified.');}
 function redirect(value,host){const url=new URL(value.url);if(url.protocol!=='https:'||url.hostname!==host||url.username||url.password||url.port)throw Error('Unexpected payment redirect.');location.assign(url.href);}
 $('billing-refresh').onclick=()=>run(refresh);
 $('billing-checkout').onclick=()=>run(async()=>{message('Preparing test checkout…');const item=$('billing-item').value;const requestId=crypto.randomUUID();redirect(await call({action:'checkout',item,request_id:requestId}),'checkout.stripe.com');});
 $('billing-portal').onclick=()=>run(async()=>{message('Opening test billing management…');redirect(await call({action:'portal'}),'billing.stripe.com');});
 try{
  client=window.BREAK_ROOM_SUPABASE.createClient(config.url,config.publishableKey,{auth:{storageKey:'br:supabase:auth',flowType:'pkce',detectSessionInUrl:false,persistSession:true,autoRefreshToken:true}});
  const adopt=session=>{const id=session?.user.id||null;if(id!==actor){generation++;actor=id;$('billing-purchases').textContent='Purchase status has not been verified.';} $('billing-actor').textContent=actor?'Signed in as '+(session.user.email||'your account')+'.':'Log in to your Break Room account to test payments.';$('billing-login').hidden=!!actor;buttons();};
  const {data,error}=await client.auth.getSession();if(error)throw error;adopt(data.session);
  client.auth.onAuthStateChange((_event,session)=>{adopt(session);});
  const response=await fetch(config.url+'/functions/v1/billing',{headers:{apikey:config.publishableKey},signal:AbortSignal.timeout(15000)});const setup=await response.json();configured=response.ok&&setup.environment==='sandbox'&&setup.configured===true;buttons();
  if(!configured)throw Error('Sandbox billing is not ready. Please try again later.');
  const returned=new URL(location.href).searchParams.has('returned'),canceled=new URL(location.href).searchParams.has('canceled');
  if(returned||canceled)history.replaceState(null,'',location.pathname);
  if(actor)await run(refresh);else message('Sandbox ready. Log in, then refresh this page.');
  if(canceled)message('Checkout was closed. Refresh purchase status to check whether any payment completed.');
 }catch(error){message(error.message||'Could not load the sandbox.',true);buttons();}
})();
