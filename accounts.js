/* Signed-in saves restore and upload automatically; guest/account storage stays separate. */
(() => {
 'use strict';
 const config=window.BREAK_ROOM_ACCOUNT_CONFIG, saves=window.BREAK_ROOM_CLOUD_SAVES;
 const base=new URL('.',document.currentScript.src),pageURL=name=>window.BREAK_ROOM_URLS?.clean(new URL(name,base).href)||new URL(name,base).href,accountURL=pageURL('account.html');
 const generationKey='br:cloud:generation',ownerKey='br:cloud:owner',guestKey='br:cloud:guest',cacheKey=id=>'br:cloud:cache:'+id;
 const $=id=>document.getElementById(id),isAccount=!!$('account-content'),isGame=location.pathname.includes('/games/'),isProfile=!!document.querySelector('.profile-page'),isSocial=!!document.querySelector('#friend-content,#league-content,#leaderboard-content');
 const isRecovery=!!document.querySelector('form[data-auth=update]'),recoveryCode=new URL(location.href).searchParams.has('code'),recoveryLink=isRecovery&&(recoveryCode||new URLSearchParams(location.hash.slice(1)).has('access_token')||new URLSearchParams(location.hash.slice(1)).has('error'));
 let resolveReady;const ready=new Promise(resolve=>resolveReady=resolve);
 let recoveryMailer=null;
 let client=null,session=null,busy=false,lastUploaded='',syncTimer=null,uploadTask=null,initialOwner=null,restoredFor=null,redirecting=false,loggingOut=false;
 // Auth, ownership and generation events can arrive together on logout.
 // Navigate once so a second event cannot abort the first page load.
 function openAccount(continueGame=false){if(redirecting)return;redirecting=true;const url=new URL(accountURL);if(continueGame)url.searchParams.set('continue',location.pathname+location.search+location.hash);location.replace(url.href);}
 const storage=()=>window.localStorage;
 const owner=()=>storage().getItem(ownerKey);
 const snapshot=()=>saves.capture(storage());
 const signatureOf=data=>JSON.stringify(saves.games.map(game=>[game,Object.entries(data[game]||{}).sort(([a],[b])=>a.localeCompare(b))]));
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
   if((href.href===new URL('login.html',base).href||href.href===pageURL('login.html')||a.dataset.accountLink==='true') && (a.closest('header')||a.closest('nav'))){a.dataset.accountLink='true';a.textContent=session?'ACCOUNT':'LOG IN';a.href=session?accountURL:new URL('login.html',base).href;}
  }
  const signed=!!session;
  if($('signed-in'))$('signed-in').hidden=!signed;
  if($('signed-out'))$('signed-out').hidden=signed;
  if($('account-name'))$('account-name').textContent=label();
  if($('account-email'))$('account-email').textContent=session?.user.email||'';
  window.dispatchEvent(new Event('break-room:auth-change'));
  const note=document.querySelector('.profile-storage-note');
  if(note){const text=signed&&owner()===session.user.id?'Your account progress saves and loads automatically. Unlimited practice is not included.':'Saved on this browser. Sign in to save and continue across devices. Unlimited practice is not included.';note.textContent=text;}
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
  async function exchangeGame(game){
   let done=false;
   for(let attempt=0;attempt<4;attempt++){
    if((await authenticated()).user.id!==userId)throw Error('Account changed. Please reload this page.');
    const {data,error}=await client.from(game==='codebreak'?'codebreak_saves':game==='shift-work'?'shift_work_saves':game==='hidden-gem'?'hidden_gem_saves':'game_saves').select('data,revision').eq('user_id',userId).eq('game',game).maybeSingle();if(error)throw error;
    const merged=saves.merge(game,local[game]||{},data?.data||{});result[game]=merged;
    if(JSON.stringify(merged)===JSON.stringify(data?.data||{})){done=true;break;}
    if((await authenticated()).user.id!==userId)throw Error('Account changed. Please reload this page.');
    const {data:reply,error:writeError}=await client.rpc(game==='codebreak'?'save_codebreak':game==='shift-work'?'save_shift_work':game==='hidden-gem'?'save_hidden_gem':'save_game',{p_game:game,p_data:merged,p_revision:data?.revision||0});if(writeError){if(['seating-chart','clue-ladder','time-drop','pack','prior','laser','alibi','bouncer','inner-clock'].includes(game)&&/Invalid save|Unsupported save entry|game_saves_game_check/i.test(writeError.message||''))throw Error(({'seating-chart':'Seating Chart','clue-ladder':'Clue Ladder','time-drop':'Time Drop',prior:'Prior',pack:'Pack',laser:'Laser',alibi:'Alibi',bouncer:'Bouncer','inner-clock':'Time Sense'}[game])+' cloud saves need a database update. The site owner must run supabase/inner-clock.sql (the latest complete update, including Seating Chart) in Supabase. Your browser saves are safe.');throw writeError;}
    if(!reply?.conflict){done=true;break;}
   }
   if(!done)throw Error('Another device is saving. Please try syncing again shortly.');
  }
  // Independent per-game revisions can be exchanged concurrently. Each game still
  // reads, merges and retries serially; stop scheduling work after any failure and
  // drain in-flight requests before releasing the account lock or reporting failure.
  let next=0,failed=false,failure;
  async function worker(){while(!failed){const game=saves.games[next++];if(!game)return;try{await exchangeGame(game);}catch(error){failed=true;failure=error;}}}
  await Promise.all(Array.from({length:Math.min(4,saves.games.length)},()=>worker()));
  if(failed)throw failure;
  return Object.fromEntries(saves.games.map(game=>[game,result[game]]));
 }
 function serial(task){return navigator.locks?navigator.locks.request('break-room-cloud-saves',task):task();}
 function syncUpload(){
  // Resolves true for a current upload, false for a failed upload, or null when
  // cloud saves are inactive. Concurrent callers join the same pending result.
  // Callers must join an upload already in flight, rather than read older scores.
  if(uploadTask)return uploadTask;
  if(loggingOut)return Promise.resolve(null);
  if(busy||!session||document.hidden)return Promise.resolve(null);
  const restore=!isGame&&!document.querySelector('form[data-auth]')&&(!isSocial||restoredFor!==session.user.id);
  // Social pages already restored before ready resolves. Subsequent comparisons
  // only need to drain local uploads; their score RPCs read fresh server records.
  uploadTask=(restore?activate():uploadLatest()).finally(()=>{uploadTask=null;});
  return uploadTask;
 }
 async function uploadLatest(){
  busy=true;
  try{
   const userId=session.user.id;let uploaded=false;
   while(owner()===userId&&session?.user.id===userId&&!document.hidden){
    const local=snapshot(),signature=signatureOf(local);if(signature===lastUploaded){if(uploaded){status('Saved to your account automatically.');notify('saved');}return true;}
    await serial(async()=>{
     if(owner()!==userId||session?.user.id!==userId)return;
     backup(cacheKey(userId),local);
     await exchange(userId,local);
     if(owner()!==userId||session?.user.id!==userId)return;
     lastUploaded=signature;uploaded=true;
    });
    // A game may finish while the previous snapshot is uploading. Drain the latest
    // owned snapshot before resolving sync() to a comparison page.
   }
   return null;
  }catch(error){status(friendly(error),true);return false;}finally{busy=false;}
 }
 function restoreGuest(){
  restoredFor=null;const id=owner();if(!id)return;
  backup(cacheKey(id),snapshot());
  const guest=loadBackup(guestKey)||Object.fromEntries(saves.games.map(g=>[g,{}]));
  saves.install(storage(),guest);storage().removeItem(ownerKey);storage().setItem(generationKey,crypto.randomUUID());initialOwner=null;window.dispatchEvent(new Event('break-room:saves-loaded'));
 }
 async function activate(){
  if(busy)return null;busy=true;
  try{await serial(async()=>{
   const signed=await authenticated(),id=signed.user.id,current=owner();
   if(session?.user.id!==id)throw Error('Account changed. Please reload.');
   const before=snapshot();
   if(current&&current!==id)throw Error('Return to guest play before switching accounts.');
   if(current===id)backup(cacheKey(id),before);else backup(guestKey,before);
   const cached=loadBackup(cacheKey(id))||Object.fromEntries(saves.games.map(g=>[g,{}]));
   let local=current===id?before:cached;
   status('Loading your saved progress…');
   let merged,latest,final;
   // Drain native writes made in another tab while a restore is uploading.
   for(;;){
    merged=await exchange(id,local);
    if((await authenticated()).user.id!==id||owner()!==current)throw Error('Account changed while loading progress. Please reload.');
    latest=snapshot();
    final=current===id?Object.fromEntries(saves.games.map(g=>[g,saves.merge(g,latest[g]||{},merged[g]||{})])):merged;
    if(current!==id||signatureOf(final)===signatureOf(merged))break;
    local=final;
   }
   if(current!==id)backup(guestKey,latest);
   const changed=current!==id||signatureOf(latest)!==signatureOf(final);
   backup(cacheKey(id),final);if(changed){saves.install(storage(),final);storage().setItem(ownerKey,id);storage().setItem(generationKey,crypto.randomUUID());}initialOwner=id;
   // Lowball percentile data is not a portable save.
   for(const k of ['pc_pct','pc_submitted'])storage().removeItem(k);
   lastUploaded=signatureOf(merged);restoredFor=id;status('Your saved progress is up to date.');render();window.dispatchEvent(new Event('break-room:saves-loaded'));
  });return true;}catch(error){status(friendly(error),true);return false;}finally{busy=false;}
 }
 const signOutRequestKey='br:account:sign-out-request';
 function requestSignOut(){
  if(!isGame)return logout();
  // Engines can finalize drafts/timer interruptions on pagehide. Leave them
  // under their original owner before restoring guest storage on Account.
  const token=crypto.randomUUID();sessionStorage.setItem(signOutRequestKey,token);
  const target=new URL(accountURL);target.searchParams.set('signout',token);location.replace(target.href);return Promise.resolve('redirect');
 }
 function consumeSignOut(){
  const token=new URLSearchParams(location.search).get('signout');if(!token)return false;
  try{const expected=sessionStorage.getItem(signOutRequestKey);sessionStorage.removeItem(signOutRequestKey);return token===expected;}catch{return false;}
 }
 async function logout(){
  if(loggingOut||!client)return false;
  const pending=syncUpload();loggingOut=true;
  try{
   await pending;busy=true;
   const id=owner();if(id)backup(cacheKey(id),snapshot());
   const {error}=await client.auth.signOut({scope:'local'});
   // The official SDK may clear its local session even when revocation fails.
   // Complete guest restoration in that case instead of leaving account saves active.
   if(error){const {data}=await client.auth.getSession();if(data.session)throw error;}
   restoreGuest();session=null;status(error?'Signed out on this browser. The account service could not confirm session revocation. Your account backup remains here.':'Signed out. Guest progress restored; your account backup remains on this browser.');render();return true;
  }catch(error){status(friendly(error),true);return false;}finally{busy=false;loggingOut=false;}
 }
 function download(){
  try{const blob=new Blob([JSON.stringify({format:'break-room-native-saves',version:1,savedAt:new Date().toISOString(),games:saves.capture(storage(),false)},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='break-room-saves.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){status(friendly(error),true);}
 }
 // Recovery emails must work on a different device: do not attach a local PKCE verifier.
 function requestRecovery(email){
  if(!recoveryMailer)recoveryMailer=window.BREAK_ROOM_SUPABASE.createClient(config.url,config.publishableKey,{auth:{storageKey:'br:supabase:recovery-request',flowType:'implicit',detectSessionInUrl:false,persistSession:false,autoRefreshToken:false}});
  return recoveryMailer.auth.resetPasswordForEmail(email,{redirectTo:pageURL('reset-password.html')});
 }
 async function submit(event){
  event.preventDefault();const form=event.currentTarget,fields=form.querySelector('fieldset');fields.disabled=true;status('Working…');
  try{
   const email=$('email')?.value.trim(),password=$('password')?.value;
   let result;const redirect=pageURL('account.html');
   if(form.dataset.auth==='signup')result=await client.auth.signUp({email,password,options:{data:{display_name:$('display-name').value.trim()},emailRedirectTo:redirect}});
   else if(form.dataset.auth==='reset')result=await requestRecovery(email);
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
   client=window.BREAK_ROOM_SUPABASE.createClient(config.url,config.publishableKey,{auth:{storageKey:'br:supabase:auth',flowType:isRecovery&&!recoveryCode?'implicit':'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
   // Register listeners before enabling a form. Without JS the form stays disabled.
   for(const form of document.querySelectorAll('form[data-auth]'))form.addEventListener('submit',submit);
   const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session;
   if(owner()&&owner()!==session?.user.id){if(!isAccount){openAccount();return;}restoreGuest();}
   if(isGame&&session&&!owner()){openAccount(true);return;}
   client.auth.onAuthStateChange((event,next)=>{session=next;setTimeout(()=>{
    if(owner()&&owner()!==next?.user.id){if(isGame){openAccount();return;}try{restoreGuest();}catch(e){status(friendly(e),true);}if(next&&!isAccount){openAccount();return;}}
    render();
    if(event==='PASSWORD_RECOVERY'&&next?.user&&/\/reset-password(?:\.html)?$/.test(location.pathname)){$('password-fields').disabled=false;status('Choose your new password.');}
   },0);});
   for(const form of document.querySelectorAll('form[data-auth]')){
    const update=form.dataset.auth==='update';form.querySelector('fieldset').disabled=update&&!session;
    if(update&&!session)status(recoveryLink?'This reset link has expired or could not be verified. Request a new password-reset email.':'Open the password reset link from your email, or request a new one.',recoveryLink);
   }
   if($('sign-out'))$('sign-out').onclick=logout;
   if($('export-saves'))$('export-saves').onclick=download;
   if(isAccount)document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||!session||!uploadTask||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const target=new URL(link.href,base);
    if(target.origin!==base.origin||!(/\/games\//.test(target.pathname)||/\/(?:index\.html|profile(?:\.html)?)?$/.test(target.pathname)))return;
    event.preventDefault();uploadTask.then(ok=>{if(ok)location.assign(target.href);});
   });

   render();
   window.addEventListener('storage',event=>{
    if(event.key===generationKey&&isGame){openAccount();return;}
    if(event.key===ownerKey&&owner()!==initialOwner&&isGame){openAccount();return;}
    if(event.key&&saves.games.some(g=>saves.belongs(g,event.key)))schedule();
   });
   window.addEventListener('break-room:save',schedule);
   window.addEventListener('online',()=>syncUpload());
   document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncUpload();});
   syncTimer=setInterval(()=>syncUpload(),15000);
   if(isAccount&&consumeSignOut()){if(session)await logout();history.replaceState(null,'',accountURL);return;}
   // Never overwrite game storage while an engine is running. Downloads happen only
   // on Account and Profile; game pages only upload local changes after play.
   if(session&&!isGame&&!document.querySelector('form[data-auth]')){
    const restored=await syncUpload();
    if(isAccount&&restored){
     const target=new URLSearchParams(location.search).get('continue');
     if(target){const dest=new URL(target,base);const allowed=['laser','time-drop','clue-ladder','seating-chart','shift-work','codebreak','hidden-gem','stack-up','pack','lowball','inner-clock'].some(id=>(dest.pathname===new URL('games/'+id+'/index.html',base).pathname||dest.pathname===new URL('games/'+id+'/',base).pathname));if(dest.origin===base.origin&&allowed){redirecting=true;location.replace(dest.href);}}
    }
   }
   else if(!isAccount)syncUpload();
  }catch(error){status(friendly(error),true);}finally{resolveReady();}
 }
 function schedule(){clearTimeout(schedule.timer);schedule.timer=setTimeout(()=>syncUpload(),800);}
 async function accountAction(task){
  await ready;if(!client||!session)throw Error('Please sign in again.');
  const id=session.user.id,signed=await authenticated();if(signed.user.id!==id)throw Error('Account changed. Please reload.');
  const check=()=>{if(session?.user.id!==id)throw Error('Account changed. Please reload.');};
  const result=await task(check);check();return result;
 }
 async function socialSettings(name,sharing){
  return accountAction(async check=>{
   const {data:hub,error}=await client.rpc('friend_hub',{p_action:'list'});if(error)throw error;check();
   if(!hub?.me){if(sharing!==undefined)throw Error('Set up Friends first to choose score sharing.');return null;}
   const {data,error:saveError}=await client.rpc('friend_hub',{p_action:'settings',p_name:name??hub.me.name,p_share:sharing??hub.me.sharing});if(saveError)throw saveError;check();return data;
  });
 }
 async function updateName(value){
  const name=value.trim();if([...name].length<2||[...name].length>30)throw Error('Use a display name of 2 to 30 characters.');
  return accountAction(async check=>{
   // Read current consent immediately before editing an existing social profile.
   await socialSettings(name);check();
   const {data,error}=await client.auth.updateUser({data:{display_name:name}});if(error)throw Error('Could not update your account name. If your Friends name changed, try saving again. '+friendly(error));check();
   session={...session,user:data.user};render();return data.user;
  });
 }
 async function updateEmail(value){return accountAction(async check=>{const {data,error}=await client.auth.updateUser({email:value.trim()},{emailRedirectTo:accountURL});if(error)throw error;check();session={...session,user:data.user};render();return data.user;});}
 async function resetPassword(){return accountAction(async check=>{const email=session.user.email;if(!email)throw Error('This account has no email address.');const {error}=await requestRecovery(email);if(error)throw error;check();});}
 window.BREAK_ROOM_ACCOUNTS=Object.freeze({sync:syncUpload,ready,signOut:requestSignOut,exportSaves:download,updateName,updateEmail,resetPassword,setSharing:value=>{if(typeof value!=='boolean')throw Error('Choose a sharing setting.');return socialSettings(undefined,value);},getUser:()=>session?.user||null,
  cloudActive:()=>{try{return !!session&&owner()===session.user.id;}catch{return false;}},
  async leaderboardRPC(name,args={}){await ready;if(!['daily_leaderboard','leaderboard_standings','leaderboard_profile'].includes(name))throw Error('Unknown leaderboard operation.');if(!client)throw Error('Account service is unavailable. Please try again.');if(name==='leaderboard_profile'&&!session)throw Error('Please sign in to manage your public listing.');if(name==='leaderboard_profile'&&args.p_action==='set'&&args.p_expected_user!==session.user.id)throw Error('Account changed. Please reload before changing your listing.');const {data,error}=await client.rpc(name,args);if(error)throw error;return data;},
  async friendsRPC(name,args={}){await ready;if(!['friend_hub','friend_scores','hidden_gem_friend_scores','shift_work_friend_scores','codebreak_friend_scores','league_hub'].includes(name))throw Error('Unknown friends operation.');if(!client||!session)throw Error('Please sign in to use friends.');const {data,error}=await client.rpc(name,args);if(error)throw error;return data;}
 });
 boot();
})();
