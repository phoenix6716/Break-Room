/* Pure changed-file selection. Full game sweeps require an explicit --full request. */
const UNITS=["time-drop-rules.cjs","test-scope.cjs","playtest-feedback.cjs","factual-review.cjs","launch-content.cjs","inner-clock-rules.cjs","bouncer-rules.cjs","alibi-scenarios.cjs","alibi-rules.cjs","laser-rules.cjs","practice-session-rules.cjs","prior-rules.cjs","pack-rules.cjs","content-tools.cjs","friends-database.cjs","account-navigation.cjs","cloud-saves.cjs","cloud-database.cjs","arcade-score.cjs","daily-clock.cjs","profile-records.cjs","question-banks.cjs"];

const PLACEHOLDERS=['pixel-pairs','word-forge','gridlock','number-drop','memory-lane','mystery-cabinet'];
const GAMES=['lowball','stake','stack-up','pack','prior','laser','alibi','bouncer','inner-clock','time-drop'];
const GAME_UI={
 'time-drop':['time-drop.cjs'],
 lowball:['price-reference.cjs','lowball-art.cjs'],
 stake:['stake-timer.cjs','stake-sharing.cjs'],
 'stack-up':['stack-up.cjs','stack-shell.cjs','stack-feedback.cjs'],
 pack:['pack.cjs'],prior:['prior.cjs'],laser:['laser.cjs'],alibi:['alibi.cjs'],
 bouncer:['bouncer.cjs'],'inner-clock':['inner-clock.cjs']
};
const GAME_RULES={
 'time-drop':['time-drop-rules.cjs'],
 lowball:['question-banks.cjs','factual-review.cjs'],
 stake:['question-banks.cjs','factual-review.cjs'],
 'stack-up':['question-banks.cjs','factual-review.cjs','playtest-feedback.cjs'],
 pack:['pack-rules.cjs'],prior:['prior-rules.cjs'],laser:['laser-rules.cjs'],
 alibi:['alibi-rules.cjs','alibi-scenarios.cjs','playtest-feedback.cjs'],
 bouncer:['bouncer-rules.cjs'],'inner-clock':['inner-clock-rules.cjs']
};
function selectChecks(changed,available,{full=false}={}){
 if(!Array.isArray(changed)||!changed.every(p=>typeof p==='string'&&!p.startsWith('/')&&!p.split('/').includes('..')))throw Error('Changed files must be repository-relative paths.');
 const files=[...new Set(changed.map(p=>p.replace(/^\.\//,'')))].sort();
 const known=new Set(available),unit=new Set(),browser=new Set(),games=new Set(),reasons=[];
 let python=false,legal=false,content=false;
 const add=(...names)=>{for(const name of names.flat()){if(!known.has(name))throw Error('Missing mapped check: '+name);(UNITS.includes(name)?unit:browser).add(name);}};
 const game=(id,rules=false)=>{if(!GAMES.includes(id))throw Error('Add a test scope for game '+id);games.add(id);add(GAME_UI[id]);if(rules){add(GAME_RULES[id]);if(['alibi','stack-up'].includes(id))add('playtest-feedback-ui.cjs');}};
 const infra=()=>add('test-scope.cjs','smoke.cjs','release.cjs');
 const auth=()=>add('account-navigation.cjs','cloud-saves.cjs','cloud-database.cjs','profile-records.cjs','accounts.cjs','friends.cjs');
 const layout=()=>add('game-surfaces.cjs','layout-goals.cjs','mobile-access.cjs','game-template.cjs');
 if(full){for(const name of available)if(name.endsWith('.cjs'))add(name);python=true;legal=true;content=true;GAMES.forEach(id=>games.add(id));reasons.push('Explicit full-suite request.');}
 else for(const file of files){
  const before=unit.size+browser.size;
  if(/\.md$/i.test(file)||/^(?:design|game-drafts|source)\//.test(file)||['.gitignore','.DS_Store'].includes(file))continue;
  if(/^tests\/[^/]+\.cjs$/.test(file)){const name=file.slice(6);if(known.has(name))add(name);else reasons.push('Deleted check: '+file);continue;}
  if(file==='tests/question-maths.py'){python=true;continue;}
  if(file.startsWith('tests/fixtures/')){if(file.includes('alibi'))game('alibi',true);else throw Error('Add a test scope for fixture '+file);continue;}
  const own=file.match(/^games\/([^/]+)\//);
  const model=file.match(/^(pack|prior|laser|alibi|bouncer|inner-clock|time-drop)-model\.js$/);
  if(own){
   if(own[1]==='_template')add('game-template.cjs');
   else if(PLACEHOLDERS.includes(own[1]))add('smoke.cjs');
   else{
    const rules=/\.(?:js|json)$/.test(file);game(own[1],rules);
    if(/(?:questions|stacks|cases|evidence-cases|boards|puzzles|events|reference-prices|price-review)\.(?:js|json)$/.test(file))content=true;
   }
  }else if(model){game(model[1],true);add('profile-records.cjs','cloud-saves.cjs');}
  else if(/^supabase\//.test(file)){add('friends-database.cjs','cloud-database.cjs','playtest-feedback.cjs');}
  else if(/^content\//.test(file)){
   content=true;add('content-tools.cjs');
   if(/time-drop/.test(file))game('time-drop',true);
   else if(/alibi/.test(file))game('alibi',true);
   else if(/bouncer/.test(file))game('bouncer',true);
   else if(/laser/.test(file))game('laser',true);
   else if(/pack/.test(file))game('pack',true);
   else if(/prior/.test(file))game('prior',true);
   else if(/stack-up-familiar/.test(file))game('stack-up',true);
   else if(/lowball|price/.test(file))game('lowball',true);
   else{add('question-banks.cjs','factual-review.cjs','question-migrations.cjs');python=true;}
  }else if(/^scripts\/build-(?:time-drop|alibi|bouncer|laser|pack|prior)/.test(file)){
   const id=file.match(/^scripts\/build-(time-drop|alibi|bouncer|laser|pack|prior)/)[1];game(id,true);content=true;
  }else if(file==='scripts/build-familiar-stacks.cjs'){game('stack-up',true);content=true;}
  else if(/scripts\/(?:build-launch-content|build-question-banks|review-question-banks)/.test(file)){add('launch-content.cjs','question-banks.cjs','factual-review.cjs');content=true;python=true;}
  else if(/^scripts\/(?:content|new-game)/.test(file)||/^tools\//.test(file)){add('content-tools.cjs','content-studio.cjs');content=true;}
  else if(file==='scripts/extract-lowball-images.cjs'){game('lowball');}
  else if(file==='scripts/sync-legal-footer.cjs'){add('legal-pages.cjs');legal=true;}
  else if(/^scripts\//.test(file)||/^\.github\/workflows\//.test(file)||/^package(?:-lock)?\.json$/.test(file)||file==='.node-version'){infra();}
  else if(/^(?:accounts|account-config|cloud-saves)\.(?:js|css)$/.test(file)||/^(?:account|login|signup|forgot-password|reset-password)\.html$/.test(file)||/^assets\/vendor\//.test(file)){auth();}
  else if(/^friends\.(?:js|css|html)$/.test(file)){add('friends-database.cjs','friends.cjs');}
  else if(/^profile(?:-records)?\.(?:js|css|html)$/.test(file)){add('profile-records.cjs','profile.cjs');}
  else if(file==='arcade-score.js'){add('arcade-score.cjs','profile-records.cjs','cloud-saves.cjs','friends-database.cjs','arcade-score-ui.cjs','profile.cjs','friends.cjs','game-surfaces.cjs');}
  else if(file==='arcade-score.css'){layout();}
  else if(file==='daily-clock.js'){add('daily-clock.cjs','homepage-reset.cjs');GAMES.forEach(id=>game(id));}
  else if(/^practice-session\.(?:js|css)$/.test(file)){add('practice-session-rules.cjs','extended-play.cjs','replay-unlimited.cjs');}
  else if(/^game-feel\.(?:js|css)$/.test(file)){add('game-feel.cjs');}
  else if(/^(?:game-shell|game-access|game-dialog|game-layout|game-flow|daily-reset|break-room|styles|placeholder-layout|prototype-pages)\.(?:js|css)$/.test(file)){layout();}
  else if(file==='stack-layout.css'){game('stack-up');add('layout-goals.cjs');}
  else if(/^(?:navigation|game-config|game|menu|menu-brand)\.(?:js|css)$/.test(file)||file==='game.html'){add('smoke.cjs','game-surfaces.cjs');}
  else if(/^(?:privacy|terms|contact)\.html$/.test(file)||file==='legal.css'){add('legal-pages.cjs');legal=true;}
  else if(file==='index.html'){add('smoke.cjs','homepage-reset.cjs');}
  else if(file==='style-guide.html'||file.startsWith('assets/')){add('smoke.cjs');}
  else throw Error('No focused check mapping for '+file+'. Add its dependencies to scripts/test-scope.cjs or explicitly request --full.');
  if(file.endsWith('.html'))legal=true;
  if(unit.size+browser.size>before)reasons.push(file);
 }
 return {files,full,games:[...games].sort(),unit:[...unit].sort(),browser:[...browser].sort(),python,legal,content,reasons};
}
module.exports={UNITS,GAMES,selectChecks};
