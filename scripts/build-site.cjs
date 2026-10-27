/* Build the active public games and neutral redirects for retired bookmarks. */
const fs=require('node:fs'),path=require('node:path');
require('./bundle-auth.cjs');
const {applyBrand}=require('./site-brand.cjs');
const root=path.resolve(__dirname,'..'),output=path.join(root,'dist');
const registry={window:{}};require('node:vm').runInNewContext(fs.readFileSync(path.join(root,'game-config.js'),'utf8'),registry);
const activeGames=new Set(registry.window.MIDNIGHT_ARCADE_GAMES.filter(g=>g.status==='live').map(g=>g.id));
const retiredGames=["stake","prior","alibi","bouncer","pixel-pairs","word-forge","gridlock","number-drop","memory-lane","mystery-cabinet"];
if(activeGames.size!==10)throw Error('Expected the ten current public games');
const web=new Set(['.html','.css','.js','.json','.webmanifest','.svg','.png','.jpg','.jpeg','.gif','.webp','.ico','.ttf','.woff','.woff2','.mp3','.wav','.ogg']);
const excluded=new Set(['node_modules','.git','source','_template','__pycache__']);
let count=0,total=0;
function copy(file,relative){
 const target=path.join(output,relative);fs.mkdirSync(path.dirname(target),{recursive:true});if(path.extname(file).toLowerCase()==='.html'){
  const html=fs.readFileSync(file,'utf8').replace(/<nav\b[^>]*class="[^"]*\bgame-menu\b[^"]*"[^>]*>[\s\S]*?<\/nav>/g,nav=>nav.replace(/<a\b[^>]*href="[^"]*games\/(?:alibi|bouncer|prior|stake|pixel-pairs|word-forge|gridlock|number-drop|memory-lane|mystery-cabinet|time-drop|clue-ladder|seating-chart|shift-work|hidden-gem)\/index\.html"[^>]*>[\s\S]*?<\/a>/g,'').replace(/(<a\b[^>]*href="([^"]*)games\/laser\/index\.html"[^>]*>[\s\S]*?<\/a>)/,(_,link,prefix)=>link+'<a href="'+prefix+'games/time-drop/index.html">Time Drop</a><a href="'+prefix+'games/clue-ladder/index.html">Clue Ladder</a><a href="'+prefix+'games/seating-chart/index.html">Seating Chart</a><a href="'+prefix+'games/shift-work/index.html">Desk Jam</a><a href="'+prefix+'games/hidden-gem/index.html">Sleeper</a>'));
  // Keep generated static drawer labels aligned with the approved display name.
  const rendered=html.replace(/(src="[^"]*(?:navigation|game-config)\.js)(?:\?[^\"]*)?"/g,'$1?v=current-games-20261027"').replace(/(src="[^"]*inner-clock-model\.js)(?:\?[^\"]*)?"/g,'$1?v=no-repeat-20261026"').replace(/<nav\b[^>]*class="[^"]*\bgame-menu\b[^"]*"[^>]*>[\s\S]*?<\/nav>/g,nav=>nav.replace(/(<a\b[^>]*href="[^"]*games\/inner-clock\/index\.html"[^>]*>)[\s\S]*?(<\/a>)/g,(_,open,close)=>open+'Time Sense'+close));
  fs.writeFileSync(target,applyBrand(rendered,relative));
 }else fs.copyFileSync(file,target);
 count++;total+=fs.statSync(target).size;
}
function tree(dir,relative){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(entry.name.startsWith('.')||excluded.has(entry.name)||(relative==='games'&&entry.isDirectory()&&!activeGames.has(entry.name)))continue;
 const file=path.join(dir,entry.name),next=path.join(relative,entry.name);
 if(entry.isDirectory())tree(file,next);else if(entry.isFile()&&web.has(path.extname(entry.name).toLowerCase()))copy(file,next);
}}
fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
for(const entry of fs.readdirSync(root,{withFileTypes:true})){
 if(entry.isFile()&&['.html','.css','.js'].includes(path.extname(entry.name)))copy(path.join(root,entry.name),entry.name);
}
for(const dir of ['assets','games'])tree(path.join(root,dir),dir);

// Old bookmarks return to the shelf; retired engines, banks and assets never enter the artifact.
for(const id of retiredGames){
 const relative='games/'+id+'/index.html',target=path.join(output,relative);
 const page='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=../../index.html"><link rel="canonical" href="../../index.html"><title>Break Room</title></head><body><p><a href="../../index.html">Return to Break Room</a></p><script>location.replace("../../index.html");</script></body></html>';
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,page);
}

// Replace archived standalone social placeholders only in the published artifact.
const site=new URL(process.env.SITE_URL||'https://phoenix6716.github.io/Break-Room/');
if(site.protocol!=='https:')throw Error('SITE_URL must be an HTTPS public URL');
site.pathname=site.pathname.replace(/\/?$/,'/');site.search='';site.hash='';
const engine=path.join(output,'games/lowball/engine/index.html');
let html=fs.readFileSync(engine,'utf8');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;');
for(const [property,relative]of [['og:url','games/lowball/index.html'],['og:image','games/lowball/engine/og-image.png'],['twitter:image','games/lowball/engine/og-image.png']]){
 const pattern=new RegExp('(<meta (?:property|name)="'+property+'" content=")[^"]*(">)');
 html=html.replace(pattern,(_,before,after)=>before+escape(new URL(relative,site).href)+after);
}
fs.writeFileSync(engine,html);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(`Built ${count} web files (${(total/1024/1024).toFixed(1)} MiB) in dist/; development docs, tests, templates and source atlases excluded.`);
