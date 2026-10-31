/* New Hidden Gem model and isolated score helpers; disposable database only. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{PGlite}=require('@electric-sql/pglite');
for(const p of ['daily-clock.js','hidden-gem-model.js','arcade-score.js','profile-records.js','cloud-saves.js'])require('../'+p);
const M=BREAK_ROOM_HIDDEN_GEM,B=require('../content/archive/2026-10-31/hidden-gem-questions.json').questions,activeBank=require('../content/hidden-gem-questions.json').questions,day='2026-10-24',key=M.PREFIX+day,encode=JSON.stringify;
const runtime={window:{}};vm.runInNewContext(fs.readFileSync('games/hidden-gem/questions.js','utf8'),runtime);
assert.deepEqual(JSON.parse(JSON.stringify(runtime.window.HIDDEN_GEM_QUESTIONS)),activeBank);assert.equal(B.length,240);assert(B.reduce((n,q)=>n+q.answers.length,0)>5000);assert.equal(new Set(B.map(q=>q.id)).size,240);
for(const q of B){assert(q.answers.length>=10,q.id+' must offer at least ten canonical answers');assert(!/eight main compass points|basic English demonstrative|three everyday states of matter/i.test(q.prompt));}
const legacy=require('../content/archive/2026-10-30/hidden-gem-questions.json').questions;
// All old identities are recovery-only. Full snapshots, not active-bank lookups, define saves.
assert(B.every(q=>q.id.startsWith('hg7-')&&!legacy.some(old=>old.id===q.id)));
const accessibleV1=require('../content/archive/2026-10-30-accessible-v1/hidden-gem-questions.json').questions;
for(const prior of accessibleV1){const current=B.find(q=>q.id===prior.id);assert.equal(current.dailySlot,prior.dailySlot);assert.equal(current.prompt,prior.prompt);for(const a of prior.answers){assert.equal(current.answers.find(x=>x.name===a.name)?.points,a.points,'Published rating '+prior.id+' '+a.name);for(const x of [a.name,...a.aliases])assert.equal(M.match(current,x)?.name,a.name,'Published wording '+prior.id+' '+x);}}
const roll=B.find(q=>q.id==='hg7-207'),oldRoll=accessibleV1.find(q=>q.id===roll.id);
for(const x of ['pants','jeans','trousers','pant legs'])assert.equal(M.match(roll,x)?.points,69,x);
for(const x of ['sleeves','shirt sleeves','jacket sleeves'])assert.equal(M.match(roll,x)?.points,64,x);
for(const x of ['giraffe','stone','keyboard'])assert.equal(M.match(roll,x),null,x);
const oldMiss=M.createPractice(oldRoll,day,'old-miss');M.begin(oldMiss,1000);M.draft(oldMiss,'pants',1001);M.expire(oldMiss,31000);assert.equal(oldMiss.picks[0].points,0);assert(M.validRun(oldMiss),'Previously locked zero stays valid');
const corrected=M.create(accessibleV1,'2026-10-30');for(const q of corrected.questions){const current=B.find(x=>x.id===q.id);for(const a of q.answers){const updated=current.answers.find(x=>x.name===a.name&&x.points===a.points);if(updated)a.aliases=updated.aliases.slice();}}
M.begin(corrected,1000);for(let i=0;i<5;i++){M.draft(corrected,corrected.questions[i].id===roll.id?'pants':corrected.questions[i].answers[0].name,1001);assert(M.finish(corrected,1002));if(i<4)M.next(corrected,1000);}assert(M.validRun(corrected));assert.equal(corrected.picks.find((p,i)=>corrected.questions[i].id===roll.id).points,69);
const author=require('../content/archive/2026-10-31/hidden-gem-accessible-source.json');
assert.equal(new Set(B.map(q=>M.normal(q.prompt))).size,240);
for(const [i,j] of author.spacingReview.conflictingPairs){const a=B[i].dailySlot,b=B[j].dailySlot;assert(![0,1,47].includes((a-b+48)%48),B[i].prompt+' too close to '+B[j].prompt);}
for(const q of legacy){const r=M.createPractice(q,day,'revision6:'+q.id),before=encode(r.questions),a=q.answers.at(-1);M.begin(r,1000);M.draft(r,a.name,1001);const deadline=r.deadline;assert(M.validRun(r));assert.equal(r.deadline,deadline);assert(M.finish(r,1002));assert(M.validRun(r));assert.equal(r.picks[0].points,a.points);assert.equal(encode(r.questions),before);}
const previous=require('../content/archive/2026-10-26/hidden-gem-questions.json').questions;
const wide=legacy.find(q=>q.answers.length===151);assert(wide);assert.equal(M.match(wide,'Pikachu').name,'Pikachu');assert.equal(M.match(wide,'Mew').name,'Mew');
assert(M.puzzle({...wide,answers:Array.from({length:512},(_,i)=>({name:'Answer '+i,points:1+i%100,aliases:[]}))}));
assert(!M.puzzle({...wide,answers:Array.from({length:513},(_,i)=>({name:'Answer '+i,points:1+i%100,aliases:[]}))}));
const oldRun=M.create(previous,'2026-10-26');M.begin(oldRun,1000);for(let i=0;i<5;i++){M.draft(oldRun,oldRun.questions[i].answers[0].name,1001);assert(M.finish(oldRun,1002));if(i<4)M.next(oldRun,1000);}assert(M.record(oldRun,'2026-10-26'));
for(const q of B){assert(M.puzzle(q),q.id);assert(q.answers.every(a=>Number.isInteger(a.points)&&a.points>=1&&a.points<=100));assert(q.answers.some(a=>a.points===100));for(const a of q.answers)for(const x of [a.name,...a.aliases])assert.equal(M.match(q,x)?.name,a.name,q.id+': '+x);}

// A reference/cutoff must never give away a scored answer before submission.
const mentioned=(text,label)=>{const n=M.normal(label);return n.length>=3&&(' '+M.normal(text)+' ').includes(' '+n+' ');};
const titleAnswers={
 'planets':['Moon'],'harry-potter':['Harry Potter'],'hg-potter':['Harry Potter'],
 'hg-star-wars':['A New Hope'],'hg-ghostbusters':['Sonic'],'hg-parr':['Moana'],
 'hg-shrek':['Shrek','Puss in Boots'],'hg-hunger':['The Hunger Games','Divergent','Twilight','The Maze Runner'],
 'hg-holmes':['Alice'],'hg-weasleys':['Diary of a Wimpy Kid'],'hg-secret-seven':['Dog Man'],
 'hg-sauces':['The Beatles'],'hg-rubik':['Taylor Swift'],'hg-traffic':['Elizabeth line','Docklands Light Railway'],'hg-tetris':['Mario'],'hg-kart64':['The Legend of Zelda']
};
for(const q of B)for(const a of q.answers)for(const label of [a.name,...a.aliases]){
 assert(!mentioned(q.scope,label),q.id+' description gives away '+label);
 if(mentioned(q.prompt,label)){assert(q.id.startsWith('hg7-')||q.id.startsWith('hg-extra-')||['hg-ao-women','hg-mens-slams','hg-peaks'].includes(q.id)||titleAnswers[q.id]?.includes(a.name),q.id+' unexpected answer in prompt: '+label);assert.equal(a.points,1,q.id+' named answer must receive minimum points');}
}
const preFix=require('../content/archive/2026-10-27/hidden-gem-questions.json').questions;
for(const [id,input,points]of [['hg-parr','Moana',77],['hg-hunger','The Maze Runner',67],['hg-rna','Stomach',54]]){
 const q=preFix.find(q=>q.id===id),r=M.createPractice(q,day,'old:'+id),frozen=encode(r.questions);
 M.begin(r,1000);M.draft(r,input,1001);assert(M.finish(r,1002));assert(M.validRun(r));
 assert.equal(r.picks[0].points,points);assert.equal(encode(r.questions),frozen);
}

// Every prior revision-4 question, including tiny retired sets, remains finishable.
const revision4=require('../content/archive/2026-10-28/hidden-gem-questions.json').questions;
for(const q of revision4){const r=M.createPractice(q,day,'revision4:'+q.id),frozen=encode(r.questions),a=q.answers.at(-1);M.begin(r,1000);M.draft(r,a.name,1001);assert(M.finish(r,1002));assert(M.validRun(r));assert.equal(r.picks[0].points,a.points);assert.equal(encode(r.questions),frozen);}
assert.equal(M.match(legacy.find(q=>q.id==='countries-a'),'Oceania'),null);
const ids=[];for(let i=0;i<32;i++){const d=new Date(Date.UTC(2026,9,24+i)).toISOString().slice(0,10),qs=M.daily(legacy,d);assert.deepEqual(qs,M.daily([...legacy].reverse(),d));assert.equal(new Set(qs.map(q=>q.topic)).size,5);ids.push(...qs.map(q=>q.id));}assert.equal(new Set(ids).size,160);
const full=[];for(let i=0;i<48;i++){const d=new Date(Date.UTC(2026,9,24+i)).toISOString().slice(0,10),qs=M.daily(B,d);assert.deepEqual(qs,M.daily([...B].reverse(),d));assert.equal(new Set(qs.map(q=>q.topic)).size,5);assert(qs.filter(q=>/tennis|grand slam|ATP|WTA|Australian Open/i.test(q.prompt)).length<=1);full.push(...qs.map(q=>q.id));}assert.equal(new Set(full).size,240,'48 days contain 240 different questions');
const revision5=require('../content/archive/2026-10-29/hidden-gem-questions.json').questions;for(let i=0;i<6;i++){const d=new Date(Date.UTC(2026,9,24+i)).toISOString().slice(0,10);assert.deepEqual(M.daily(legacy,d).map(q=>q.id),M.daily(revision5,d).map(q=>q.id),'Already released date slots stay fixed');}
for(const q of revision5){const r=M.createPractice(q,day,'revision5:'+q.id),a=q.answers.at(-1);M.begin(r,1000);M.draft(r,a.name,1001);assert(M.finish(r,1002));assert.equal(r.picks[0].points,a.points);}

for(const [n,label]of [[0,'Time’s Up'],[1,'Familiar'],[19,'Familiar'],[20,'Nice Find'],[39,'Nice Find'],[40,'Offbeat'],[59,'Offbeat'],[60,'Hidden Gem'],[79,'Hidden Gem'],[80,'Crown Jewel'],[95,'Crown Jewel'],[100,'Crown Jewel']])assert.equal(M.scoreBand(n),label);
const countries=legacy.find(q=>q.id==='countries-a');assert.equal(M.match(countries,'Azerbaijna').name,'Azerbaijan');assert.equal(M.match(countries,'Austria').name,'Austria');assert.equal(M.match(countries,'Canada'),null);
const ambiguous={...countries,answers:[{name:'Catapult',points:20,aliases:[]},{name:'Catapolt',points:95,aliases:[]}]};assert.equal(M.match(ambiguous,'Catapelt'),null);
const retry=M.createPractice(countries,day,'retry');M.begin(retry,1000);for(const x of ['Canada','','Mexico']){M.draft(retry,x,2000);assert(!M.finish(retry,2001));assert.equal(retry.deadline,31000);assert.equal(retry.picks.length,0);assert.equal(retry.phase,'active');assert(M.validRun(retry));}M.draft(retry,'Azerbaijna',3000);assert(M.finish(retry,3001));assert.equal(retry.picks[0].points,95);assert.equal(retry.picks[0].answer,'Azerbaijan');assert(retry.picks[0].typo);const lock=encode(retry);assert(!M.finish(retry,3002));assert(!M.draft(retry,'Australia',3003));assert.equal(encode(retry),lock);
const late=M.createPractice(countries,day,'late');M.begin(late,1000);M.draft(late,'Canada',2000);assert(!M.draft(late,'Azerbaijan',31000));assert.equal(late.picks[0].answer,null);assert.equal(late.picks[0].points,0);assert(M.validRun(late));
function complete(kind='perfect'){const r=M.create(B,day);M.begin(r,1000);for(let i=0;i<5;i++){if(kind==='zero')M.expire(r,r.deadline);else{const a=kind==='perfect'?r.questions[i].answers.find(a=>a.points===100):r.questions[i].answers[1];M.draft(r,a.name,1001);assert(M.finish(r,1002));}if(i<4)M.next(r,1000);}assert(M.valid(r,day));return r;}
const good=complete(),mixed=complete('mixed'),zero=complete('zero');assert.equal(M.record(good,day).score,100);assert.equal(M.record(zero,day).score,0);assert.equal(M.record(M.create(B,day),day),null);
const cloud=BREAK_ROOM_CLOUD_SAVES;assert(cloud.belongs('hidden-gem',key));assert(!cloud.belongs('hidden-gem','break-room:hidden-gem:practice:guest'));assert.equal(cloud.merge('hidden-gem',{[key]:encode(good)},{[key]:encode(zero)})[key],encode(zero));
const draft=M.create(B,day);M.begin(draft,1000);const earlier=encode(draft);M.draft(draft,'saved draft',1001);assert.equal(cloud.merge('hidden-gem',{[key]:encode(draft)},{[key]:earlier})[key],encode(draft));
const storage={length:1,key:()=>key,getItem:k=>k===key?encode(mixed):null,setItem(){throw Error('read only');}};const profile=BREAK_ROOM_RECORDS.read(storage,day);assert.equal(profile.records[0].game,'hidden-gem');assert.equal(profile.records[0].score,M.record(mixed,day).score);assert.equal(profile.arcade.average,M.record(mixed,day).score);
const bad=[];for(const mutate of [r=>r.version=2,r=>r.kind='unlimited',r=>r.day='2026-02-30',r=>r.edits=-1,r=>r.round=3,r=>r.phase='active',r=>r.deadline=1,r=>r.error='unlisted',r=>r.questions[0].answers[0].points=0,r=>r.questions[0].answers[0].points=101,r=>r.questions[1]=r.questions[0],r=>r.picks[0].points=99,r=>r.picks[0].answer='wrong',r=>r.picks[0].reason='timeout',r=>r.picks.pop(),r=>r.input='changed']){const r=structuredClone(good);mutate(r);assert.equal(M.record(r,day),null);bad.push(r);}
// Revision 8's closed rosters: exhaustive source membership, all spellings, symbol maps and calendar spacing.
const boundedSource=require('../content/hidden-gem-bounded-source.json');
assert.equal(activeBank.length,240);assert(activeBank.every(q=>q.id.startsWith('hg8-')));
assert.equal(new Set(activeBank.map(q=>q.topic)).size,10);
for(const [i,q] of activeBank.entries()){
 const spec=boundedSource.questions[i],u=boundedSource.universes[spec.universe],members=new Map(u.members.map(a=>[a.id||a.name,a]));
 assert.equal(u.expectedCount,u.members.length);assert.equal(members.size,u.members.length);
 assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(u.members)).digest('hex'),u.rosterSha256,spec.universe+' factual roster fingerprint');
 assert.deepEqual(q.answers.map(a=>a.name),spec.memberIds.map(id=>members.get(id).name));
 if(spec.selection.type==='all')assert.equal(q.answers.length,u.members.length,'Complete '+spec.universe);
 assert(q.answers.length>=10&&q.answers.length<=512);assert(q.answers.some(a=>a.points===100));
 assert.equal(new Set(q.answers.map(a=>M.normal(a.name))).size,q.answers.length);
 for(const a of q.answers)for(const x of [a.name,...a.aliases]){assert.equal(M.match(q,x)?.name,a.name,q.id+': '+x);assert.equal(a.points,spec.points[a.name]);assert(!mentioned(q.scope,x),q.id+' description gives away '+x);}
 for(const [raw,name]of Object.entries(q.inputMap||{}))assert.equal(M.match(q,raw)?.name,name,q.id+' symbol '+raw);
}
const byUniverse=u=>activeBank[boundedSource.questions.findIndex(q=>q.universe===u)];
for(const [u,n]of [['un-states',195],['elements',118],['planets',13],['constellations',88],['moonwalkers',12],['si-units',29],['si-prefixes',24],['discworld',41],['tintin',24],['first-folio',36]])assert.equal(byUniverse(u).answers.length,n,u+' independent published set size');
assert.equal(M.match(byUniverse('si-prefixes'),'M').name,'Mega');assert.equal(M.match(byUniverse('si-prefixes'),'m').name,'Milli');
assert.equal(M.match(byUniverse('emoji-animals'),'🐘').name,'Elephant');
assert.equal(M.match(byUniverse('un-states'),'USA').name,'United States');assert.equal(M.match(byUniverse('un-states'),'Atlantis'),null);
assert.equal(M.match(byUniverse('dceu'),'The Suicide Squad').name,'The Suicide Squad (2021)');assert.equal(M.match(byUniverse('dceu'),'Suicide Squad').name,'Suicide Squad (2016)');
for(const [u,input,name]of [['un-sg','Guterres','Antonio Guterres'],['aus-pm','Albanese','Anthony Albanese'],['nba','Lakers','Los Angeles Lakers'],['afl','Swans','Sydney Swans'],['premier','Man Utd','Manchester United']])assert.equal(M.match(byUniverse(u),input)?.name,name,'Common shortened name '+input);
for(const [u,input]of [['everyday-office','Pencil'],['everyday-household','Key'],['everyday-household','Sofa'],['everyday-hands','Clapping'],['everyday-toys','Dice'],['everyday-sea-reptiles','Whale']])assert(M.match(byUniverse(u),input),'Ordinary everyday answer: '+input);
for(const [u,input]of [['everyday-sky','Rain'],['everyday-sky','Snow'],['everyday-sky','Wind'],['everyday-sky','Moon'],['everyday-stationery','Paper'],['everyday-office','Paper'],['everyday-fruit','Apples'],['everyday-household','Chairs']])assert(M.match(byUniverse(u),input),'Ordinary correct wording '+input);
assert(M.match(byUniverse('everyday-sky'),'Sun').points<M.match(byUniverse('everyday-sky'),'Waning Gibbous Moon').points);
const allDates=[];
for(let i=0;i<48;i++){
 const d=new Date(Date.UTC(2026,9,31+i)).toISOString().slice(0,10),qs=M.daily(activeBank,d);assert.equal(qs.length,5);assert.equal(new Set(qs.map(q=>q.topic)).size,5);allDates.push(...qs.map(q=>q.id));
}
assert.equal(new Set(allDates).size,240);assert.deepEqual(M.daily(activeBank,'2026-12-18').map(q=>q.id),M.daily(activeBank,'2026-10-31').map(q=>q.id));
for(const [i,j]of boundedSource.conflicts){const d=Math.abs(activeBank[i].dailySlot-activeBank[j].dailySlot);assert(Math.min(d,48-d)>1);}
const boundedRun=M.create(activeBank,'2026-10-31');M.begin(boundedRun,1000);
for(let i=0;i<5;i++){M.draft(boundedRun,boundedRun.questions[i].answers.at(-1).name,1001);assert(M.finish(boundedRun,1002));M.next(boundedRun,1003);}
assert(M.record(boundedRun,boundedRun.day));
// New snapshots fit the existing server budget without dropping any history; other games keep their cap.
const fullHistory={};
for(let i=0;i<120;i++){const d=new Date(Date.UTC(2026,9,31+i)).toISOString().slice(0,10),r=M.create(activeBank,d);M.begin(r,1);for(let j=0;j<5;j++){M.draft(r,r.questions[j].answers.reduce((a,b)=>a.name.length>b.name.length?a:b).name,2);M.finish(r,3);M.next(r,4);}fullHistory[M.PREFIX+d]=encode(r);}
assert(encode(fullHistory).length>1500000);assert(Buffer.byteLength(encode(fullHistory))<1990000);assert.deepEqual(cloud.clean('hidden-gem',fullHistory),fullHistory,'120 full snapshots fit client and server caps without pruning');
// Editorial ratings are question-specific. Famous leads and title answers cannot inherit rare-answer scores.
assert(activeBank.every(q=>!/UNESCO|World Heritage property/i.test(q.prompt)));assert.equal(activeBank.filter(q=>q.topic==='EVERYDAY').length,24);
const priorBounded=require('../content/archive/2026-10-31-bounded-v1/hidden-gem-questions.json').questions;
assert.equal(require('../content/hidden-gem-questions.json').revision,11);
for(const [i,q]of activeBank.entries()){
 if(i>=144&&i<168)continue;
 assert.equal(q.id,priorBounded[i].id);assert.equal(q.prompt,priorBounded[i].prompt);assert.equal(q.dailySlot,priorBounded[i].dailySlot);
 assert.deepEqual(q.answers.map(a=>a.name),priorBounded[i].answers.map(a=>a.name),'Rating review must not change membership');
 assert(boundedSource.questions[i].ratingReview.familiar.length);assert(boundedSource.questions[i].ratingReview.lessObvious.length);
 for(const a of boundedSource.questions[i].ratingReview.familiar)assert(M.match(q,a.answer).points<=40,'Familiar answer must not be a top-rated answer: '+q.id+' '+a.answer);
}
for(const [u,obvious,rare]of [['ctr','Crash Bandicoot','Penta Penguin'],['pokemon-kanto','Pikachu','Seaking'],['smash64','Mario','Ness'],['mkwii','Mario','Dry Bowser'],['planets','Earth','Haumea'],['us-parks','Yellowstone','Kobuk Valley'],['us-presidents','Donald Trump','Millard Fillmore'],['pixar','Toy Story','The Good Dinosaur'],['illumination','Despicable Me','Hop'],['nolan','The Dark Knight','Following']]){
 const q=byUniverse(u);assert.equal(M.match(q,obvious).points,1,obvious+' is an obvious answer in '+u);assert.equal(M.match(q,rare).points,100);assert(M.match(q,obvious).points<M.match(q,rare).points);
}
const oldCrash=priorBounded.find(q=>q.id==='hg8-095'),newCrash=byUniverse('ctr');assert.equal(M.match(oldCrash,'Crash Bandicoot').points,100);assert.equal(M.match(newCrash,'Crash').points,1);assert.equal(M.match(newCrash,'Coco').points,5);
const frozenRatingRun=M.createPractice(oldCrash,'2026-10-31','old-context-ratings');M.begin(frozenRatingRun,1000);M.draft(frozenRatingRun,'Crash Bandicoot',1001);const frozenRatingDeadline=frozenRatingRun.deadline;assert(M.validRun(frozenRatingRun));assert(M.finish(frozenRatingRun,1002));assert.equal(frozenRatingRun.picks[0].points,100);assert(M.validRun(frozenRatingRun));assert.equal(frozenRatingDeadline,31000);
const oldRatingDaily=M.create(priorBounded,'2026-11-02');M.begin(oldRatingDaily,1000);for(let i=0;i<5;i++){M.draft(oldRatingDaily,oldRatingDaily.questions[i].id==='hg8-095'?'Crash Bandicoot':oldRatingDaily.questions[i].answers.find(a=>a.points===100).name,1001);assert(M.finish(oldRatingDaily,1002));M.next(oldRatingDaily,1003);}assert.equal(M.record(oldRatingDaily,oldRatingDaily.day).score,100);
const generatedBefore=['content/hidden-gem-questions.json','games/hidden-gem/questions.js'].map(p=>fs.readFileSync(p,'utf8'));
require('node:child_process').execFileSync(process.execPath,['scripts/build-hidden-gem-questions.cjs']);
assert.deepEqual(['content/hidden-gem-questions.json','games/hidden-gem/questions.js'].map(p=>fs.readFileSync(p,'utf8')),generatedBefore,'Generated files reproduce byte for byte');
(async()=>{const db=new PGlite();try{
await db.exec("create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;");
for(const path of ['supabase/setup.sql','supabase/friends.sql'])await db.exec(fs.readFileSync(path,'utf8'));
const before={};for(const sig of ['save_game(text,jsonb,bigint)','_friend_score(text,jsonb,date)','_friend_records(uuid,date)','friend_scores()'])before[sig]=(await db.query('select pg_get_functiondef($1::regprocedure) d',['public.'+sig])).rows[0].d;await db.exec(fs.readFileSync('supabase/hidden-gem.sql','utf8'));await db.exec(fs.readFileSync('supabase/hidden-gem.sql','utf8'));
for(const sig of Object.keys(before))assert.equal((await db.query('select pg_get_functiondef($1::regprocedure) d',['public.'+sig])).rows[0].d,before[sig],'Legacy function unchanged: '+sig);
for(const r of [good,mixed,zero,M.create(B,day),...bad]){const actual=(await db.query('select public._friend_hidden_gem_score($1,$2) s',[encode(r),day])).rows[0].s;assert.equal(actual,M.record(r,day)?.arcadeScore??null,'SQL full snapshot parity');}
assert.equal((await db.query('select public._friend_hidden_gem_score($1,$2) s',[encode(oldRun),oldRun.day])).rows[0].s,M.record(oldRun,oldRun.day).arcadeScore);
assert.equal((await db.query('select public._friend_hidden_gem_score($1,$2) s',[encode(corrected),corrected.day])).rows[0].s,M.record(corrected,corrected.day).arcadeScore,'Reviewed aliases in captured snapshots retain SQL score parity');
for(const size of [512,513]){const fixture={...wide,answers:Array.from({length:size},(_,i)=>({name:'Answer '+i,points:1+i%100,aliases:[]}))};assert.equal((await db.query('select public._hg_question($1) valid',[encode(fixture)])).rows[0].valid,size===512);}
for(const q of [...B,...activeBank]){assert.equal((await db.query('select public._hg_question($1) valid',[encode(q)])).rows[0].valid,true,q.id);for(const a of [q.answers[0],q.answers.at(-1)]){const actual=(await db.query('select public._hg_match($1,$2) a',[encode(q),a.name])).rows[0].a;assert.equal(actual.answer,a.name,q.id);assert.equal(actual.points,a.points);}}
for(const x of ['Azerbaijna','Austria','Canada','  Antigua & Barbuda  ','\u00a0Australia\u00a0']){const actual=(await db.query('select public._hg_match($1,$2) a',[encode(countries),x])).rows[0].a,expected=M.match(countries,x);assert.equal(actual?.answer??null,expected?.name??null);assert.equal(actual?.typo??null,expected?.typo??null);}
assert.equal((await db.query('select public._hg_match($1,$2) a',[encode(ambiguous),'Catapelt'])).rows[0].a,null);

for(const q of activeBank)for(const raw of Object.keys(q.inputMap||{})){const expected=M.match(q,raw),actual=(await db.query('select public._hg_match($1,$2) a',[encode(q),raw])).rows[0].a;assert.equal(actual?.answer,expected.name,q.id+' SQL symbol '+raw);assert.equal(actual?.points,expected.points);}
assert.equal((await db.query('select public._friend_hidden_gem_score($1,$2) s',[encode(boundedRun),boundedRun.day])).rows[0].s,M.record(boundedRun,boundedRun.day).arcadeScore,'New complete-roster snapshot score parity');
assert.equal((await db.query('select public._friend_hidden_gem_score($1,$2) s',[encode(oldRatingDaily),oldRatingDaily.day])).rows[0].s,100,'Archived hg8 completed scores retain their original rules');
for(const input of ['Crash','Crash Bandicoot','Coco','Penta Penguin']){const actual=(await db.query('select public._hg_match($1,$2) a',[encode(newCrash),input])).rows[0].a;assert.equal(actual.points,M.match(newCrash,input).points,'New contextual score SQL parity: '+input);}
const users=['00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002'];for(const uid of users)await db.query('insert into auth.users values($1)',[uid]);
const today=(await db.query("select timezone('Australia/Sydney',now())::date::text d")).rows[0].d,liveRun=structuredClone(good);liveRun.day=today;const liveKey=M.PREFIX+today;
const session=async uid=>{await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);};
const hub=async(action,code=null,target=null,name=null,share=null)=>(await db.query('select public.friend_hub($1,$2,$3,$4,$5) h',[action,code,target,name,share])).rows[0].h;
const scores=async()=>(await db.query('select public.hidden_gem_friend_scores() s')).rows[0].s.records;
await session(users[0]);assert.equal((await db.query('select public.save_hidden_gem($1,$2,0) r',['hidden-gem',encode({[liveKey]:encode(liveRun)})])).rows[0].r.conflict,false);assert((await db.query('select public.save_hidden_gem($1,$2,0) r',['hidden-gem','{}'])).rows[0].r.conflict);await assert.rejects(db.query('select public.save_hidden_gem($1,$2,1)',['hidden-gem','{"br:cloud:owner":"bad"}']),/Unsupported/);await assert.rejects(db.query('select public.save_hidden_gem($1,$2,1)',['stake','{}']),/Invalid/);await assert.rejects(db.query('insert into public.hidden_gem_saves(user_id,data) values($1,$2)',[users[1],'{}']),/permission denied/);
const alice=(await hub('enable',null,null,'Alice',true)).me;await session(users[1]);await hub('enable',null,null,'Bob',true);assert.equal((await scores()).length,0);assert.equal((await db.query('select count(*)::int n from public.hidden_gem_saves')).rows[0].n,0);await hub('request',alice.code);assert.equal((await scores()).length,0);await session(users[0]);await hub('accept',null,users[1]);await session(users[1]);const shared=await scores();assert.equal(shared.length,1);assert.equal(shared[0].game,'hidden-gem');assert.equal(shared[0].arcadeScore,100);assert.deepEqual(Object.keys(shared[0]).sort(),['arcadeScore','date','game','user_id']);
await session(users[0]);await hub('settings',null,null,'Alice',false);await session(users[1]);assert.equal((await scores()).length,0);await session(users[0]);await hub('settings',null,null,'Alice',true);await hub('block',null,users[1]);await session(users[1]);assert.equal((await scores()).length,0);await db.exec('reset role');

await db.exec('set role authenticated');await assert.rejects(db.query('select public._friend_hidden_gem_score($1,$2)',[encode(good),day]),/permission denied/);await db.exec('reset role;set role anon');await assert.rejects(db.query('select public._hg_match($1,$2)',[encode(countries),'Australia']),/permission denied/);
console.log('PASS Hidden Gem dedicated cloud/RLS/revision/Friends/legacy-function invariance;  240 questions/'+activeBank.reduce((n,q)=>n+q.answers.length,0)+' active answers; archived-bank compatibility; 48 nonrepeating sets; alias/typo/retry/deadline/locks; score bands; cloud completion; read-only profile; isolated PostgreSQL parity and revoked helper access.');
}finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
