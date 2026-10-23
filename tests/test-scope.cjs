/* Test the selection contract without launching games or requiring Git history. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{UNITS,GAMES,selectChecks}=require('../scripts/test-scope.cjs');
const available=fs.readdirSync('tests').filter(p=>p.endsWith('.cjs'));
const plan=files=>selectChecks(files,available);
const alibi=plan(['games/alibi/index.html','tests/alibi.cjs','AGENTS.md','games/alibi/README.md']);
assert.deepEqual(alibi.browser,['alibi.cjs']);assert.deepEqual(alibi.unit,[]);assert.deepEqual(alibi.games,['alibi']);assert(alibi.legal);assert(!alibi.python&&!alibi.content);
const docs=plan(['AGENTS.md','HOSTING.md']);assert.deepEqual(docs.browser,[]);assert.deepEqual(docs.unit,[]);
for(const game of GAMES){const p=plan(['games/'+game+'/index.html']);assert.deepEqual(p.games,[game]);assert(p.browser.length>0);assert(!p.browser.includes('extended-play.cjs'));assert(!p.browser.includes('accounts.cjs'));}
const engine=plan(['games/alibi/alibi.js']);assert(engine.browser.includes('alibi.cjs')&&engine.browser.includes('playtest-feedback-ui.cjs'));assert(!engine.browser.includes('stack-up.cjs'));assert.deepEqual(engine.games,['alibi']);
const clock=plan(['daily-clock.js']);assert.equal(clock.games.length,GAMES.length);assert(clock.unit.includes('daily-clock.cjs'));assert(!clock.browser.includes('extended-play.cjs'));
const css=plan(['game-shell.css']);assert(css.browser.includes('game-surfaces.cjs'));assert(!css.browser.includes('extended-play.cjs'));
const auth=plan(['accounts.js']);assert(auth.browser.includes('accounts.cjs'));assert(!auth.browser.includes('alibi.cjs'));
const profile=plan(['profile.js']);assert.deepEqual(profile.browser,['profile.cjs']);
const direct=plan(['tests/stack-up.cjs']);assert.deepEqual(direct.browser,['stack-up.cjs']);assert.deepEqual(direct.unit,[]);
assert.deepEqual(plan(['games/alibi/index.html','games/alibi/index.html']).browser,['alibi.cjs']);
assert.deepEqual(plan(['games/alibi/old.js','games/pack/new.js']).games,['alibi','pack'],'A rename across games covers both old and new paths');
assert.throws(()=>plan(['new-runtime.js']),/No focused check mapping/);assert.throws(()=>plan(['/etc/passwd']),/repository-relative/);assert.throws(()=>plan(['../secret']),/repository-relative/);
assert.throws(()=>selectChecks(['games/alibi/index.html'],[]),/Missing mapped check/);
const full=selectChecks([],available,{full:true});assert.deepEqual(full.unit,[...UNITS].sort());assert.equal(full.unit.length+full.browser.length,available.length);assert(full.python&&full.content&&full.legal);
const infra=plan(['scripts/test-scope.cjs','.github/workflows/site.yml','package.json']);assert(infra.unit.includes('test-scope.cjs'));assert(!infra.browser.includes('extended-play.cjs'));assert(!infra.browser.includes('alibi.cjs'));
const {options}=require('../scripts/affected-checks.cjs'),{spawnSync}=require('node:child_process');
assert.deepEqual(options(['--files','games/alibi/index.html']).files,['games/alibi/index.html']);assert(options(['--full']).full);assert.throws(()=>options(['--base']),/Missing/);assert.throws(()=>options(['--wat']),/Unknown option/);
const failed=spawnSync(process.execPath,['scripts/run-checks.cjs','unit','missing-check.cjs'],{encoding:'utf8'});assert.equal(failed.status,1);assert.match(failed.stderr,/Unknown unit check/);
console.log('PASS focused checks: Alibi-only help change, docs-only, each game, models, shared dependencies, direct tests, renames, missing mappings and explicit full-suite override.');
