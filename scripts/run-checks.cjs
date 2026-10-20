/* The same exit-code-preserving checks run locally and in GitHub Actions. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),kind=process.argv[2],logs=path.join(root,'.artifacts');
const units=['laser-rules.cjs','practice-session-rules.cjs','prior-rules.cjs','pack-rules.cjs','content-tools.cjs','friends-database.cjs','account-navigation.cjs','cloud-saves.cjs','cloud-database.cjs','arcade-score.cjs','daily-clock.cjs','profile-records.cjs','question-banks.cjs'];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.ttf':'font/ttf','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
const prefix='/Midnight-Arcade';fs.mkdirSync(logs,{recursive:true});
function serve(directory){return new Promise(resolve=>{
 const server=http.createServer((request,response)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);}catch{response.writeHead(400).end();return;}
  if(pathname!==prefix&&!pathname.startsWith(prefix+'/')){response.writeHead(404).end();return;}
  let file=path.resolve(directory,'.'+pathname.slice(prefix.length));
  if(file!==directory&&!file.startsWith(directory+path.sep)){response.writeHead(403).end();return;}
  try{if(fs.statSync(file).isDirectory()){if(!pathname.endsWith('/')){response.writeHead(301,{Location:pathname+'/'}).end();return;}file=path.join(file,'index.html');}if(!fs.statSync(file).isFile())throw Error('not a file');response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(response);}catch{response.writeHead(404).end();}
 });server.listen(0,'127.0.0.1',()=>resolve({server,url:`http://127.0.0.1:${server.address().port}${prefix}`}));
});}
function run(command,args,env,name){return new Promise((resolve,reject)=>{
 console.log('\nRunning '+name);const log=fs.createWriteStream(path.join(logs,name+'.log'));
 const child=spawn(command,args,{cwd:root,env:{...process.env,...env},stdio:['ignore','pipe','pipe']});
 for(const [source,target]of [[child.stdout,process.stdout],[child.stderr,process.stderr]])source.on('data',data=>{target.write(data);log.write(data);});
 child.on('error',e=>{log.end();reject(e);});child.on('close',code=>{log.end();code===0?resolve():reject(Error(name+' failed with exit code '+code));});
});}
(async()=>{
 if(kind==='unit'){
  for(const test of units)await run(process.execPath,['tests/'+test],{},test);
  await run(process.env.PYTHON||'python3',['tests/question-maths.py'],{},'question-maths.py');
 }else if(kind==='browser'){
  if(!fs.existsSync(path.join(root,'dist/index.html')))throw Error('Run npm run build first.');
  const artifact=await serve(path.join(root,'dist')),source=await serve(root);
  const chromium=process.env.ARCADE_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':require('playwright').chromium.executablePath());
  try{for(const test of fs.readdirSync(path.join(root,'tests')).filter(n=>n.endsWith('.cjs')&&!units.includes(n)).sort()){
   const base=['game-template.cjs','layout-goals.cjs'].includes(test)?source.url:artifact.url;
   await run(process.execPath,['tests/'+test],{ARCADE_TEST_URL:base,BASE_URL:base,ARCADE_CHROMIUM:chromium},test);
  }}finally{await Promise.all([artifact.server,source.server].map(server=>new Promise(resolve=>server.close(resolve))));}
 }else throw Error('Use unit or browser');
 console.log('\nAll '+kind+' checks passed.');
})().catch(error=>{console.error(error.message);process.exitCode=1;});
