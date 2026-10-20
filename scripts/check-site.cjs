/* Check deployed links/assets and parse every shipped script, including inline engines. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const root=path.resolve(process.argv[2]||'dist'),files=[],problems=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else files.push(p);}}
walk(root);let links=0,scripts=0;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'break-room-check-'));
function reference(from,value){
 value=value.trim().replaceAll('&amp;','&');if(!value||value.startsWith('#')||/^(?:https?:|data:|mailto:|tel:|javascript:)/i.test(value))return;
 if(value.startsWith('/')||value.startsWith('\\')){problems.push(`${path.relative(root,from)}: root-relative URL breaks project hosting: ${value}`);return;}
 let relative;try{relative=decodeURIComponent(value.split(/[?#]/)[0]);}catch{problems.push(`Invalid URL in ${from}: ${value}`);return;}
 if(!relative)return;
 let target=path.resolve(path.dirname(from),relative);if(target!==root&&!target.startsWith(root+path.sep)){problems.push(`URL leaves site: ${value}`);return;}
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 if(!fs.existsSync(target))problems.push(`${path.relative(root,from)}: missing ${value}`);links++;
}
function syntax(source,name){const p=path.join(temp,'script.js');fs.writeFileSync(p,source);const result=spawnSync(process.execPath,['--check',p],{encoding:'utf8'});scripts++;if(result.status!==0)problems.push(`${name}: ${result.stderr}`);}
try{for(const file of files){
 const ext=path.extname(file);if(!['.html','.css','.js','.json','.webmanifest'].includes(ext))continue;
 const text=fs.readFileSync(file,'utf8');
 if(ext==='.html'){
  for(const match of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']*)["']/gi))reference(file,match[1]);
  for(const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))if(!/\bsrc\s*=/.test(match[1])&&!/application\/(?:ld\+)?json/.test(match[1])&&match[2].trim())syntax(match[2],path.relative(root,file)+' inline script');
 }
 if(ext==='.css'||ext==='.html')for(const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))reference(file,match[1]);
 if(ext==='.js')syntax(text,path.relative(root,file));
 if(ext==='.json'||ext==='.webmanifest')try{JSON.parse(text);}catch{problems.push('Invalid JSON: '+path.relative(root,file));}
}
for(const denied of ['tools','game-drafts','design','tests','scripts','content','node_modules','games/_template','games/lowball/engine/icons/generated/source','.git','package.json','AGENTS.md'])if(fs.existsSync(path.join(root,denied)))problems.push('Development-only content included: '+denied);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}else console.log(`PASS: ${files.length} shipped files, ${links} local references, ${scripts} parsed scripts, valid JSON and no development-only content.`);
