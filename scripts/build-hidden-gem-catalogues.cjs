/* Publish only a complete, explicitly reviewed source release. No candidate auto-promotion. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
require('../hidden-gem-model.js');const M=BREAK_ROOM_HIDDEN_GEM,root=path.resolve(__dirname,'..');
function compile(release,read){
 if(release.revision!==16||release.review?.membership!=='complete'||release.review?.ratings!=='complete'||release.review?.spacing!=='complete'||!M.date(release.epoch)||release.days<48||release.questions?.length!==release.days*5||!Array.isArray(release.rotation)||release.rotation.length!==release.days)throw Error('A complete reviewed replacement and rotation are required');
 const indices=release.rotation.flat();if(indices.length!==release.questions.length||new Set(indices).size!==indices.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=release.questions.length)||release.rotation.some(day=>!Array.isArray(day)||day.length!==5))throw Error('Invalid complete rotation');
 const artifacts=[],questions=release.questions.map((spec,i)=>{
  if(!/^hg16-\d{3}$/.test(spec.id)||!Array.isArray(spec.familiar)||spec.familiar.length<2||!Array.isArray(spec.lessObvious)||!spec.lessObvious.length||!spec.file||!spec.sha256)throw Error('Missing question review '+spec.id);
  const raw=read(spec.file);if(crypto.createHash('sha256').update(raw).digest('hex')!==spec.sha256)throw Error('Reviewed source changed: '+spec.id);
  const document=JSON.parse(raw),q=document.question,answers=document.answers;if(document.format!=='sleeper-bank-v1'||q.id!==spec.id||!Array.isArray(answers)||answers.length<300||answers.length>250000)throw Error('Invalid or undersized bank '+spec.id);
  const calendar={dailySlot:release.rotation.findIndex(day=>day.includes(i)),cycleEpoch:release.epoch,cycleDays:release.days,ratingMethod:'corpus-editorial-v1'};
  for(const [key,value] of Object.entries(calendar))if(q[key]!==undefined&&q[key]!==value)throw Error('Calendar differs from reviewed source '+q.id);
  if(/\b(?:19|20)\d{2}\b|UNESCO|prime minister|tracklist/i.test(q.prompt+' '+q.scope))throw Error('Inaccessible or dated prompt '+q.id);
  const forms=new Map(),ratings=new Set();for(const a of answers){if(!a||typeof a.name!=='string'||!a.name.length||a.name.length>240||!M.normal(a.name)||!Number.isInteger(a.points)||a.points<1||a.points>100||!Array.isArray(a.aliases)||a.aliases.length>512||!Array.isArray(a.sourceIds)||!a.sourceIds.length||a.sourceIds.some(id=>typeof id!=='string'||!id.length))throw Error('Unreviewed answer '+q.id);
   ratings.add(a.points);for(const form of [a.name,...a.aliases]){if(typeof form!=='string'||!form.length||form.length>240||!M.normal(form)||M.normal(form).length>240||forms.has(M.normal(form)))throw Error('Invalid/ambiguous answer form '+q.id+': '+form);forms.set(M.normal(form),a);}
   if([a.name,...a.aliases].some(s=>M.normal(s).length>=3&&(' '+M.normal(q.scope)+' ').includes(' '+M.normal(s)+' ')))throw Error('Scope reveals an answer '+q.id);
  }
  if(ratings.size<10||[...ratings].filter(x=>x>50&&x<100).length<3||!ratings.has(100))throw Error('Compressed/unreviewed ratings '+q.id);
  if(new Set(spec.familiar.map(x=>forms.get(M.normal(x))).filter(a=>a&&a.points<=19)).size<2||spec.lessObvious.some(x=>forms.get(M.normal(x))?.points!==100))throw Error('Missing reviewed accessibility anchors '+q.id);
  if(document.exactRejections!==undefined&&(!Array.isArray(document.exactRejections)||document.exactRejections.length>512||document.exactRejections.some(x=>typeof x!=='string'||!M.normal(x)||x.length>240||forms.has(M.normal(x)))))throw Error('Invalid exact exclusions '+q.id);
  // Provenance stays in the reviewed source; immutable downloads contain only judging data.
  // Calendar changes must not invalidate a captured bank or duplicate every large download.
  const header=Object.fromEntries(['id','topic','prompt','scope','source'].map(key=>[key,q[key]])),publicDocument={format:'sleeper-bank-v1',question:header,answers:answers.map(a=>({name:a.name,points:a.points,aliases:a.aliases})),notice:'NOTICE.html'};
  if(document.exactRejections!==undefined)publicDocument.exactRejections=document.exactRejections;
  const publicRaw=JSON.stringify(publicDocument)+'\n',hash=crypto.createHash('sha256').update(publicRaw).digest('hex'),manifest={...header,...calendar,bankRef:{id:hash,count:answers.length}};if(!M.puzzle(manifest))throw Error('Invalid catalogue question '+q.id);artifacts.push({id:hash,raw:publicRaw,document:publicDocument,sourceSha256:spec.sha256,sourceFile:spec.file,forms});return manifest;
 });
 if(new Set(questions.map(q=>q.id)).size!==questions.length||new Set(questions.map(q=>M.normal(q.prompt))).size!==questions.length)throw Error('Duplicate question');
 for(const day of release.rotation)if(new Set(day.map(i=>questions[i].topic)).size!==5)throw Error('Repeated topic in Daily');
 if(!Array.isArray(release.conflictingPairs))throw Error('Missing overlap review');for(const [a,b] of release.conflictingPairs){if(!questions[a]||!questions[b]||a===b)throw Error('Invalid overlap pair');const distance=Math.abs(questions[a].dailySlot-questions[b].dailySlot);if(Math.min(distance,release.days-distance)<=1)throw Error('Overlapping prompts together/adjacent');}
 for(let day=0;day<release.days;day++){const date=new Date(Date.parse(release.epoch+'T00:00:00Z')+day*86400000).toISOString().slice(0,10);if(M.daily(questions,date).length!==5)throw Error('Invalid Daily');}
 return{questions,artifacts};
}
const quote=s=>"'"+String(s).replaceAll("'","''")+"'";
function seed(artifact){const raw=artifact.raw||JSON.stringify(artifact.document);let tag='$sleeper_bank$';while(raw.includes(tag))tag=tag.slice(0,-1)+'x$';return 'select public._hg_import_bank('+tag+raw+tag+','+quote(artifact.id)+');\n';}

function main(){
 const source=path.join(root,'content/sleeper-data/release.json');if(!fs.existsSync(source))throw Error('No complete reviewed release exists. Candidate collections cannot replace the live bank.');
 const release=JSON.parse(fs.readFileSync(source,'utf8')),compiled=compile(release,file=>{const full=path.resolve(root,file);if(!full.startsWith(path.join(root,'content/sleeper-data')+path.sep))throw Error('Source outside content workflow');const bytes=fs.readFileSync(full);return(file.endsWith('.gz')?require('node:zlib').gunzipSync(bytes):bytes).toString('utf8');});
 const data={version:1,revision:16,epoch:release.epoch,days:release.days,ratings:'Corpus-assisted editorial estimates, not measured player popularity.',questions:compiled.questions},corrections=[...require('../content/archive/2026-11-01-pre-accessibility/legacy-alias-corrections.json'),...require('../content/archive/2026-11-02-pre-large-banks/hidden-gem-questions.json').questions];
 const credits=require('./build-hidden-gem-notice.cjs'),notice=credits.buildNotice();
 const outputs=new Map([['games/hidden-gem/banks/NOTICE.html',notice],['content/sleeper-data/attribution-history.json',JSON.stringify(credits.attributionHistory(),null,2)+'\n'],['content/hidden-gem-questions.json',JSON.stringify(data,null,2)+'\n'],['games/hidden-gem/questions.js','/* Generated immutable Sleeper catalogue manifest. */\nwindow.HIDDEN_GEM_QUESTIONS='+JSON.stringify(compiled.questions)+';\nwindow.HIDDEN_GEM_LEGACY_ALIAS_CORRECTIONS='+JSON.stringify(corrections)+';\n']]);
 for(const artifact of compiled.artifacts){outputs.set('games/hidden-gem/banks/'+artifact.id+'.json',artifact.raw);if(process.argv.includes('--registry-sql'))outputs.set('.artifacts/sleeper-registry/'+artifact.id+'.sql',seed(artifact));}
 outputs.set('content/sleeper-data/registry-manifest.json',JSON.stringify({revision:16,banks:compiled.artifacts.map(a=>({id:a.id,file:'games/hidden-gem/banks/'+a.id+'.json',count:a.document.answers.length,bytes:Buffer.byteLength(a.raw),sourceFile:a.sourceFile,sourceSha256:a.sourceSha256}))},null,2)+'\n');
 // Validate everything before writing anything. Old immutable files are never removed.
 for(const [file,raw]of outputs){const full=path.join(root,file);if(file.includes('/banks/')&&fs.existsSync(full)&&fs.readFileSync(full,'utf8')!==raw)throw Error('Immutable artifact differs: '+file);}
 if(process.argv.includes('--check')){for(const [file,raw]of outputs)if(!fs.existsSync(path.join(root,file))||fs.readFileSync(path.join(root,file),'utf8')!==raw)throw Error('Generated file differs: '+file);}else for(const [file,raw]of outputs){const full=path.join(root,file);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,raw);}
 console.log('Sleeper replacement: '+compiled.questions.length+' questions, '+Math.min(...compiled.questions.map(q=>q.bankRef.count))+'–'+Math.max(...compiled.questions.map(q=>q.bankRef.count))+' canonical answers; '+release.days+' nonrepeating days.');
}
module.exports={compile,seed};if(require.main===module)main();
