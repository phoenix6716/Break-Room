/* Default local/CI entry: plan from changed files, then execute only selected checks. */
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process'),{selectChecks}=require('./test-scope.cjs');
const root=path.resolve(__dirname,'..');
function git(args){const r=spawnSync('git',args,{cwd:root,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr.trim()||'Cannot read Git changes; pass --files or a valid --base.');return r.stdout;}
function options(argv){
 const o={full:process.env.ARCADE_FULL_CHECKS==='1',plan:false,base:process.env.ARCADE_DIFF_BASE||'',head:process.env.ARCADE_DIFF_HEAD||'',files:null};
 for(let i=0;i<argv.length;i++){
  const key=argv[i];if(key==='--full')o.full=true;else if(key==='--plan')o.plan=true;
  else if(key==='--base'||key==='--head'){if(!argv[i+1])throw Error('Missing '+key+' value');o[key.slice(2)]=argv[++i];}
  else if(key==='--files'){o.files=argv.slice(i+1);break;}else throw Error('Unknown option '+key);
 }return o;
}
function changed(o){
 if(o.files)return o.files;
 if(o.base&&/^0+$/.test(o.base))return git(['ls-files','-z']).split('\0').filter(Boolean);
 const base=o.base||(o.head?'HEAD^':'HEAD'),args=['diff','--name-only','--no-renames','-z',base];
 if(o.head)args.push(o.head);args.push('--');
 const files=git(args).split('\0').filter(Boolean);
 if(!o.head)files.push(...git(['ls-files','--others','--exclude-standard','-z']).split('\0').filter(Boolean));
 return files;
}
function run(command,args,extra={}){
 const result=spawnSync(command,args,{cwd:root,env:{...process.env,...extra},stdio:'inherit'});
 if(result.error)throw result.error;if(result.status!==0)throw Error(command+' '+args.join(' ')+' failed ('+result.status+').');
}
function main(){
 const o=options(process.argv.slice(2)),available=fs.readdirSync(path.join(root,'tests')).filter(p=>p.endsWith('.cjs'));
 const plan=selectChecks(changed(o),available,{full:o.full});
 fs.mkdirSync(path.join(root,'.artifacts'),{recursive:true});fs.writeFileSync(path.join(root,'.artifacts/check-plan.json'),JSON.stringify(plan,null,2)+'\n');
 if(o.plan){console.log(JSON.stringify(plan,null,2));if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'browser='+Boolean(plan.browser.length)+'\npython='+plan.python+'\n');return;}
 console.log('Changed files: '+(plan.files.join(', ')||'(none)'));
 console.log('Unit checks: '+(plan.unit.join(', ')||'(none)'));
 console.log('Browser checks: '+(plan.browser.join(', ')||'(none)'));
 if(plan.legal)run(process.execPath,['scripts/sync-legal-footer.cjs','--check']);
 if(plan.content)run(process.execPath,['scripts/content.cjs','report']);
 if(plan.unit.length)run(process.execPath,['scripts/run-checks.cjs','unit',...plan.unit]);
 if(plan.python)run(process.env.PYTHON||'python3',['tests/question-maths.py']);
 // A publishable build and reference/syntax validation are quick static checks, not game sessions.
 run(process.execPath,['scripts/build-site.cjs']);run(process.execPath,['scripts/check-site.cjs','dist']);
 if(plan.browser.length){
  const filter=plan.files.includes('tests/playtest-feedback-ui.cjs')?'':plan.games.join(',');
  run(process.execPath,['scripts/run-checks.cjs','browser',...plan.browser],{ARCADE_TEST_GAMES:filter});
 }
 console.log('All selected checks passed.');
}
if(require.main===module)try{main();}catch(error){console.error(error.message);process.exitCode=1;}
module.exports={options};
