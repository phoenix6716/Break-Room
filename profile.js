/* Profile presentation only. The game engines remain the owners of their saves. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), create=(tag,className,text)=>{
    const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;
  };
  const commonScore=new Set(['clue-ladder','time-drop','stack-up']);
  const numbers=new Intl.NumberFormat('en-AU',{maximumFractionDigits:1});
  const dates=new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  const dateLabel=day=>dates.format(new Date(day+'T00:00:00Z'));
  const readCurrent = storage => window.BREAK_ROOM_RECORDS.active(window.BREAK_ROOM_RECORDS.read(storage));
  const url=game=>'games/'+game+'/index.html';
  let model=null,resultPage=0,signature='',achievementPage=0;
  function score(value,game,average=false){
    if(value===null)return '—';
    if(game==='inner-clock')return value.toFixed(3);
    const number=average?Math.round(value*10)/10:value;
    return numbers.format(number);
  }
  function metric(label,value,detail){
    const div=create('div'),dd=create('dd',null,value);div.append(create('dt',null,label),dd);
    if(detail)dd.append(create('small',null,detail));return div;
  }
  function showView(name,focus=false){
    const names=['overview','games','history','achievements'];if(!names.includes(name))name='overview';
    for(const id of names){const active=id===name,tab=$('profile-tab-'+id);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;$('profile-view-'+id).hidden=!active;if(active&&focus)tab.focus();}
  }
  function hashView(){const hash=location.hash.slice(1);return ['achievements','achievements-title'].includes(hash)?'achievements':['history','recent-title','activity-title'].includes(hash)?'history':hash==='games'?'games':'overview';}
  const tabs=[...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab,index)=>{tab.onclick=()=>{const name=tab.id.replace('profile-tab-','');showView(name);history.replaceState(null,'',location.pathname+location.search+(name==='overview'?'':'#'+name));};tab.onkeydown=e=>{let i;if(e.key==='ArrowRight')i=(index+1)%tabs.length;else if(e.key==='ArrowLeft')i=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();tabs[i].click();tabs[i].focus();};});
  window.addEventListener('hashchange',()=>showView(hashView()));showView(hashView());
  function renderDailies(){
    $('profile-dailies').replaceChildren(...model.games.map(game=>{const link=create('a','profile-daily '+game.today),state=game.today==='complete'?'✓ Complete':game.today==='progress'?'Resume →':'Play →';link.href=url(game.id);link.setAttribute('aria-label',game.name+' — '+state.replace(' →',''));link.append(create('strong',null,game.name),create('span',null,state));return link;}));
  }
  function renderGames(){
    const selected=$('profile-game-filter').value||model.games[0]?.id;
    $('profile-game-filter').replaceChildren(...model.games.map(game=>{const option=create('option',null,game.name);option.value=game.id;return option;}));$('profile-game-filter').value=selected;
    $('profile-games').replaceChildren(...model.games.map((game,index)=>{
      const card=create('article','profile-game');card.dataset.game=game.id;card.hidden=game.id!==selected;
      const top=create('div','profile-game-top'),state=game.today==='complete'?'✓ DAILY COMPLETE':game.today==='progress'?'DAILY IN PROGRESS':'DAILY READY';
      top.append(create('span','profile-game-number',String(index+1).padStart(2,'0')),create('span','profile-game-status '+game.today,state));
      const performance=create('div','profile-game-arcade');performance.append(create('span','profile-label',commonScore.has(game.id)?'AVERAGE SCORE · LAST 120 DAYS':'ARCADE AVERAGE · LAST 120 DAYS'));const average=create('strong',null,window.BREAK_ROOM_SCORE.format(game.arcade.average));average.append(create('small',null,' / 100'));performance.append(average,create('p',null,game.arcade.count+' saved Daily '+(game.arcade.count===1?'run':'runs')));
      const metrics=create('dl','profile-metrics');
      const unified=commonScore.has(game.id),values=game.records.map(r=>r.arcadeScore),allAverage=values.length?values.reduce((a,b)=>a+b,0)/values.length:null,allBest=values.length?Math.max(...values):null;
      metrics.append(metric(unified?'Average score':'Original average',unified?window.BREAK_ROOM_SCORE.format(allAverage):score(game.average,game.id,true),unified?'out of 100':game.unit),metric(unified?'Best score':'Original best',unified?window.BREAK_ROOM_SCORE.format(allBest):score(game.best,game.id),unified||game.id==='lowball'?'out of 100':game.unit),metric('Daily runs',numbers.format(game.played),'completed'),metric('History streak',numbers.format(game.streak),game.streak===1?'day':'days'));
      const link=create('a','button',game.today==='complete'?'VIEW DAILY RESULT →':game.today==='progress'?'RESUME DAILY →':'PLAY DAILY →');link.href=url(game.id);link.setAttribute('aria-label',link.textContent.replace(' →','')+' — '+game.name);
      card.append(top,create('span','profile-label',game.category),create('h3',null,game.name),performance,metrics,create('p','profile-game-note',game.note));card.append(link);return card;
    }));
  }
  function renderActivity(){
    const end=Date.parse(model.today+'T00:00:00Z');
    $('activity-days').replaceChildren(...Array.from({length:14},(_,index)=>{
      const day=new Date(end-(13-index)*86400000).toISOString().slice(0,10), completed=model.days.get(day),count=completed?.size||0;
      const names=model.games.filter(g=>completed?.has(g.id)).map(g=>g.name);
      const label=`${dateLabel(day)}: ${count} saved Daily games completed${names.length?' — '+names.join(', '):''}`;
      const li=create('li','activity-day'+(day===model.today?' today':''));li.dataset.count=count;li.setAttribute('aria-label',label);li.title=label;
      if(day===model.today)li.setAttribute('aria-current','date');
      const square=create('span',null,String(count)),caption=create('small',null,day===model.today?'TODAY':day.slice(8));square.setAttribute('aria-hidden','true');caption.setAttribute('aria-hidden','true');li.append(square,caption);return li;
    }));
  }
  function renderResults(){
    const selected=$('result-filter').value, records=model.records.filter(r=>selected==='all'||r.game===selected),pages=Math.max(1,Math.ceil(records.length/5));resultPage=Math.min(resultPage,pages-1);const shown=records.slice(resultPage*5,resultPage*5+5);
    $('recent-count').textContent=records.length?`Showing ${resultPage*5+1}–${resultPage*5+shown.length} of ${records.length} saved Daily results.`:'No saved Daily results'+(selected==='all'?' yet.':' for this game yet.');
    const list=$('recent-results');
    list.replaceChildren(...shown.map(record=>{
      const game=model.games.find(g=>g.id===record.game),row=create('article','profile-result');row.dataset.game=record.game;
      const info=create('div'),link=create('a',null,game.name);link.href=url(game.id);
      const time=create('time',null,dateLabel(record.date)+(record.date===model.today?' · Today':''));time.dateTime=record.date;link.append(time);info.append(link);
      const value=create('div','profile-result-score',window.BREAK_ROOM_SCORE.format(record.arcadeScore)+' / 100');if(!commonScore.has(record.game))value.append(create('small',null,score(record.score,record.game)+(record.game==='lowball'?' Lowball points':' '+game.unit)));
      row.append(info,value);return row;
    }));
    if(!shown.length)list.append(create('p','profile-results-empty','Finish a Daily to add a real result here. Unlimited practice and unfinished runs do not count.'));
    $('more-results').hidden=resultPage>=pages-1;$('previous-results').disabled=resultPage===0;$('recent-page').textContent=records.length?'Page '+(resultPage+1)+' of '+pages:'';
  }
  function pageAchievements(){
    const size=matchMedia('(max-width:600px)').matches?4:8,filter=$('achievement-filter').value,cards=[...$('achievements').children],eligible=cards.filter(card=>filter==='all'||card.classList.contains('earned')===(filter==='earned')),pages=Math.max(1,Math.ceil(eligible.length/size));achievementPage=Math.min(achievementPage,pages-1);
    const shown=new Set(eligible.slice(achievementPage*size,achievementPage*size+size));for(const card of cards)card.hidden=!shown.has(card);
    $('achievement-page').textContent=eligible.length?'Page '+(achievementPage+1)+' of '+pages:'No '+(filter==='earned'?'unlocked':'locked')+' achievements yet.';$('achievement-previous').disabled=achievementPage===0;$('achievement-next').disabled=achievementPage>=pages-1;
  }
  $('profile-game-filter').onchange=()=>{for(const card of $('profile-games').children)card.hidden=card.dataset.game!==$('profile-game-filter').value;};
  $('achievement-filter').onchange=()=>{achievementPage=0;pageAchievements();};
  $('achievement-previous').onclick=()=>{achievementPage--;pageAchievements();};$('achievement-next').onclick=()=>{achievementPage++;pageAchievements();};
  function renderAchievements(){
    const earned=model.achievements.filter(a=>a.earned).length;
    $('achievement-count').textContent=earned+' / '+model.achievements.length+' UNLOCKED';
    $('achievements').replaceChildren(...model.achievements.map(achievement=>{
      const card=create('article','profile-achievement'+(achievement.earned?' earned':''));card.dataset.achievement=achievement.id;
      const state=create('div','achievement-state'),icon=create('img');icon.src='assets/icons/'+(achievement.earned?'check':'lock')+'.svg';icon.alt='';
      state.append(icon,create('span',null,achievement.earned?'UNLOCKED':'LOCKED'));
      card.append(state,create('h3',null,achievement.name),create('p',null,achievement.detail));return card;
    }));
  }
  function refresh(){
    let data;
    try{data=readCurrent(window.localStorage);}catch{data=readCurrent({getItem(){throw Error('Unavailable');},get length(){throw Error('Unavailable');}});}
    const next=JSON.stringify([data.today,data.records,data.games.map(g=>[g.played,g.today]),data.unavailable,data.skipped]);
    if(next===signature)return;signature=next;model=data;
    const warnings=[];
    if(model.unavailable)warnings.push('Some browser storage could not be read. Available results may be incomplete. Open the games in the same browser and site address used to play them.');
    if(model.skipped)warnings.push('Some saved entries could not be used (invalid, incomplete data or future dates). Valid completed results are still shown; no saves have been changed.');
    $('storage-warning').hidden=!warnings.length;$('storage-warning').textContent=warnings.join(' ');
    $('profile-content').hidden=model.unavailable&&!model.total&&!model.records.length;
    $('arcade-average').textContent=window.BREAK_ROOM_SCORE.format(model.arcade.average);
    $('arcade-basis').textContent=model.arcade.runs?`${model.arcade.gamesPlayed} games with saved history · ${model.arcade.runs} saved Daily results · last 120 days`:'No scored Daily results in the last 120 days yet.';
    $('total-runs').textContent=numbers.format(model.total);
    const active=model.games,completed=active.filter(g=>g.today==='complete').length;
    $('today-count').textContent=completed+' / '+active.length;$('today-caption').textContent=completed===active.length?'A clean sweep. Nicely done.':'Midnight Sydney reset';
    $('overall-streak').textContent=numbers.format(model.streak.current)+(model.streak.current===1?' day':' days');
    $('streak-caption').textContent='Best in saved history: '+model.streak.best+(model.streak.best===1?' day':' days');
    $('profile-empty').hidden=model.total>0||model.unavailable;
    renderDailies();renderGames();renderActivity();renderResults();renderAchievements();pageAchievements();
  }
  matchMedia('(max-width:600px)').addEventListener('change',()=>{achievementPage=0;pageAchievements();});
  $('result-filter').addEventListener('change',()=>{resultPage=0;renderResults();});
  $('previous-results').onclick=()=>{resultPage--;renderResults();};
  $('more-results').onclick=()=>{resultPage++;renderResults();if($('more-results').hidden)$('recent-results').querySelector('a')?.focus();};
  window.addEventListener('break-room:saves-loaded',refresh);window.addEventListener('storage',refresh);window.addEventListener('pageshow',refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  setInterval(refresh,30000);refresh();
})();
