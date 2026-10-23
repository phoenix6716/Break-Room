/* Time Drop: first-lock answers, native snapshots and independent Unlimited sessions. */
(()=>{'use strict';
 const M=BREAK_ROOM_TIME_DROP,C=MIDNIGHT_ARCADE_CLOCK,B=TIME_DROP_EVENTS,$=id=>document.getElementById(id),mem=new Map();
 const h=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const button=(text,id,fn)=>{const e=h('button','button',text);if(id)e.id=id;e.type='button';e.addEventListener('click',fn);return e;};
 let loadedDay='',mode='daily',daily=null,blocked=false,practice=null,persistent=true;
 const sourceCorrections={"https://en.wikipedia.org/wiki/Discovery_of_X-rays":"https://www.aps.org/apsnews/2001/11/1895-roentgens-discovery-xrays","https://en.wikipedia.org/wiki/1909_Nobel_Prize_in_Physics":"https://lemelson.mit.edu/resources/guglielmo-marconi","https://en.wikipedia.org/wiki/Discovery_of_insulin":"https://fisherdigitus.library.utoronto.ca/exhibits/show/insulin100/summerof1921","https://en.wikipedia.org/wiki/Independence_Day_(South_Sudan)":"https://www.gov.uk/government/news/south-sudan-becomes-independent"};
 const sourceURL=e=>sourceCorrections[e.source]||e.source;
 const owner=()=>{try{return localStorage.getItem('br:cloud:owner')||'guest';}catch{return'guest';}};
 const practiceKey='break-room:time-drop:practice:'+owner();
 function raw(key){try{return !persistent&&mem.has(key)?mem.get(key):localStorage.getItem(key)||mem.get(key)||null;}catch{persistent=false;return mem.get(key)||null;}}
 function read(day){try{const r=JSON.parse(raw(M.PREFIX+day));return M.valid(r,day)?r:null;}catch{return null;}}
 function warning(){ $('save-warning').hidden=persistent; }
 function saveDaily(){if(!daily||blocked)return;const key=M.PREFIX+daily.day,value=JSON.stringify(daily);mem.set(key,value);try{localStorage.setItem(key,value);window.dispatchEvent(new Event('break-room:save'));}catch{persistent=false;}warning();stats();}
 function fresh(){const day=C.dayKey();loadedDay=day;const saved=raw(M.PREFIX+day);daily=read(day);blocked=!!saved&&!daily;if(!daily&&!blocked){daily=M.create(B,day);saveDaily();}}
 function stats(){
  const keys=new Set(mem.keys());try{for(let i=0;i<localStorage.length;i++)keys.add(localStorage.key(i));}catch{persistent=false;}
  const rs=[...keys].filter(k=>k?.startsWith(M.PREFIX)).map(k=>{const d=k.slice(M.PREFIX.length),r=M.date(d)&&d<=C.dayKey()?M.record(read(d),d):null;return r&&{day:d,...r};}).filter(Boolean).sort((a,b)=>a.day.localeCompare(b.day));
  const days=new Set(rs.map(r=>r.day));let d=C.dayKey(),streak=0;if(!days.has(d))d=C.previousDay(d);while(days.has(d)){streak++;d=C.previousDay(d);}
  const scores=rs.map(r=>r.arcadeScore),format=BREAK_ROOM_SCORE.format,values={streak,played:rs.length,best:scores.length?format(Math.max(...scores)):'—',average:scores.length?format(scores.reduce((a,b)=>a+b,0)/scores.length):'—',achievement:rs.filter(r=>r.exact===10).length,last:scores.length?format(scores.at(-1)):'—'};
  for(const[k,v]of Object.entries(values))document.querySelectorAll('[data-summary-stat="'+k+'"],[data-detail-stat="'+k+'"]').forEach(e=>e.textContent=v);
 }
 function current(){if(loadedDay===C.dayKey())return true;fresh();$('td-notice').textContent='A new Sydney day has begun. Earlier results are saved; today’s ten events are ready.';if(mode==='daily')render();return false;}
 function sync(){
  if(!current()||blocked)return false;if(mode!=='daily')return true;
  const other=read(daily.day);
  if(other&&(other.picks.length>daily.picks.length||other.round>daily.round||other.edits>daily.edits||other.picks.length===10&&JSON.stringify(other)!==JSON.stringify(daily))){daily=other;render();$('td-notice').textContent='Newer Daily progress was loaded from your other tab.';return false;}return true;
 }
 function savePractice(){try{sessionStorage.setItem(practiceKey,JSON.stringify(practice));}catch{$('practice-note').textContent='Practice stays in memory while this tab remains open.';}}
 function pool(){const excluded=new Set(daily?.events.map(e=>e.id)||M.daily(B,C.dayKey()).map(e=>e.id));return B.filter(e=>!excluded.has(e.id)&&(practice.category==='all'||e.category===practice.category)&&(practice.era==='all'||practice.era==='early'&&e.year<1700||practice.era==='middle'&&e.year>=1700&&e.year<1900||practice.era==='modern'&&e.year>=1900));}
 function nextPractice(){
  let choices=pool();if(!choices.length){practice.category='all';practice.era='all';$('practice-category').value='all';$('practice-era').value='all';$('practice-note').textContent='No eligible events matched those settings. Switched to Mixed topics and All periods.';choices=pool();}
  let eligible=choices.filter(e=>!practice.seen.includes(e.id));if(!eligible.length){practice.seen=[];eligible=choices.filter(e=>e.id!==practice.event?.id);if(!eligible.length)eligible=choices;}
  const event=eligible[Math.floor(Math.random()*eligible.length)];practice.seen.push(event.id);practice.event=structuredClone(event);practice.guess=1900;practice.pick=null;savePractice();
 }
 function ensurePractice(){if(practice)return;try{const p=JSON.parse(sessionStorage.getItem(practiceKey));if(p&&M.event(p.event)&&M.year(p.guess)&&(p.pick===null||M.year(p.pick))&&Array.isArray(p.seen)&&p.seen.every(x=>typeof x==='string')&&Number.isSafeInteger(p.count)&&p.count>=0&&Number.isSafeInteger(p.points)&&p.points>=0&&p.points<=p.count*1000&&['all','World','Science','Culture','Sport','Everyday'].includes(p.category)&&['all','early','middle','modern'].includes(p.era))practice=p;}catch{}if(!practice){practice={category:'all',era:'all',seen:[],count:0,points:0,event:null,guess:1900,pick:null};nextPractice();}}
 const active=()=>mode==='daily'?{event:daily.events[daily.round],guess:daily.guess,pick:daily.phase==='guess'?null:daily.picks[daily.round]}:practice;
 const pos=y=>Math.round((1-Math.cbrt((M.MAX_YEAR-y)/(M.MAX_YEAR-M.MIN_YEAR)))*10000);
 const fromPos=p=>{const y=Math.round(M.MAX_YEAR-(M.MAX_YEAR-M.MIN_YEAR)*Math.pow(1-p/10000,3));return y===0?1:y;};
 function focus(){if(document.querySelector('.game-popup-backdrop:not([hidden])')||$('game-menu')?.getAttribute('aria-hidden')==='false')return;($('td-review-heading')||$('td-question')||$('td-summary'))?.focus({preventScroll:true});}
 function updateGuess(y){if(!sync()||!M.year(y)||active().pick!==null)return false;if(mode==='daily'){if(!M.guess(daily,y))return false;saveDaily();}else{practice.guess=y;savePractice();}paintGuess();return true;}
 function paintGuess(){const a=active();$('td-readout').textContent=M.format(a.guess);$('year-input').value=Math.abs(a.guess);$('year-era').value=a.guess<0?'bce':'ce';$('year-slider').value=pos(a.guess);$('year-slider').setAttribute('aria-valuetext',M.format(a.guess));BREAK_ROOM_TIME_DROP_ART.draw(a.pick===null?a.guess:a.event.year);}
 function typedGuess(){const value=$('year-input').valueAsNumber,sign=$('year-era').value==='bce'?-1:1;return Number.isInteger(value)&&value>0&&M.year(sign*value)?sign*value:null;}
 function input(){if(!sync()||active().pick!==null)return;const y=typedGuess();$('lock-guess').disabled=y===null;$('year-error').textContent=y===null?'Enter a whole year from 1 to '+($('year-era').value==='bce'?'4000 BCE.':'2100 CE.'):'';
  if(y!==null){if(mode==='daily'){M.guess(daily,y);saveDaily();}else{practice.guess=y;savePractice();}$('td-readout').textContent=M.format(y);$('year-slider').value=pos(y);$('year-slider').setAttribute('aria-valuetext',M.format(y));BREAK_ROOM_TIME_DROP_ART.draw(y);}}
 function lock(event){event?.preventDefault();if(!sync()||active().pick!==null)return;const y=typedGuess();if(y===null){input();$('year-input').focus();return;}
  if(mode==='daily'){M.guess(daily,y);M.lock(daily);saveDaily();}else{practice.guess=y;practice.pick=y;practice.count++;practice.points+=M.result(practice.event,y).points;savePractice();}render(true);
 }
 function next(){if(!sync()||active().pick===null)return;if(mode==='daily'){M.next(daily);saveDaily();}else nextPractice();render(true);}
 function share(){const record=M.record(daily,daily.day),squares=record.results.map(r=>r.points>=900?'🟩':r.points>=400?'🟨':'🟥').join(''),text='Time Drop '+daily.day+'\n'+squares+'\n'+record.points.toLocaleString()+'/10,000 points · Arcade '+BREAK_ROOM_SCORE.format(record.arcadeScore)+'/100\n'+new URL('index.html',location.href).href;
  const fallback=()=>{const box=h('textarea','td-share');box.value=text;box.readOnly=true;box.setAttribute('aria-label','Result to copy manually');$('share-status').textContent='Could not copy automatically. Select and copy the result below.';$('share-box').replaceChildren(box);box.focus();box.select();};
  try{navigator.clipboard.writeText(text).then(()=>$('share-status').textContent='Copied!',fallback);}catch{fallback();}
 }
 function controls(a){
  const form=h('form','td-form'),set=h('fieldset');set.disabled=a.pick!==null;const legend=h('legend','game-sr-only','Choose your guessed year');set.append(legend);
  const readout=h('output','td-readout');readout.id='td-readout';readout.setAttribute('aria-label','Your guessed year');set.append(readout);
  const steps=h('div','td-steps');for(const delta of [-100,-10,-1,1,10,100]){const b=button((delta>0?'+':'−')+Math.abs(delta),null,()=>{const g=active().guess;let n=g+delta;if(g>0&&n<=0)n--;else if(g<0&&n>=0)n++;updateGuess(Math.min(M.MAX_YEAR,Math.max(M.MIN_YEAR,n)));});b.setAttribute('aria-label',Math.abs(delta)+' years '+(delta>0?'later':'earlier'));steps.append(b);}set.append(steps);
  const inputs=h('div','td-inputs'),label=h('label',null,'Year'),yr=h('input');label.htmlFor='year-input';yr.id='year-input';yr.type='number';yr.min='1';yr.max='4000';yr.step='1';yr.inputMode='numeric';yr.setAttribute('aria-describedby','year-error');yr.addEventListener('input',input);yr.addEventListener('change',input);
  const era=h('select');era.id='year-era';era.setAttribute('aria-label','Year era');for(const [v,t]of [['ce','CE'],['bce','BCE']]){const o=h('option',null,t);o.value=v;era.append(o);}era.addEventListener('change',input);inputs.append(label,yr,era);set.append(inputs);
  const rangeLabel=h('label','game-sr-only','Guess a year on the timeline');rangeLabel.htmlFor='year-slider';const slider=h('input','td-slider');slider.id='year-slider';slider.type='range';slider.min='0';slider.max='10000';slider.step='1';slider.addEventListener('input',()=>updateGuess(fromPos(Number(slider.value))));set.append(rangeLabel,slider,h('p','td-hint','4000 BCE ← timeline → 2100 CE · Type or use ±1 for precision.'));
  const error=h('p','td-error');error.id='year-error';error.setAttribute('role','status');set.append(error);
  const submit=h('button','button td-lock','LOCK IN GUESS →');submit.id='lock-guess';submit.type='submit';set.append(submit);form.append(set);form.addEventListener('submit',lock);return form;
 }
 function render(moveFocus=false){
  const out=$('engine-slot');out.replaceChildren();warning();$('practice-settings').hidden=mode!=='unlimited';$('game-progress').textContent=mode==='daily'?(daily?'EVENT '+Math.min(10,daily.round+1)+' / 10':'DAILY'):'UNLIMITED · '+practice.count+' GUESSED · '+practice.points.toLocaleString()+' SESSION POINTS';
  if(blocked&&mode==='daily'){out.append(h('h2',null,'Your saved Daily needs attention'),h('p',null,'The existing save was kept unchanged. Export your browser saves from Account before asking for help.'));return;}
  if(mode==='daily'&&daily.phase==='summary'){
   const record=M.record(daily,daily.day),title=h('h2',null,'All ten guessed.');title.id='td-summary';title.tabIndex=-1;out.append(h('p','td-kicker','DAILY COMPLETE'),title,h('p','td-total',record.points.toLocaleString()+' / 10,000 points'),BREAK_ROOM_SCORE.badge(record.arcadeScore),h('p',null,record.exact+' exact '+(record.exact===1?'year':'years')+' · No timer or speed bonus.'));
   const shareStatus=h('p');shareStatus.id='share-status';shareStatus.setAttribute('role','status');const shareBox=h('div');shareBox.id='share-box';out.append(button('COPY RESULT','copy-result',share),button('PLAY UNLIMITED','play-practice',()=>BREAK_ROOM_GAME_SHELL.selectMode('unlimited')),shareStatus,shareBox);
   const list=h('ol','td-history');daily.events.forEach((e,i)=>{const r=record.results[i],item=h('li');item.append(h('strong',null,e.title),h('span',null,'You: '+M.format(daily.picks[i])+' · '+answer(e)+' · '+r.points+' points'));const source=h('a',null,'Read the source');source.href=sourceURL(e);source.target='_blank';source.rel='noopener noreferrer';source.setAttribute('aria-label','Read the source for '+e.title+' (opens in a new tab)');item.append(source);list.append(item);});out.append(list);
  }else{
   const a=active();out.dataset.eventId=a.event.id;out.dataset.phase=a.pick===null?'guess':'review';const stage=h('div','q-card td-card'),deco=h('div','deco');deco.id='deco';deco.setAttribute('aria-hidden','true');const eraTag=h('span','era-tag');eraTag.id='era-tag';const title=h('h2','td-question',a.event.title);title.id='td-question';title.tabIndex=-1;
   stage.append(deco,eraTag,h('p','td-kicker',a.event.category.toUpperCase()+' · WHEN DID THIS HAPPEN?'),title,controls(a));out.append(stage);
   if(a.pick!==null){const r=M.result(a.event,a.pick),review=h('section','td-review'),heading=h('h3',null,answer(a.event));heading.id='td-review-heading';heading.tabIndex=-1;
    review.append(heading,h('p','td-credit',r.band+' · +'+r.points+' points'),h('p',null,'You guessed '+M.format(a.pick)+'. '+(r.error===0?(a.event.earliest===a.event.latest?'Exactly right.':'Inside the accepted date range.'):r.error+' '+(r.error===1?'year':'years')+' from the accepted answer.')),h('p',null,a.event.fact));
    const source=h('a',null,'Read the source ↗');source.href=sourceURL(a.event);source.target='_blank';source.rel='noopener noreferrer';source.setAttribute('aria-label','Read the source (opens in a new tab)');review.append(source,button(mode==='daily'&&daily.picks.length===10?'SEE DAILY RESULT →':'NEXT EVENT →','next-event',next));out.append(review);
   }
   paintGuess();
  }
  if(moveFocus)focus();stats();
 }
 const answer=e=>e.earliest===e.latest?M.format(e.year):M.format(e.earliest)+' – '+M.format(e.latest)+' (accepted range)';
 for(const id of ['practice-category','practice-era'])$(id).addEventListener('change',()=>{ensurePractice();practice.category=$('practice-category').value;practice.era=$('practice-era').value;savePractice();$('practice-note').textContent='Settings apply to the next event. Your current guess stays in place.';});
 document.addEventListener('break-room:mode-change',event=>{mode=event.detail.mode;current();if(mode==='unlimited'){ensurePractice();$('practice-category').value=practice.category;$('practice-era').value=practice.era;}render();});
 window.addEventListener('storage',event=>{if(event.key?.startsWith(M.PREFIX)&&mode==='daily')sync();stats();});
 window.addEventListener('break-room:saves-loaded',()=>{fresh();render();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){current();if(mode==='daily')sync();}});
 setInterval(()=>{current();stats();},1000);
 fresh();render();
})();
