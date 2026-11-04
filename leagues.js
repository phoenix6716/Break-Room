/* Private weekly leagues. No raw saves, answers or client-submitted scores. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),api=window.BREAK_ROOM_ACCOUNTS,M=window.BREAK_ROOM_LEAGUES;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const format=n=>new Intl.NumberFormat('en-AU',{maximumFractionDigits:1}).format(n);
let state=null,busy=false,request=0,userId=null,selected=null,confirmation=null,inviteLeague=null,refreshQueued=false,refreshTimer=null;
function status(message,error=false){$('league-status').textContent=message;$('league-status').dataset.error=String(error);}
function controls(disabled){for(const n of document.querySelectorAll('#league-content button,#league-content fieldset,#league-select'))n.disabled=disabled;$('league-content').setAttribute('aria-busy',String(disabled));}
function clearBoard(){state=null;selected=null;confirmation=null;inviteLeague=null;$('league-confirm').hidden=true;$('league-board').hidden=true;$('league-standings').replaceChildren();$('required-games').replaceChildren();$('league-select').replaceChildren(el('option',null,'Choose a league'));$('league-invite').hidden=true;$('league-invite-url').value='';$('league-title').textContent='';}
function clearPrivate(){request++;clearBoard();$('league-content').hidden=true;for(const id of ['league-name','league-display-name','join-display-name'])$(id).value='';for(const id of ['league-display-name','join-display-name'])$(id).readOnly=false;$('create-league-consent').checked=false;$('join-league-consent').checked=false;controls(true);}
function message(error){if(['42P01','42883','PGRST202','PGRST205','3F000'].includes(error?.code))return 'Leagues are not available yet. Please try again shortly.';if(/fetch|network|offline/i.test(error?.message||''))return 'Could not connect. Reconnect and refresh; your game saves are safe.';return error?.message||'Could not update leagues. Please try again.';}
function showRequired(){
 $('league-dates').textContent=state.week+' to '+state.end+' · 2,100 points available';
 $('required-games').replaceChildren(...state.required.map(id=>{const card=el('article','league-game'),img=el('img');img.src='assets/cards/'+id+'-pixel.webp';img.alt='';const text=el('div');text.append(el('span','eyebrow','REQUIRED / UP TO 700'),el('h3',null,M.name(id)));const link=el('a','button secondary','PLAY DAILY →');link.href='games/'+id+'/index.html';text.append(link);card.append(img,text);return card;}));
}
function confirmAction(args,text){confirmation=args;$('league-confirm-text').textContent=text;$('league-confirm').hidden=false;$('confirm-league-action').focus();}
function renderBoard(){
 const league=state.selected;
 $('league-board').hidden=!league;$('league-confirm').hidden=true;confirmation=null;
 if(!league){$('league-standings').replaceChildren();return;}
 selected=league.id;$('league-select').value=selected;$('league-title').textContent=league.name;$('league-owner').hidden=!league.owner;
 if(inviteLeague!==league.id){$('league-invite').hidden=true;$('league-invite-url').value='';inviteLeague=null;}
 $('league-standings').replaceChildren(...league.rows.map(row=>{
  const card=el('article','league-entry'+(row.self?' you':''));card.dataset.user=row.id;
  const heading=el('div','league-entry-head'),person=el('div','league-player');
  person.append(el('span','eyebrow','PLACE '+row.rank),el('strong',null,row.name+(row.self?' · You':'')),el('small',null,(row.owner?'League owner · ':'')+row.completed+' / 21 counted Dailies'));
  const total=el('div','league-total',format(row.total));total.append(el('small',null,'/ 2,100 POINTS'));heading.append(person,total);card.append(heading);
  const slots=el('div','league-slots');
  for(const id of [...state.required,row.optional]){
   const g=row.games.find(x=>x.game===id),slot=el('div','league-slot');
   slot.append(el('span',null,state.required.includes(id)?'REQUIRED':'BEST OPTIONAL'),el('strong',null,id?M.name(id):'Play another game'),el('small',null,g?format(g.total)+' / 700 · '+g.completed+' / 7 Dailies':'0 / 700 · No optional Daily yet'));slots.append(slot);
  }card.append(slots);
  const details=el('details'),summary=el('summary',null,'Daily score breakdown');details.append(summary);
  const wrap=el('div','league-daily'),table=el('table');table.append(el('caption',null,'All ten games shown. Counted games are marked *. A dash means no synced result and contributes zero. Future days also show a dash.'));
  const thead=el('thead'),hr=el('tr');hr.append(el('th',null,'Game'));for(const d of ['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Total'])hr.append(el('th',null,d));thead.append(hr);table.append(thead);
  const body=el('tbody');for(const g of row.games){const tr=el('tr'),th=el('th',null,M.name(g.game)+(g.counted?' *':''));th.scope='row';tr.append(th);for(const score of g.scores)tr.append(el('td',null,score===null?'—':format(score)));tr.append(el('td',null,format(g.total)));body.append(tr);}table.append(body);wrap.append(table);details.append(wrap);card.append(details);
  if(league.owner&&!row.self){const remove=el('button','remove-member','REMOVE PLAYER');remove.type='button';remove.setAttribute('aria-label','Remove '+row.name);remove.onclick=()=>confirmAction({p_action:'remove',p_league:league.id,p_target:row.id},'Remove '+row.name+'? They will lose access and cannot rejoin using an invite.');card.append(remove);}
  return card;
 }));
}
function render(){
 $('league-guest').hidden=true;$('league-content').hidden=false;showRequired();
 const select=$('league-select');select.replaceChildren(el('option',null,'Choose a league'));
 select.firstChild.value='';for(const league of state.leagues){const option=el('option',null,league.name+(league.owner?' · Owner':''));option.value=league.id;select.append(option);}
 if(!state.me){const name=api.getUser()?.user_metadata?.display_name||'';for(const id of ['league-display-name','join-display-name'])if(!$(id).value)$(id).value=name;}
 else for(const id of ['league-display-name','join-display-name']){$(id).value=state.me.name;$(id).readOnly=true;}
 renderBoard();
}
async function load(args={},success){
 if(busy){if(!args.p_action)refreshQueued=true;return;}refreshQueued=false;const who=api.getUser();if(!who){clearPrivate();$('league-guest').hidden=false;status('Sign in to create or join a private league.');return;}
 busy=true;controls(true);const id=++request,expected=who.id;
 try{
  const synced=await api.sync();if(id!==request||api.getUser()?.id!==expected)return;
  const result=await api.friendsRPC('league_hub',args);if(id!==request||api.getUser()?.id!==expected)return;
  state=result;
  if(!state.selected&&selected&&state.leagues.some(l=>l.id===selected)){
   state=await api.friendsRPC('league_hub',{p_action:'view',p_league:selected});if(id!==request||api.getUser()?.id!==expected)return;
  }else if(!state.selected&&state.leagues.length===1&&args.p_action!=='leave'){
   state=await api.friendsRPC('league_hub',{p_action:'view',p_league:state.leagues[0].id});if(id!==request||api.getUser()?.id!==expected)return;
  }
  render();
  if(result.invite&&state.selected){const url=new URL('leagues.html',location.href);url.hash='join='+result.invite;$('league-invite-url').value=url.href;$('league-invite').hidden=false;inviteLeague=state.selected.id;}
  if(args.p_action==='create'){$('league-name').value='';$('create-league-consent').checked=false;}
  if(args.p_action==='join'){$('league-token').value='';$('join-league-consent').checked=false;try{sessionStorage.removeItem('br:league:invite');}catch{}}
  status(synced===false?'Your new browser results could not sync. Showing saved cloud scores; we will retry automatically when you reconnect.':api.cloudActive?.()===false?'Your account progress has not loaded yet. Reconnect and reopen this page; your browser saves are safe.':success||(state.leagues.length?'Showing the latest synced Daily scores.':'Create a league or join one with an invite.'),synced===false);
 }catch(error){if(id===request){clearBoard();status(message(error),true);}}
 finally{busy=false;controls(!api.getUser());if(api.getUser()?.id!==expected)load();else if(refreshQueued)scheduleRefresh();}
}
$('create-league').onsubmit=e=>{e.preventDefault();load({p_action:'create',p_name:$('league-name').value.trim(),p_display_name:$('league-display-name').value.trim(),p_consent:$('create-league-consent').checked},'League created. Make an invite link to bring your friends.');};
$('join-league').onsubmit=e=>{e.preventDefault();const token=M.invite($('league-token').value);if(!token){status('Paste a complete league invite link or its 32-character code.',true);return;}load({p_action:'join',p_token:token,p_display_name:$('join-display-name').value.trim(),p_consent:$('join-league-consent').checked},'You joined the league. This week’s synced Dailies now count.');};
$('league-select').onchange=()=>{const id=$('league-select').value;selected=id||null;if(id)load({p_action:'view',p_league:id});else{state.selected=null;renderBoard();}};
$('refresh-leagues').onclick=()=>load();
function scheduleRefresh(){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{if(!document.hidden)load();},250);}
window.addEventListener('break-room:save',scheduleRefresh);
window.addEventListener('storage',event=>{if(event.key&&window.BREAK_ROOM_CLOUD_SAVES.games.some(g=>window.BREAK_ROOM_CLOUD_SAVES.belongs(g,event.key)))scheduleRefresh();});
$('invite-league').onclick=()=>load({p_action:'invite',p_league:selected},'New invite link ready. Previous links no longer work.');
$('copy-league-invite').onclick=async()=>{try{await navigator.clipboard.writeText($('league-invite-url').value);status('Invite link copied.');}catch{$('league-invite-url').focus();$('league-invite-url').select();status('Select and copy the invite link above.');}};
$('leave-league').onclick=()=>confirmAction({p_action:'leave',p_league:selected},state.selected.owner?'Leave this league? Ownership passes to its longest-standing remaining member. If you are the last member, the league closes.':'Leave this league? You will lose access and your scores will disappear from its standings.');
$('confirm-league-action').onclick=()=>{const action=confirmation;if(!action)return;if(action.p_action==='leave')selected=null;load(action,action.p_action==='leave'?'You left the league.':'Player removed.');};
$('cancel-league-action').onclick=()=>{$('league-confirm').hidden=true;confirmation=null;$('leave-league').focus();};
async function boot(){
 try{
  const token=new URLSearchParams(location.hash.slice(1)).get('join');if(token){if(M.invite(token)){try{sessionStorage.setItem('br:league:invite',token);}catch{}$('league-token').value=token;}history.replaceState(null,'',location.pathname+location.search);}
  if(!$('league-token').value)try{$('league-token').value=sessionStorage.getItem('br:league:invite')||'';}catch{}
  await api.ready;userId=api.getUser()?.id||null;
  window.addEventListener('break-room:auth-change',()=>{const next=api.getUser()?.id||null;if(next===userId)return;userId=next;clearPrivate();$('league-guest').hidden=!!next;if(!busy)load();});
  await load();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
  setInterval(()=>{if(!document.hidden)load();},60000);
 }catch(error){status(message(error),true);}
}
boot();
})();
