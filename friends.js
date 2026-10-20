/* Private friend metadata and server-derived scores. No raw saves or demo players. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id),api=window.BREAK_ROOM_ACCOUNTS,score=window.BREAK_ROOM_SCORE;
 const games=[['lowball','LOWBALL'],['stake','STAKE'],['stack-up','STACK UP']];
 let hub=null,records=[],today=null,userId=null,requestId=0,busy=false,settingsDirty=false;
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 function status(text,error=false){$('friend-status').textContent=text;$('friend-status').dataset.error=String(error);}
 function errorText(error){if(['42P01','PGRST202','PGRST205'].includes(error?.code))return 'Friends setup is not installed yet. The site owner needs to run the friends database script in Supabase.';if(/fetch|network|offline/i.test(error?.message||''))return 'Could not connect. Check your connection and refresh. Your game saves are safe.';return error?.message||'Could not update your friends. Please try again.';}
 function controls(disabled){for(const e of document.querySelectorAll('#friend-content button,#friend-content fieldset,#enable-friends fieldset'))e.disabled=disabled;$('friend-content').setAttribute('aria-busy',String(disabled));}
 function clearPrivate(){settingsDirty=false;hub=null;records=[];requestId++;for(const id of ['incoming-list','outgoing-list','friends-list','blocked-list','friend-score-list'])$(id).replaceChildren();$('my-friend-code').textContent='';$('friend-name').value='';$('friend-code').value='';$('friend-content').hidden=true;$('friend-onboarding').hidden=true;controls(true);}
 function list(id,people,actions,empty){
  $(id).replaceChildren(...people.map(person=>{
   const row=node('div','friend-person'),name=node('div');name.append(node('strong',null,person.name));if('sharing'in person)name.append(node('small',null,person.sharing?'Sharing completed Daily scores':'Score sharing is off'));
   const buttons=node('div','friend-actions');for(const [action,label]of actions){const button=node('button',action,label);button.type='button';button.setAttribute('aria-label',label+' '+person.name);button.onclick=()=>mutate({p_action:action,p_target:person.id},action==='remove'?'Friend removed.':action==='block'?'Player blocked.':action==='accept'?'Friend request accepted.':'Updated.');buttons.append(button);}row.append(name,buttons);return row;
  }));if(!people.length)$(id).append(node('p','friend-empty',empty));
 }
 function renderHub(){
  $('friend-guest').hidden=true;$('friend-onboarding').hidden=!!hub.me;$('friend-content').hidden=!hub.me;
  if(!hub.me){$('initial-name').value=api.getUser()?.user_metadata?.display_name||'';controls(false);return;}
  $('my-friend-code').textContent=hub.me.code.match(/.{1,4}/g).join('-');if(!settingsDirty){$('friend-name').value=hub.me.name;$('share-scores').checked=hub.me.sharing;}
  for(const [id,key]of [['incoming-count','incoming'],['outgoing-count','outgoing'],['friends-count','friends']])$(id).textContent=hub[key].length;
  list('incoming-list',hub.incoming,[['accept','Accept'],['decline','Decline'],['block','Block']],'No incoming requests.');
  list('outgoing-list',hub.outgoing,[['cancel','Cancel']],'No pending requests.');
  list('friends-list',hub.friends,[['remove','Remove'],['block','Block']],'Share your code to invite your first friend.');
  list('blocked-list',hub.blocked,[['unblock','Unblock']],'No blocked players.');
 }
 function compare(){
  if(!hub?.me||!today)return;
  const history=$('comparison-window').value==='history',selected=$('comparison-game').value;
  const visible=records.filter(r=>(history||r.date===today)&&(selected==='all'||r.game===selected));
  $('comparison-basis').textContent=history?'Arcade averages over 120 Sydney calendar dates, including '+today+'. Each played game has equal weight.':'Completed Dailies for '+today+' · resets at midnight Sydney time. A dash means no shared completed result.';
  const people=[{...hub.me,self:true},...hub.friends];
  const rows=people.map(person=>{
   const own=visible.filter(r=>r.user_id===person.id),summary=score.summary(own,today,selected==='all'?games.map(g=>g[0]):[selected]);return {person,summary};
  }).sort((a,b)=>(b.summary.average??-1)-(a.summary.average??-1)||a.person.name.localeCompare(b.person.name));
  $('friend-score-list').replaceChildren(...rows.map(({person,summary})=>{
   const card=node('article','friend-score'+(person.self?' you':''));card.dataset.user=person.id;
   const title=node('div','score-name',person.name+(person.self?' · You':''));title.append(node('small',null,person.self?(person.sharing?'Your scores are shared with accepted friends':'Your score sharing is off'):person.sharing?'Friend':'Score sharing is off'));
   const overall=node('div','score-cell overall');overall.append(node('span',null,selected==='all'?'ARCADE AVERAGE':'GAME AVERAGE'),node('strong',null,score.format(summary.average)));
   card.append(title,overall);
   for(const [id,name]of games){const cell=node('div','score-cell');const result=summary.games.find(g=>g.id===id);cell.append(node('span',null,name),node('strong',null,score.format(result?.average??null)));card.append(cell);}
   card.append(node('div','score-detail',summary.runs?`${summary.gamesPlayed} ${summary.gamesPlayed===1?'game':'games'} · ${summary.runs} completed ${summary.runs===1?'Daily':'Dailies'} · scores out of 100`:'No shared completed results for this selection.'));return card;
  }));
 }
 async function refresh(message='Showing your latest cloud scores.'){
  if(busy)return;const user=api.getUser();if(!user){clearPrivate();$('friend-guest').hidden=false;status('Sign in to join your friends.');return;}
  busy=true;const id=++requestId,expected=user.id;controls(true);
  try{
   const next=await api.friendsRPC('friend_hub');if(id!==requestId||api.getUser()?.id!==expected)return;
   hub=next;records=[];today=null;renderHub();$('friend-score-list').replaceChildren();
   if(hub.me){const result=await api.friendsRPC('friend_scores');if(id!==requestId||api.getUser()?.id!==expected)return;records=result.records;today=result.today;compare();}
   status(hub.me?message:'Choose a name and create your friend code.');
  }catch(error){if(id===requestId){records=[];$('friend-score-list').replaceChildren();status(errorText(error),true);}}
  finally{busy=false;controls(!api.getUser());if(api.getUser()?.id!==expected)refresh();}
 }
 async function mutate(args,message){
  if(busy)return;busy=true;controls(true);const expected=api.getUser()?.id,id=++requestId;
  try{const next=await api.friendsRPC('friend_hub',args);if(id!==requestId||api.getUser()?.id!==expected)return;hub=next;if(args.p_action==='settings')settingsDirty=false;records=[];today=null;renderHub();$('friend-score-list').replaceChildren();status(message);$('friend-status').focus({preventScroll:true});}
  catch(error){if(id===requestId)status(errorText(error),true);return;}
  finally{busy=false;controls(!api.getUser());if(api.getUser()?.id!==expected)refresh();}
  await refresh(message);
 }
 $('enable-friends').onsubmit=e=>{e.preventDefault();mutate({p_action:'enable',p_name:$('initial-name').value.trim(),p_share:$('initial-sharing').checked},'Your friend code is ready.');};
 $('request-friend').onsubmit=e=>{e.preventDefault();const code=$('friend-code').value.trim();if(!/^[a-f0-9\s-]{16,32}$/i.test(code)){status('Enter the full 16-character friend code.',true);return;}mutate({p_action:'request',p_code:code},'Request sent. Your friend needs to accept it.');};
 $('friend-settings').oninput=()=>settingsDirty=true;
 $('friend-settings').onsubmit=e=>{e.preventDefault();mutate({p_action:'settings',p_name:$('friend-name').value.trim(),p_share:$('share-scores').checked},'Your name and sharing setting are saved.');};
 $('comparison-window').onchange=compare;$('comparison-game').onchange=compare;
 $('refresh-friends').onclick=async()=>{await api.sync();await refresh();};
 $('copy-code').onclick=async()=>{try{await navigator.clipboard.writeText($('my-friend-code').textContent);status('Friend code copied.');}catch{status('Could not copy automatically. Select the code above and copy it.');}};
 async function boot(){try{await api.ready;userId=api.getUser()?.id||null;await refresh();window.addEventListener('break-room:auth-change',()=>{const next=api.getUser()?.id||null;if(next===userId)return;userId=next;clearPrivate();$('friend-guest').hidden=!!next;status(next?'Loading your friends…':'Sign in to join your friends.');if(!busy)refresh();});document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});setInterval(()=>{if(!document.hidden)refresh();},60000);}catch(error){status(errorText(error),true);}}
 boot();
})();
