/* Read-only, account-scoped access preview. No checkout or native save code. */
(async()=>{
 'use strict';
 const $=id=>document.getElementById(id),policy=BREAK_ROOM_MEMBERSHIP_POLICY,config=BREAK_ROOM_ACCOUNT_CONFIG;
 const names=['Laser','Time Drop','Clue Ladder','Seating Chart','Desk Jam','Codebreak','Stack Up','Pack','Lowball','Time Sense'];
 let actor=null,epoch=0,busy=false;
 const controls=()=>{$('refresh').disabled=!actor||busy;};
 const clear=()=>{$('results').replaceChildren();};
 const client=BREAK_ROOM_SUPABASE.createClient(config.url,config.publishableKey,{auth:{storageKey:'br:supabase:auth',flowType:'pkce',detectSessionInUrl:false,persistSession:true,autoRefreshToken:true}});
 const adopt=session=>{const id=session?.user.id||null;if(id!==actor){epoch++;actor=id;busy=false;clear();$('message').textContent='Purchase status has not been checked.';}$('actor').textContent=actor?'Signed in as '+session.user.email:'Sign in to check your own purchases.';$('login').hidden=!!actor;controls();};
 $('environment').onchange=()=>{epoch++;busy=false;clear();$('message').textContent='Check this environment to view its access decisions.';controls();};
 $('refresh').onclick=async()=>{
  if(!actor||busy)return;const expected=actor,generation=epoch,environment=$('environment').value;busy=true;clear();controls();$('message').textContent='Verifying purchase records…';
  try{
   const first=await client.auth.getSession();if(first.error||first.data.session?.user.id!==expected)throw Error('Account changed. Sign in again.');
   const response=await fetch(config.url+'/functions/v1/'+(environment==='live'?'billing-live':'billing'),{method:'POST',headers:{apikey:config.publishableKey,Authorization:'Bearer '+first.data.session.access_token,'Content-Type':'application/json'},body:JSON.stringify({action:'status'}),signal:AbortSignal.timeout(90000)});
   const status=await response.json(),current=await client.auth.getSession();
   if(epoch!==generation||actor!==expected||current.error||current.data.session?.user.id!==expected)return;
   if(!response.ok||status.environment!==environment||status.verified!==true||status.configured!==true||!Array.isArray(status.games))throw Error('Purchase status could not be verified. Try again.');
   policy.games.forEach((game,i)=>{const section=document.createElement('section'),heading=document.createElement('h2'),daily=document.createElement('p'),unlimited=document.createElement('p');heading.textContent=names[i];daily.textContent='Daily: free';unlimited.textContent='Unlimited: '+(policy.hasAccess(status,game,environment)?'would allow':'would require a purchase');section.dataset.game=game;section.append(heading,daily,unlimited);$('results').append(section);});
   $('message').textContent=(environment==='sandbox'?'Sandbox':'Live')+' records verified. Preview only; normal game access is unchanged.';
  }catch(error){if(epoch===generation){clear();$('message').textContent=error.message||'Verification unavailable. Try again.';}}
  finally{if(epoch===generation){busy=false;controls();}}
 };
 try{const {data,error}=await client.auth.getSession();if(error)throw error;adopt(data.session);client.auth.onAuthStateChange((_event,session)=>adopt(session));}
 catch{clear();$('message').textContent='Sign-in could not be checked. Reload to retry.';}
})();
