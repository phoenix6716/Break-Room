/* Development-only inventory/validation. Reads game data; never initializes an engine. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),read=(root,file)=>fs.readFileSync(path.join(root,file),'utf8');
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
const optionKey=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/−/g,'-').replace(/\s+/g,' ');
const normalize=s=>String(s||'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
function load(root=ROOT){
 const sandbox={window:{}};vm.createContext(sandbox);
 for(const file of ['games/stake/questions.js','games/stack-up/stacks.js','games/lowball/engine/item-art.js'])vm.runInContext(read(root,file),sandbox);
 const stakeHTML=read(root,'games/stake/index.html'),lowHTML=read(root,'games/lowball/engine/index.html');
 const baseline=stakeHTML.split('const BANK=`')[1]?.split('`.trim()')[0];if(!baseline)throw Error('Cannot find the frozen Stake bank.');
 const legacy=baseline.trim().split('\n').map((line,i)=>{const [c,q,a,b,d,f]=line.split('|');return{id:'stake-legacy-'+String(i+1).padStart(3,'0'),c,q,o:[a,b,d],f};});
 const lowSource=lowHTML.match(/const ITEMS = (\[[\s\S]*?\n\]);/);if(!lowSource)throw Error('Cannot find Lowball item pool.');
 const items=vm.runInNewContext('('+lowSource[1]+')');
 const audit=JSON.parse(read(root,'content/question-audit.json')),refs=JSON.parse(read(root,'content/reference-data.json'));
 const records=[...legacy.map(q=>({game:'stake',id:q.id,legacy:true,fields:q,review:null})),...sandbox.window.STAKE_QUESTION_ADDITIONS.map(q=>({game:'stake',id:q.id,fields:q,review:audit.stake.find(a=>a.id===q.id)||null})),...sandbox.window.STACK_UP_STACKS.map(s=>({game:'stack-up',id:s.id,fields:s,review:audit.stack_up.find(a=>a.id===s.id)||null})),...items.map((item,i)=>({game:'lowball',id:'lowball-'+String(i+1).padStart(3,'0'),fields:{...item,art:sandbox.window.LOWBALL_ART.items[item.name]},review:null}))];
 const json=JSON.parse(JSON.stringify(records));return{version:1,fingerprint:hash(JSON.stringify(json)),records:json,sources:refs.sources,reference:refs,art:[...new Set([...Object.values(sandbox.window.LOWBALL_ART.items),...fs.readdirSync(path.join(root,'games/lowball/engine/icons/generated')).filter(n=>/^[a-z0-9-]+\.png$/.test(n)&&!Object.values(sandbox.window.LOWBALL_ART.utilities).includes(n))])].sort(),inheritedPriceDate:lowHTML.match(/const PRICES_CHECKED = "([^"]*)"/)?.[1]||null};
}
const string=(v,max=2000)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
function validate(draft,catalog,{reviewed=false,root=ROOT}={}){
 const errors=[],warnings=[],fail=s=>errors.push(s),f=draft?.fields;
 if(!draft||draft.format!=='break-room-content-draft'||draft.version!==1)return{errors:['Use a version-1 Break Room content draft.'],warnings};
 if(!['stake','stack-up','lowball'].includes(draft.game))fail('Choose a supported game.');
 if(!['new','replace'].includes(draft.mode))fail('Choose new or replace.');
 if(!string(draft.id,80)||!/^\w[\w-]*$/.test(draft.id))fail('Use a stable ID with letters, numbers, underscores or hyphens.');
 const original=catalog.records.find(r=>r.game===draft.game&&r.id===draft.id);
 if(draft.mode==='new'&&original)fail('This ID already exists.');
 if(draft.mode==='replace'&&!original)fail('The record to replace does not exist.');
 if(original?.legacy)fail('The first 164 Stake questions are frozen for legacy save recovery. Add a new question instead.');
 if(draft.baseFingerprint!==catalog.fingerprint)fail('The live content changed since this draft was created. Reload and rebase the draft before review.');
 if(!f||typeof f!=='object'||Array.isArray(f))return{errors:[...errors,'Missing content fields.'],warnings};
 if(draft.game==='stake'){
  for(const [key,label]of [['c','Category'],['q','Question'],['f','Answer explanation']])if(!string(f[key]))fail(label+' is required.');
  if(!Array.isArray(f.o)||f.o.length!==3||!f.o.every(o=>string(o,300))||new Set(f.o.map(optionKey)).size!==3)fail('Provide one correct answer and two distinct wrong answers.');
  if(catalog.records.some(r=>r.game==='stake'&&r.id!==draft.id&&normalize(r.fields.q)===normalize(f.q)))fail('This question duplicates an existing question.');
 }else if(draft.game==='stack-up'){
  for(const [key,label]of [['category','Category'],['prompt','Ordering question'],['fact','Post-answer explanation']])if(!string(f[key]))fail(label+' is required.');
  if(!Array.isArray(f.ends)||f.ends.length!==2||!f.ends.every(s=>string(s,80)))fail('Provide both ordering endpoint labels.');
  if(!Array.isArray(f.cards)||f.cards.length!==5)fail('Provide exactly five cards.');else{
   if(new Set(f.cards.map(c=>normalize(c?.name))).size!==5)fail('Card names must be distinct.');
   f.cards.forEach((c,i)=>{if(!string(c?.name,300))fail('Card '+(i+1)+' needs a name.');if(c?.value!==i+1)fail('Card order/rank must be 1–5 in correct order.');if(c?.detail!=='')fail('Card '+(i+1)+' leaks a pre-answer description. Leave descriptions blank.');});
   if(catalog.records.some(r=>r.game==='stack-up'&&r.id!==draft.id&&normalize(r.fields.prompt)===normalize(f.prompt)&&r.fields.cards.map(c=>normalize(c.name)).sort().join('|')===f.cards.map(c=>normalize(c.name)).sort().join('|')))fail('This stack duplicates an existing set.');
  }
  const values=draft.evidence?.values;
  if(!Array.isArray(values)||values.length!==5||!values.every(Number.isFinite)||values.some((v,i)=>i&&v<=values[i-1]))fail('Enter five strictly increasing reference measurements, matching the correct card order. No ties.');
  if(!string(draft.evidence?.measure,200))fail('Specify the measured quantity and units/scope.');
 }else if(draft.game==='lowball'){
  if(!string(f.name,120)||!string(f.detail,300))fail('Give the item a name and a precise size/model/portion.');
  if(catalog.records.some(r=>r.game==='lowball'&&r.id!==draft.id&&normalize(r.fields.name)===normalize(f.name)))fail('This item name already exists.');
  for(const region of ['AU','US','UK','CA'])if(!Number.isFinite(f.prices?.[region])||f.prices[region]<=0||f.prices[region]>1000000||Math.abs(f.prices[region]*100-Math.round(f.prices[region]*100))>1e-7)fail(region+' needs a positive price with at most two decimals.');
  if(!string(f.art,100)||!/^[a-z0-9-]+\.png$/.test(f.art))fail('Choose a generated PNG filename.');else{
   const image=path.join(root,'games/lowball/engine/icons/generated',f.art);
   if(!fs.existsSync(image))fail('The generated item image is missing.');else{const b=fs.readFileSync(image);if(b.length<24||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')fail('Item art must be a PNG image.');}
  }
  warnings.push('Lowball pool size, order and price changes affect date-seeded items and unfinished guesses. A reviewed release/migration is required before applying this draft.');
 }
 const review=draft.review||{};
 if(!Array.isArray(review.sources)||!review.sources.length||!review.sources.every(url=>{try{return new URL(url).protocol==='https:';}catch{return false;}}))fail('Provide at least one HTTPS factual source URL.');
 if(!string(review.notes))warnings.push('Add a verification note describing what the source confirms.');
 if(review.checkedOn&&!validDate(review.checkedOn))fail('Use a real YYYY-MM-DD review date.');
 if(validDate(review.checkedOn)&&review.checkedOn>new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()))fail('The review date cannot be in the future.');
 if(reviewed){if(!review.verified)fail('A person must confirm the facts were checked.');if(!validDate(review.checkedOn))fail('A review date is required.');if(!string(review.notes))fail('A verification note is required.');if(draft.game==='lowball')for(const region of ['AU','US','UK','CA']){try{if(new URL(draft.evidence?.regionSources?.[region]).protocol!=='https:')throw Error();}catch{fail('Provide the '+region+' local price source.');}}}
 warnings.push('Source links and measurements are review evidence, not an automatic guarantee of factual accuracy.');
 return{errors,warnings};
}
function report(catalog,root=ROOT){
 const errors=[],warnings=[],counts={};
 const seen=new Set(),questions=new Set(),stacks=new Set();for(const r of catalog.records){counts[r.game]=(counts[r.game]||0)+1;const key=r.game+':'+r.id;if(seen.has(key))errors.push('Duplicate stable ID '+key);seen.add(key);
  if(r.game==='stake'&&(!r.fields.q||!Array.isArray(r.fields.o)||r.fields.o.length!==3||new Set(r.fields.o.map(optionKey)).size!==3))errors.push('Invalid trivia record '+r.id);
  if(r.game==='stake'){const q=normalize(r.fields.q);if(questions.has(q))errors.push('Duplicate question '+r.id);questions.add(q);if(r.review&&r.fields.o[0]!==r.review.answer)errors.push('Audited answer changed: '+r.id);}
  if(r.game==='stack-up'&&(r.fields.cards.length!==5||r.fields.cards.some((c,i)=>c.detail||c.value!==i+1)||new Set(r.fields.cards.map(c=>normalize(c.name))).size!==5))errors.push('Invalid/leaking stack '+r.id);
  if(r.game==='stack-up'){
   const signature=normalize(r.fields.prompt)+':'+r.fields.cards.map(c=>normalize(c.name)).sort().join('|');if(stacks.has(signature))errors.push('Duplicate stack '+r.id);stacks.add(signature);
   const row=r.review;if(!row||row.ordered.length!==5)errors.push('Missing stack audit '+r.id);else for(let i=0;i<5;i++){const value=row.ordered[i];if(value.name!==r.fields.cards[i].name||!Number.isFinite(value.value)||(i&&value.value<=row.ordered[i-1].value))errors.push('Incorrect audited order '+r.id);if(row.source!=='math'&&catalog.reference[row.source]?.[value.key]?.[row.measure]!==value.value)errors.push('Reference value changed '+r.id);}
  }
  if(r.game==='lowball'){for(const region of ['AU','US','UK','CA'])if(!Number.isFinite(r.fields.prices[region])||r.fields.prices[region]<=0)errors.push('Missing/invalid '+region+' price: '+r.id);if(!r.fields.art||!fs.existsSync(path.join(root,'games/lowball/engine/icons/generated',r.fields.art)))errors.push('Missing art: '+r.id);}
 }
 warnings.push('164 original Stake questions have no checked-in per-question source audit. Their order is frozen for legacy saves.');
 warnings.push(counts.lowball+' Lowball items inherit estimated regional prices without stored shop-source evidence. The inherited '+(catalog.inheritedPriceDate||'unset')+' display date is not new verification. Review local prices before launch.');
 return{version:1,counts,errors,warnings,reviewCoverage:{sourcedStake:catalog.records.filter(r=>r.game==='stake'&&r.review).length,sourcedStacks:catalog.records.filter(r=>r.game==='stack-up'&&r.review).length,lowballWithPriceEvidence:0},fingerprint:catalog.fingerprint};
}
module.exports={ROOT,load,validate,report,hash};
