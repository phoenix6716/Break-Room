/* Read-only adapters for native game engines. Never migrate or write game saves. */
(root => {
  'use strict';
  const DAY = 86400000, LOWBALL_EPOCH = Date.UTC(2026, 9, 1);
  const games = [
    {id:'lowball', name:'Lowball', category:'PRICE GUESSING', unit:'points', max:100, note:'Scores out of 100. Best and average use retained saved history; played includes its lifetime counter.'},
    {id:'stake', name:'Stake', category:'TRIVIA / RISK', unit:'chips', max:15, note:'Net chips from completed five-question Dailies. Scores can be negative.'},
    {id:'stack-up', name:'Stack Up', category:'SORTING / SPEED', unit:'points', max:31000, note:'Native points from completed five-stack Dailies; older runs used the original higher scale. Arcade scores compare both versions. Points can be negative.'},
    {id:'pack', name:'Pack', category:'PACKING / LOGIC', unit:'usefulness', max:600, note:'Total usefulness from three untimed Daily bags. Available points vary; Arcade scores compare each total with its exact optimum.'},
    {id:'prior', name:'Prior', category:'HISTORY / INSTINCT', unit:'correct', max:5, note:'Correct earlier-event choices out of five untimed Daily pairs. Arcade score is correct answers × 20.'},
    {id:'laser', name:'Laser', category:'LIGHT / LOGIC', unit:'solved', max:4, note:'First-fire hits out of four Daily boards. Retries and solution reveals never change the score.'},
    {id:'inner-clock',name:'Inner Clock',category:'TIMING / INSTINCT',unit:'seconds miss',max:30,lowerBetter:true,note:'Average absolute timing miss in seconds: lower is better. Arcade score measures misses relative to each target length.'},
    {id:'bouncer',name:'Bouncer',category:'WORD / DEDUCTION',unit:'correct',max:16,note:'Correct words out of sixteen. Tested words earn half credit for the Arcade score; untested correct words earn full credit.'},
    {id:'alibi', name:'Alibi', category:'DEDUCTION / MYSTERY', unit:'correct', max:4, note:'Correct first accusations out of four untimed Daily cases. Notes never affect scoring.'}
    ,{id:'time-drop',name:'Time Drop',category:'HISTORY / INSTINCT',unit:'points',max:5000,note:'Points from five first-lock year guesses (5,000 maximum). Older ten-round saves retain their 10,000-point scale. Arcade scores normalize each run against its own maximum.'},
    {id:'clue-ladder',name:'Clue Ladder',category:'CLUES / KNOWLEDGE',unit:'points',max:5000,note:'Five untimed puzzles. Solves earn 1,000 / 800 / 600 / 400 / 200 by clue used; unsolved scores zero. Arcade score = Daily points divided by 50.'},
    {id:'seating-chart',name:'Seating Chart',category:'SEATING / LOGIC',unit:'drama',max:60,lowerBetter:true,note:'Total broken guest requests across five tables: lower is better. Arcade credit penalises only avoidable drama above each table’s optimum.'},
  ];
  const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
  function dateKey(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) return null;
    const [y,m,d]=value.split('-').map(Number), date=new Date(Date.UTC(y,m-1,d));
    return date.getUTCFullYear()===y && date.getUTCMonth()===m-1 && date.getUTCDate()===d ? date.toISOString().slice(0,10) : null;
  }
  const shift = (day,n) => new Date(Date.parse(day+'T00:00:00Z')+n*DAY).toISOString().slice(0,10);
  function streaks(values,today) {
    const days=[...new Set(values)].sort(), set=new Set(days);
    let current=0, best=0, chain=0, previous=null, day=set.has(today)?today:shift(today,-1);
    while(set.has(day)){current++;day=shift(day,-1);}
    for(const key of days){chain=previous && shift(previous,1)===key?chain+1:1;best=Math.max(best,chain);previous=key;}
    return {current,best};
  }
  // Legacy Stake records have no question snapshots. Reproduce ONLY their answer
  // permutations: the frozen 164-question shuffle is consumed before five option shuffles.
  function legacyStakeAnswers(day) {
    const str='stake:'+day;let h=1779033703^str.length;
    for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}
    h=Math.imul(h^h>>>16,2246822507)^Math.imul(h^h>>>13,3266489909);let s=(h^h>>>16)>>>0;
    const random=()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
    for(let i=163;i>0;i--)random();
    return Array.from({length:5},()=>{const options=[0,1,2];for(let i=2;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}return options.indexOf(0);});
  }
  function read(storage,today=root.MIDNIGHT_ARCADE_CLOCK.dayKey()) {
    let unavailable=false, skipped=0;const records=[], progress=new Set();
    const get=key=>{try{return storage.getItem(key);}catch{unavailable=true;return null;}};
    const parse=key=>{const raw=get(key);if(raw===null)return null;try{return JSON.parse(raw);}catch{skipped++;return null;}};
    const allowed=day=>day && day<=today;
    const add=(game,date,score,perfect=false,arcadeScore=null)=>records.push({game,date,score,perfect,arcadeScore});
    const history=parse('pc_history'), lowDays=new Map();
    if(history!==null && !isObject(history))skipped++;
    if(isObject(history))for(const [key,score] of Object.entries(history)){
      const n=Number(key), stamp=LOWBALL_EPOCH+n*DAY;
      const date=/^-?\d+$/.test(key)&&Number.isSafeInteger(n)&&Math.abs(stamp)<=8640000000000000?dateKey(new Date(stamp).toISOString().slice(0,10)):null;
      if(allowed(date)&&Number.isFinite(score)&&score>=0&&score<=100)lowDays.set(date,score);else skipped++;
    }
    const last=dateKey(get('pc_last')), lastRaw=get('pc_last_avg');
    const lastScore=lastRaw!==null&&lastRaw.trim()!==''?Number(lastRaw):NaN;
    if(allowed(last)&&Number.isFinite(lastScore)&&lastScore>=0&&lastScore<=100&&!lowDays.has(last))lowDays.set(last,lastScore);
    for(const [date,score] of lowDays)add('lowball',date,score,score===100,root.BREAK_ROOM_SCORE.lowball(score));
    const lowProgress=parse('pc_progress');
    if(isObject(lowProgress)&&dateKey(lowProgress.day)===today&&Number.isInteger(lowProgress.idx)&&lowProgress.idx>=0&&lowProgress.idx<4&&Array.isArray(lowProgress.scores)&&lowProgress.scores.length<=4&&lowProgress.scores.every(n=>Number.isFinite(n)&&n>=0&&n<=100)&&!lowDays.has(today))progress.add('lowball');
    let keys=[];
    try{for(let i=0;i<storage.length;i++)keys.push(storage.key(i));}catch{unavailable=true;}
    for(const key of keys){
      if(key?.startsWith('break-room:seating-chart:daily:')){const day=key.slice('break-room:seating-chart:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_SEATING_CHART?.record(r,day);if(record)add('seating-chart',day,record.drama,record.perfect===5,root.BREAK_ROOM_SCORE.seatingChart(r));else if(root.BREAK_ROOM_SEATING_CHART?.valid(r,day)){if(day===today&&(r.picks.length||r.edits>0))progress.add('seating-chart');}else skipped++;continue;}
      if(key?.startsWith('break-room:clue-ladder:daily:')){const day=key.slice('break-room:clue-ladder:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_CLUE_LADDER?.record(r,day);if(record)add('clue-ladder',day,record.points,record.first===5,root.BREAK_ROOM_SCORE.clueLadder(r));else if(root.BREAK_ROOM_CLUE_LADDER?.valid(r,day)){if(day===today&&(r.picks.length||r.edits>0))progress.add('clue-ladder');}else skipped++;continue;}
      if(key?.startsWith('break-room:time-drop:daily:')){const day=key.slice('break-room:time-drop:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_TIME_DROP?.record(r,day);if(record)add('time-drop',day,record.points,record.exact===record.rounds,root.BREAK_ROOM_SCORE.timeDrop(r));else if(root.BREAK_ROOM_TIME_DROP?.valid(r,day)){if(day===today&&(r.picks.length||r.edits>0))progress.add('time-drop');}else skipped++;continue;}
      if(key?.startsWith('break-room:inner-clock:daily:')){const day=key.slice('break-room:inner-clock:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_INNER_CLOCK?.record(r,day);if(record)add('inner-clock',day,record.points,record.inSync===5,root.BREAK_ROOM_SCORE.innerClock(r.targets,r.picks));else if(root.BREAK_ROOM_INNER_CLOCK?.valid(r,day)){if(day===today&&(r.picks.length||r.phase==='running'))progress.add('inner-clock');}else skipped++;continue;}
      if(key?.startsWith('break-room:bouncer:daily:')){const day=key.slice('break-room:bouncer:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_BOUNCER?.record(r,day);if(record)add('bouncer',day,record.correct,record.arcadeScore===100,root.BREAK_ROOM_SCORE.bouncer(record.correct,record.tests));else if(root.BREAK_ROOM_BOUNCER?.valid(r,day)){if(day===today&&(r.picks.length||r.probes.some(p=>p.length)||r.phase==='sort'||r.answers.some(v=>v!==null)))progress.add('bouncer');}else skipped++;continue;}
      if(key?.startsWith('break-room:alibi:daily:')){const day=key.slice('break-room:alibi:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_ALIBI?.record(r,day);if(record)add('alibi',day,record.correct,record.correct===4,root.BREAK_ROOM_SCORE.alibi(record.correct));else if(root.BREAK_ROOM_ALIBI?.valid(r,day)){if(day===today&&(r.picks.length||r.selection>=0||r.notes.some(n=>n.truth.some(Boolean)||n.excluded.some(Boolean)||n.objects?.some(x=>x>=0))))progress.add('alibi');}else skipped++;continue;}
      if(key?.startsWith('break-room:laser:daily:')){const day=key.slice('break-room:laser:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_LASER?.record(r,day);if(record)add('laser',day,record.solved,record.solved===4,root.BREAK_ROOM_SCORE.laser(record.solved));else if(root.BREAK_ROOM_LASER?.valid(r,day)){if(day===today&&(r.picks.length||r.mirrors.length))progress.add('laser');}else skipped++;continue;}
      if(key?.startsWith('break-room:prior:daily:')){const day=key.slice('break-room:prior:daily:'.length);if(!allowed(dateKey(day))||dateKey(day)!==day){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_PRIOR?.record(r,day);if(record)add('prior',day,record.correct,record.correct===5,root.BREAK_ROOM_SCORE.prior(record.correct));else if(root.BREAK_ROOM_PRIOR?.valid(r,day)){if(day===today&&r.picks.length)progress.add('prior');}else skipped++;continue;}
      if(key?.startsWith('break-room:pack:daily:')){const date=key.slice('break-room:pack:daily:'.length);if(!allowed(dateKey(date))||dateKey(date)!==date){skipped++;continue;}const r=parse(key),record=root.BREAK_ROOM_PACK?.record(r,date);if(record)add('pack',date,record.points,record.arcadeScore===100,root.BREAK_ROOM_SCORE.pack(record.points,record.maximum));else if(root.BREAK_ROOM_PACK?.valid(r,date)){if(date===today&&(r.picks.length||r.selection))progress.add('pack');}else skipped++;continue;}
      const game=key?.startsWith('stake:d:')?'stake':key?.startsWith('break-room:stack-up:daily:')?'stack-up':null;
      if(!game)continue;
      const rawDay=key.slice(game==='stake'?8:26), date=dateKey(rawDay);
      // The engines themselves use canonical padded keys for these games.
      if(!allowed(date)||rawDay!==date){skipped++;continue;}
      const value=parse(key);if(value===null)continue;
      if(game==='stake'){
        if(!isObject(value)||!Array.isArray(value.b)||!Array.isArray(value.p)||value.b.length>5||value.p.length>5||value.b.length-value.p.length<0||value.b.length-value.p.length>1||!value.b.every(n=>Number.isInteger(n)&&n>=1&&n<=3)||!value.p.every(n=>Number.isInteger(n)&&n>=-1&&n<=2)||(value.rv!=null&&typeof value.rv!=='boolean')||(value.deadline!=null&&(!Number.isFinite(value.deadline)||value.deadline<=0))){skipped++;continue;}
        let answers;
        if(value.qs==null)answers=legacyStakeAnswers(date);
        else if(Array.isArray(value.qs)&&value.qs.length===5&&value.qs.every(q=>isObject(q)&&typeof q.q==='string'&&typeof q.c==='string'&&typeof q.f==='string'&&Array.isArray(q.o)&&q.o.length===3&&q.o.every(o=>typeof o==='string')&&Number.isInteger(q.a)&&q.a>=0&&q.a<3))answers=value.qs.map(q=>q.a);
        else {skipped++;continue;}
        if(value.p.length!==5){if(date===today&&(value.b.length||value.p.length))progress.add(game);continue;}
        const score=value.p.reduce((sum,pick,i)=>sum+(pick===answers[i]?1:-1)*value.b[i],0);
        add(game,date,score,score===15,root.BREAK_ROOM_SCORE.stake(value.b,value.p,answers));
      }else{
        const valid=isObject(value)&&[1,2].includes(value.version)&&value.day===date&&Number.isInteger(value.round)&&value.round>=0&&value.round<5&&Number.isFinite(value.score)&&Number.isInteger(value.streak)&&value.streak>=0&&Array.isArray(value.order)&&value.order.length===5&&new Set(value.order).size===5&&value.order.every(n=>Number.isInteger(n)&&n>=1&&n<=5)&&Number.isFinite(value.deadline)&&Number.isInteger(value.mistakes)&&value.mistakes>=0&&['playing','review','complete'].includes(value.status)&&Array.isArray(value.results)&&value.results.every(r=>isObject(r)&&typeof r.correct==='boolean'&&Number.isFinite(r.points)&&Number.isInteger(r.mistakes)&&r.mistakes>=0)&&value.results.length===(value.status==='playing'?value.round:value.round+1)&&(value.version===1&&!value.stacks||Array.isArray(value.stacks)&&value.stacks.length===5&&value.stacks.every(s=>isObject(s)&&typeof s.prompt==='string'&&typeof s.fact==='string'&&Array.isArray(s.ends)&&s.ends.length===2&&Array.isArray(s.cards)&&s.cards.length===5&&s.cards.every((c,i)=>isObject(c)&&typeof c.name==='string'&&c.value===i+1))); 
        if(!valid){skipped++;continue;}
        if(value.status!=='complete'||value.round!==4){if(date===today)progress.add(game);continue;}
        if(![undefined,1,2].includes(value.scoreVersion)){skipped++;continue;}
        add(game,date,value.score,value.results.every(r=>r.correct&&r.mistakes===0),root.BREAK_ROOM_SCORE.stackUp(value.score,value.scoreVersion));
      }
    }
    records.sort((a,b)=>b.date.localeCompare(a.date)||a.game.localeCompare(b.game));
    const arcade=root.BREAK_ROOM_SCORE.summary(records,today);
    const playedRaw=get('pc_played'), lifetime=/^\d+$/.test(playedRaw||'')?Number(playedRaw):0;
    const summaries=games.map(game=>{
      const own=records.filter(r=>r.game===game.id), scores=own.map(r=>r.score), streak=streaks(own.map(r=>r.date),today);
      return {...game,arcade:arcade.games.find(g=>g.id===game.id),records:own,played:game.id==='lowball'&&Number.isSafeInteger(lifetime)?Math.max(lifetime,own.length):own.length,
        average:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null,best:scores.length?(game.lowerBetter?Math.min(...scores):Math.max(...scores)):null,
        streak:streak.current,bestStreak:streak.best,today:own.some(r=>r.date===today)?'complete':progress.has(game.id)?'progress':'ready'};
    });
    const days=new Map();for(const record of records){if(!days.has(record.date))days.set(record.date,new Set());days.get(record.date).add(record.game);}
    const streak=streaks([...days.keys()],today), total=summaries.reduce((n,g)=>n+g.played,0);
    const achievements=[
      {id:'seating-chart',name:'Perfect host',detail:'Match the minimum drama at all five Daily Seating Chart tables.',earned:records.some(r=>r.game==='seating-chart'&&r.perfect)},
      {id:'clue-ladder',name:'First rung',detail:'Solve all five Daily Clue Ladder puzzles on their first clue.',earned:records.some(r=>r.game==='clue-ladder'&&r.perfect)},
      {id:'time-drop',name:'On the dot',detail:'Guess every Daily Time Drop year exactly.',earned:records.some(r=>r.game==='time-drop'&&r.perfect)},
      {id:'inner-clock',name:'In sync',detail:'Stop all five Daily Inner Clock targets within 2%.',earned:records.some(r=>r.game==='inner-clock'&&r.perfect)},
      {id:'bouncer',name:'On the list',detail:'Sort all sixteen Daily Bouncer words correctly without testing.',earned:records.some(r=>r.game==='bouncer'&&r.perfect)},
      {id:'first',name:'First break',detail:'Finish your first Daily game.',earned:total>0},
      {id:'sweep',name:'Clean sweep',detail:'Complete Lowball, Stake and Stack Up on the same day.',earned:[...days.values()].some(g=>['lowball','stake','stack-up'].every(id=>g.has(id)))},
      {id:'week',name:'Back again',detail:'Complete a Daily game on seven consecutive days in your saved history.',earned:streak.best>=7},
      {id:'lowball',name:'Spot on',detail:'Finish a Lowball Daily with an average of 100.',earned:records.some(r=>r.game==='lowball'&&r.perfect)},
      {id:'stake',name:'High roller',detail:'Finish a Stake Daily with +15 chips.',earned:records.some(r=>r.game==='stake'&&r.perfect)},
      {id:'alibi',name:'Case closed',detail:'Find the culprit in all four Daily Alibi cases.',earned:records.some(r=>r.game==='alibi'&&r.perfect)},
      {id:'laser',name:'Light work',detail:'Connect all four Daily Laser boards on the first fire.',earned:records.some(r=>r.game==='laser'&&r.perfect)},
    {id:'prior',name:'Past master',detail:'Choose the earlier event in all five Daily Prior pairs.',earned:records.some(r=>r.game==='prior'&&r.perfect)},
      {id:'pack',name:'Nothing wasted',detail:'Find the optimal selection in all three Daily Pack bags.',earned:records.some(r=>r.game==='pack'&&r.perfect)},
      {id:'stack-up',name:'Neat stack',detail:'Clear all five Daily stacks without a wrong guess or timeout.',earned:records.some(r=>r.game==='stack-up'&&r.perfect)}
    ];
    return {today,records,games:summaries,arcade,total,streak,days,achievements,unavailable,skipped};
  }
  root.BREAK_ROOM_RECORDS=Object.freeze({read,dateKey,streaks,legacyStakeAnswers});
})(typeof window==='undefined'?globalThis:window);
