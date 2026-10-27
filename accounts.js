/* Supabase owns authentication. Game saves stay native; cloud activation is explicit. */
(() => {
 'use strict';
 const config=window.BREAK_ROOM_ACCOUNT_CONFIG, saves=window.BREAK_ROOM_CLOUD_SAVES;
 const base=new URL('.',document.currentScript.src),accountURL=new URL('account.html',base).href;
 const generationKey='br:cloud:generation',ownerKey='br:cloud:owner',guestKey='br:cloud:guest',cacheKey=id=>'br:cloud:cache:'+id;
 const $=id=>document.getElementById(id),isAccount=!!$('account-content'),isGame=location.pathname.includes('/games/');
 let resolveReady;const ready=new Promise(resolve=>resolveReady=resolve);
 let client=null,session=null,busy=false,lastUploaded='',syncTimer=null,uploadTask=null,initialOwner=null,redirecting=false;
 // Auth, ownership and generation events can arrive together on logout.
 // Navigate once so a second event cannot abort the first page load.
 function openAccount(){if(redirecting)return;redirecting=true;location.replace(accountURL);}
 const storage=()=>window.localStorage;
 const owner=()=>storage().getItem(ownerKey);
 const snapshot=()=>saves.capture(storage());
 const backup=(key,data)=>storage().setItem(key,JSON.stringify(data));
 const loadBackup=key=>JSON.parse(storage().getItem(key)||'null');
 function status(text,error=false){
  for(const el of document.querySelectorAll('[data-account-status]')){el.textContent=text;el.dataset.error=String(error);}
 }
 function notify(text){window.dispatchEvent(new CustomEvent('break-room:account',{detail:{text}}));}
 function label(){return session?.user.user_metadata?.display_name||session?.user.email?.split('@')[0]||'Player';}
 function render(){
  for(const a of document.querySelectorAll('a[href]')){
   const href=new URL(a.getAttribute('href'),location.href);
   if((href.href===new URL('login.html',base).href||a.dataset.accountLink==='true') && (a.closest('header')||a.closest('nav'))){a.dataset.accountLink='true';a.textContent=session?'ACCOUNT':'LOG IN';a.href=session?accountURL:new URL('login.html',base).href;}
  }
  const signed=!!session;
  if($('signed-in'))$('signed-in').hidden=!signed;
  if($('signed-out'))$('signed-out').hidden=signed;
  if($('account-name'))$('account-name').textContent=label();
  if($('account-email'))$('account-email').textContent=session?.user.email||'';
  if($('cloud-active'))$('cloud-active').textContent=signed&&owner()===session.user.id?'Cloud saves are active on this browser.':'Choose whether to bring this browser’s guest progress into your account.';
  if($('activate-cloud'))$('activate-cloud').textContent=signed&&owner()===session.user.id?'SYNC & LOAD LATEST SAVES':'USE CLOUD SAVES';
  if($('import-choice'))$('import-choice').hidden=signed&&owner()===session.user.id;
  window.dispatchEvent(new Event('break-room:auth-change'));
  const note=document.querySelector('.profile-storage-note');
  if(note){const text=signed&&owner()===session.user.id?'Your account saves are active here. Open Account to load newer progress from another device. Unlimited practice is not included.':'Saved on this browser. Sign in and activate cloud saves to play across devices. Unlimited practice is not included.';note.textContent=text;}
 }
 const friendly=error=>{
  if(error?.code==='42P01'||error?.code==='PGRST202'||error?.code==='PGRST205')return 'Cloud saves are not set up yet. The site owner needs to run the database setup in Supabase.';
  if(/fetch|network|offline|timeout/i.test(error?.message||''))return 'Could not reach the account service. Your browser saves are safe. Check your connection and try again.';
  if(/invalid login/i.test(error?.message||''))return 'Email or password is incorrect. If you just signed up, check your confirmation email first.';
  return error?.message||'Could not complete this request. Your browser saves are safe.';
 };
 async function authenticated(){const {data,error}=await client.auth.getSession();if(error)throw error;if(!data.session)throw Error('Please sign in again.');return data.session;}
 async function exchange(userId,local){
  const result={};
  for(const game of saves.games){
   let done=false;
   for(let attempt=0;attempt<4;attempt++){
    if((await authenticated()).user.id!==userId)throw Error('Account changed. Please reload this page.');
    const {data,error}=await client.from(game==='shift-work'?'shift_work_saves':game==='hidden-gem'?'hidden_gem_saves':'game_saves').select('data,revision').eq('user_id',userId).eq('game',game).maybeSingle();if(error)throw error;
    const merged=saves.merge(game,local[game]||{},data?.data||{});result[game]=merged;
    if(JSON.stringify(merged)===JSON.stringify(data?.data||{})){done=true;break;}
    const {data:reply,error:writeError}=await client.rpc(game==='shift-work'?'save_shift_work':game==='hidden-gem'?'save_hidden_gem':'save_game',{p_game:game,p_data:merged,p_revision:data?.revision||0});if(writeError){if(['seating-chart','clue-ladder','time-drop','pack','prior','laser','alibi','bouncer','inner-clock'].includes(game)&&/Invalid save|Unsupported save entry|game_saves_game_check/i.test(writeError.message||''))throw Error(({'seating-chart':'Seating Chart','clue-ladder':'Clue Ladder','time-drop':'Time Drop',prior:'Prior',pack:'Pack',laser:'Laser',alibi:'Alibi',bouncer:'Bouncer','inner-clock':'Time Sense'}[game])+' cloud saves need a database update. The site owner must run supabase/inner-clock.sql (the latest complete update, including Seating Chart) in Supabase. Your browser saves are safe.');throw writeError;}
    if(!reply?.conflict){done=true;break;}
   }
   if(!done)throw Error('Another device is saving. Please try syncing again shortly.');
  }
  return result;
 }
 function serial(task){return navigator.locks?navigator.locks.request('break-room-cloud-saves',task):task();}
 function syncUpload(){
  // true = current snapshot uploaded; false = upload failed; null = cloud inactive.
  // Callers must join an upload already in flight, rather than read older scores.
  if(uploadTask)return uploadTask;
  if(busy||!session||document.hidden)return Promise.resolve(null);
  uploadTask=uploadLatest().finally(()=>{uploadTask=null;});
  return uploadTask;
 }
 async function uploadLatest(){
  busy=true;
  try{
   const userId=session.user.id;
   while(owner()===userId&&session?.user.id===userId&&!document.hidden){
    const local=snapshot(),signature=JSON.stringify(local);if(signature===lastUploaded)return true;
    await serial(async()=>{
     if(owner()!==userId||session?.user.id!==userId)return;
     backup(cacheKey(userId),local);
     await exchange(userId,local);
     if(owner()!==userId||session?.user.id!==userId)return;
     lastUploaded=signature;status('Saved to your account. Load cloud saves on your other device before playing.');notify('saved');
    });
    // A game may finish while the previous snapshot is uploading. Drain the latest
    // owned snapshot before resolving sync() to a comparison page.
   }
   return null;
  }catch(error){status(friendly(error),true);return false;}finally{busy=false;}
 }
 function restoreGuest(){
  const id=owner();if(!id)return;
  backup(cacheKey(id),snapshot());
  const guest=loadBackup(guestKey)||Object.fromEntries(saves.games.map(g=>[g,{}]));
  saves.install(storage(),guest);storage().removeItem(ownerKey);storage().setItem(generationKey,crypto.randomUUID());initialOwner=null;
 }
 async function activate(){
  if(busy)return;busy=true;const button=$('activate-cloud');if(button)button.disabled=true;
  try{await serial(async()=>{
   session=await authenticated();const id=session.user.id,current=owner();
   const before=snapshot();
   if(current&&current!==id)throw Error('Return to guest play before switching accounts.');
   if(current===id)backup(cacheKey(id),before);else backup(guestKey,before);
   const cached=loadBackup(cacheKey(id))||Object.fromEntries(saves.games.map(g=>[g,{}]));
   let local=current===id?before:cached;
   if(!current&&$('import-guest')?.checked)local=Object.fromEntries(saves.games.map(g=>[g,saves.merge(g,before[g]||{},cached[g]||{})]));
   status('Syncing your saves…');const merged=await exchange(id,local);
   if((await authenticated()).user.id!==id||owner()!==current)throw Error('Account changed while syncing. Please try again.');
   // Keep an exact local backup before writing; installation rolls back on storage failure.
   backup(cacheKey(id),merged);saves.install(storage(),merged);storage().setItem(ownerKey,id);storage().setItem(generationKey,crypto.randomUUID());initialOwner=id;
   // Lowball percentile data is not a portable save.
   for(const k of ['pc_pct','pc_submitted'])storage().removeItem(k);
   lastUploaded=JSON.stringify(merged);status('Your cloud saves are ready. You can open a game now.');render();window.dispatchEvent(new Event('break-room:saves-loaded'));
  });}catch(error){status(friendly(error),true);}finally{busy=false;if(button)button.disabled=false;}
 }
 async function logout(){
  if(busy)return;
  // Local backups are retained even when the network is unavailable.
  await syncUpload();busy=true;
  try{const id=owner();if(id)backup(cacheKey(id),snapshot());const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;restoreGuest();session=null;status('Signed out. Guest progress restored; your account backup remains on this browser.');render();}
  catch(error){status(friendly(error),true);}finally{busy=false;}
 }
 function download(){
  try{const blob=new Blob([JSON.stringify({format:'break-room-native-saves',version:1,savedAt:new Date().toISOString(),games:saves.capture(storage(),false)},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='break-room-saves.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){status(friendly(error),true);}
 }
 async function submit(event){
  event.preventDefault();const form=event.currentTarget,fields=form.querySelector('fieldset');fields.disabled=true;status('Working…');
  try{
   const email=$('email')?.value.trim(),password=$('password')?.value;
   let result;const redirect=new URL('account.html',base).href;
   if(form.dataset.auth==='signup')result=await client.auth.signUp({email,password,options:{data:{display_name:$('display-name').value.trim()},emailRedirectTo:redirect}});
   else if(form.dataset.auth==='reset')result=await client.auth.resetPasswordForEmail(email,{redirectTo:new URL('reset-password.html',base).href});
   else if(form.dataset.auth==='update')result=await client.auth.updateUser({password});
   else result=await client.auth.signInWithPassword({email,password});
   if(result.error)throw result.error;
   if($('password'))$('password').value='';
   if(form.dataset.auth==='reset'){status('If that address has an account, a password reset link will arrive shortly.');}
   else if(form.dataset.auth==='signup'&&!result.data.session){status('Check your email to confirm your account, then log in. If you already have an account, try logging in or resetting your password.');}
   else if(form.dataset.auth==='update'){openAccount();}
   else openAccount();
  }catch(error){status(friendly(error),true);}finally{fields.disabled=false;}
 }
 async function boot(){
  try{
   initialOwner=owner();
   if(!config||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url)||!config.publishableKey.startsWith('sb_publishable_'))throw Error('Account service is not configured. Guest games still work.');
   client=window.BREAK_ROOM_SUPABASE.createClient(config.url,config.publishableKey,{auth:{storageKey:'br:supabase:auth',flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
   // Register listeners before enabling a form. Without JS the form stays disabled.
   for(const form of document.querySelectorAll('form[data-auth]'))form.addEventListener('submit',submit);
   const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session;
   if(owner()&&owner()!==session?.user.id){if(!isAccount){openAccount();return;}restoreGuest();}
   client.auth.onAuthStateChange((event,next)=>{session=next;setTimeout(()=>{
    if(owner()&&owner()!==next?.user.id){if(isAccount){try{restoreGuest();}catch(e){status(friendly(e),true);}}else{openAccount();return;}}
    render();
    if(event==='PASSWORD_RECOVERY'&&location.pathname.endsWith('/reset-password.html')){$('password-fields').disabled=false;status('Choose your new password.');}
   },0);});
   for(const form of document.querySelectorAll('form[data-auth]')){
    const update=form.dataset.auth==='update';form.querySelector('fieldset').disabled=update&&!session;
    if(update&&!session)status('Open the password reset link from your email, or request a new one.');
   }
   if($('activate-cloud'))$('activate-cloud').onclick=activate;
   if($('sign-out'))$('sign-out').onclick=logout;
   if($('export-saves'))$('export-saves').onclick=download;
   render();
   window.addEventListener('storage',event=>{
    if(event.key===generationKey&&isGame){openAccount();return;}
    if(event.key===ownerKey&&owner()!==initialOwner){openAccount();return;}
    if(event.key&&saves.games.some(g=>saves.belongs(g,event.key)))schedule();
   });
   window.addEventListener('break-room:save',schedule);
   window.addEventListener('online',()=>syncUpload());
   syncTimer=setInterval(()=>syncUpload(),15000);
   // Never overwrite game storage while an engine is running. Downloads happen only
   // on the account screen; other pages just upload local changes after play.
   if(!isAccount)syncUpload();
  }catch(error){status(friendly(error),true);}finally{resolveReady();}
 }
 function schedule(){clearTimeout(schedule.timer);schedule.timer=setTimeout(()=>syncUpload(),800);}
 window.BREAK_ROOM_ACCOUNTS=Object.freeze({sync:syncUpload,ready,getUser:()=>session?.user||null,
  async friendsRPC(name,args={}){await ready;if(!['friend_hub','friend_scores','hidden_gem_friend_scores','shift_work_friend_scores','league_hub'].includes(name))throw Error('Unknown friends operation.');if(!client||!session)throw Error('Please sign in to use friends.');const {data,error}=await client.rpc(name,args);if(error)throw error;return data;}
 });
 boot();
})();
