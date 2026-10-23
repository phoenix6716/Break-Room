/* Profile presentation only. The game engines remain the owners of their saves. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), create=(tag,className,text)=>{
    const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;
  };
  const numbers=new Intl.NumberFormat('en-AU',{maximumFractionDigits:1});
  const dates=new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  const dateLabel=day=>dates.format(new Date(day+'T00:00:00Z'));
  const archived = new Set(['alibi','bouncer']);
  const url=game=>'games/'+game+'/index.html';
  let model=null,limit=10,signature='';
  function score(value,game,average=false){
    if(value===null)return '—';
    if(game==='inner-clock')return value.toFixed(3);
    const number=average?Math.round(value*10)/10:value;
    return (game==='stake'&&number>0?'+':'')+numbers.format(number);
  }
  function metric(label,value,detail){
    const div=create('div'),dd=create('dd',null,value);div.append(create('dt',null,label),dd);
    if(detail)dd.append(create('small',null,detail));return div;
  }
  function renderGames(){
    $('profile-games').replaceChildren(...model.games.filter(game=>!archived.has(game.id)||game.played>0).map((game,index)=>{
      const card=create('article','profile-game');card.dataset.game=game.id;
      const top=create('div','profile-game-top'),state=archived.has(game.id)?'ARCHIVED · SAVED HISTORY':game.today==='complete'?'✓ DAILY COMPLETE':game.today==='progress'?'DAILY IN PROGRESS':'DAILY READY';
      top.append(create('span','profile-game-number',String(index+1).padStart(2,'0')),create('span','profile-game-status '+game.today,state));
      const performance=create('div','profile-game-arcade');performance.append(create('span','profile-label','ARCADE AVERAGE · LAST 120 DAYS'));const average=create('strong',null,window.BREAK_ROOM_SCORE.format(game.arcade.average));average.append(create('small',null,' / 100'));performance.append(average,create('p',null,game.arcade.count+' saved Daily '+(game.arcade.count===1?'run':'runs')));
      const metrics=create('dl','profile-metrics');
      metrics.append(metric('Original average',score(game.average,game.id,true),game.unit),metric('Original best',score(game.best,game.id),game.id==='lowball'?'out of 100':game.unit),metric('Daily runs',numbers.format(game.played),'completed'),metric('History streak',numbers.format(game.streak),game.streak===1?'day':'days'));
      const link=create('a','button',game.today==='complete'?'VIEW DAILY RESULT →':game.today==='progress'?'RESUME DAILY →':'PLAY DAILY →');link.href=url(game.id);link.setAttribute('aria-label',link.textContent.replace(' →','')+' — '+game.name);
      card.append(top,create('span','profile-label',game.category),create('h3',null,game.name),performance,metrics,create('p','profile-game-note',game.note));if(!archived.has(game.id))card.append(link);return card;
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
    const selected=$('result-filter').value, records=model.records.filter(r=>selected==='all'||r.game===selected),shown=records.slice(0,limit);
    $('recent-count').textContent=records.length?`Showing ${shown.length} of ${records.length} saved Daily results. Arcade scores use the same 0–100 scale; original scores appear below.`:'No saved Daily results'+(selected==='all'?' yet.':' for this game yet.');
    const list=$('recent-results');
    list.replaceChildren(...shown.map(record=>{
      const game=model.games.find(g=>g.id===record.game),row=create('article','profile-result');row.dataset.game=record.game;
      const info=create('div'),link=create(archived.has(game.id)?'span':'a',null,game.name+(archived.has(game.id)?' (archived)':''));if(!archived.has(game.id))link.href=url(game.id);
      const time=create('time',null,dateLabel(record.date)+(record.date===model.today?' · Today':''));time.dateTime=record.date;info.append(link,time);
      const value=create('div','profile-result-score',window.BREAK_ROOM_SCORE.format(record.arcadeScore)+' / 100');value.append(create('small',null,score(record.score,record.game)+(record.game==='lowball'?' Lowball points':' '+game.unit)));
      row.append(info,value);return row;
    }));
    if(!shown.length)list.append(create('p','profile-results-empty','Finish a Daily to add a real result here. Unlimited practice and unfinished runs do not count.'));
    $('more-results').hidden=shown.length>=records.length;
  }
  function renderAchievements(){
    const earned=model.achievements.filter(a=>a.earned).length;
    $('achievement-count').textContent=earned+' / '+model.achievements.filter(a=>!archived.has(a.id)||a.earned).length+' UNLOCKED';
    $('achievements').replaceChildren(...model.achievements.filter(a=>!archived.has(a.id)||a.earned).map(achievement=>{
      const card=create('article','profile-achievement'+(achievement.earned?' earned':''));card.dataset.achievement=achievement.id;
      const state=create('div','achievement-state'),icon=create('img');icon.src='assets/icons/'+(achievement.earned?'check':'lock')+'.svg';icon.alt='';
      state.append(icon,create('span',null,achievement.earned?'UNLOCKED':'LOCKED'));
      card.append(state,create('h3',null,achievement.name),create('p',null,achievement.detail));return card;
    }));
  }
  function refresh(){
    let data;
    try{data=window.BREAK_ROOM_RECORDS.read(window.localStorage);}catch{data=window.BREAK_ROOM_RECORDS.read({getItem(){throw Error('Unavailable');},get length(){throw Error('Unavailable');}});}
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
    const active=model.games.filter(g=>!archived.has(g.id)),completed=active.filter(g=>g.today==='complete').length;
    for(const id of archived){const option=$('result-filter').querySelector('[value="'+id+'"]');if(option)option.hidden=!model.records.some(r=>r.game===id);}
    $('today-count').textContent=completed+' / '+active.length;$('today-caption').textContent=completed===active.length?'A clean sweep. Nicely done.':'Daily reset at midnight Sydney time';
    $('overall-streak').textContent=numbers.format(model.streak.current)+(model.streak.current===1?' day':' days');
    $('streak-caption').textContent='Best in saved history: '+model.streak.best+(model.streak.best===1?' day':' days');
    $('profile-empty').hidden=model.total>0||model.unavailable;
    renderGames();renderActivity();renderResults();renderAchievements();
  }
  $('result-filter').addEventListener('change',()=>{limit=10;renderResults();});
  $('more-results').addEventListener('click',()=>{
    const previous=$('recent-results').children.length;limit+=10;renderResults();
    if($('more-results').hidden)$('recent-results').children[previous]?.querySelector('a')?.focus();
  });
  window.addEventListener('storage',refresh);window.addEventListener('pageshow',refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  setInterval(refresh,30000);refresh();
})();
