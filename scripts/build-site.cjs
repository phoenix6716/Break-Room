/* Build the active public games and neutral redirects for retired bookmarks. */
const fs=require('node:fs'),path=require('node:path');
require('./bundle-auth.cjs');
const {applyBrand}=require('./site-brand.cjs');
const {siteURL,publicPages,metadata,sitemap}=require('./site-metadata.cjs');
const root=path.resolve(__dirname,'..'),output=path.join(root,'dist');
const registry={window:{}};require('node:vm').runInNewContext(fs.readFileSync(path.join(root,'game-config.js'),'utf8'),registry);
const activeGames=new Set(registry.window.MIDNIGHT_ARCADE_GAMES.filter(g=>g.status==='live').map(g=>g.id));
const site=siteURL(process.env.SITE_URL||'https://breakroomdaily.com/');
const publicMetadata=publicPages(registry.window.MIDNIGHT_ARCADE_GAMES);
const retiredGames=["hidden-gem","stake","prior","alibi","bouncer","pixel-pairs","word-forge","gridlock","number-drop","memory-lane","mystery-cabinet"];
if(activeGames.size!==10)throw Error('Expected the ten launch games');
const web=new Set(['.html','.css','.js','.json','.webmanifest','.svg','.png','.jpg','.jpeg','.gif','.webp','.ico','.ttf','.woff','.woff2','.mp3','.wav','.ogg']);
const excluded=new Set(['node_modules','.git','source','_template','__pycache__']);
let count=0,total=0;
function copy(file,relative){
 const target=path.join(output,relative);fs.mkdirSync(path.dirname(target),{recursive:true});if(path.extname(file).toLowerCase()==='.html'){
  const html=fs.readFileSync(file,'utf8').replace(/<nav\b[^>]*class="[^"]*\bgame-menu\b[^"]*"[^>]*>[\s\S]*?<\/nav>/g,nav=>nav.replace(/<a\b[^>]*href="[^"]*games\/(?:alibi|bouncer|prior|stake|pixel-pairs|word-forge|gridlock|number-drop|memory-lane|mystery-cabinet|time-drop|clue-ladder|seating-chart|shift-work|codebreak|hidden-gem)\/index\.html"[^>]*>[\s\S]*?<\/a>/g,'').replace(/(<a\b[^>]*href="([^"]*)games\/laser\/index\.html"[^>]*>[\s\S]*?<\/a>)/,(_,link,prefix)=>link+'<a href="'+prefix+'games/time-drop/index.html">Time Drop</a><a href="'+prefix+'games/clue-ladder/index.html">Clue Ladder</a><a href="'+prefix+'games/seating-chart/index.html">Seating Chart</a><a href="'+prefix+'games/shift-work/index.html">Desk Jam</a><a href="'+prefix+'games/codebreak/index.html">Codebreak</a>'));
  // Keep generated static drawer labels aligned with the approved display name.
  let rendered=html.replace(/((?:href="[^"]*)menu-brand\.css)(?:\?[^"]*)?"/g,'$1?v=hub-topbar-20261027-boards-20261108"').replace(/(src="[^"]*(?:navigation|game-config)\.js)(?:\?[^\"]*)?"/g,'$1?v=first-try-20261105"').replace(/(src="[^"]*inner-clock-model\.js)(?:\?[^\"]*)?"/g,'$1?v=no-repeat-20261026"').replace(/<nav\b[^>]*class="[^"]*\bgame-menu\b[^"]*"[^>]*>[\s\S]*?<\/nav>/g,nav=>nav.replace(/(<a\b[^>]*href="[^"]*games\/inner-clock\/index\.html"[^>]*>)[\s\S]*?(<\/a>)/g,(_,open,close)=>open+'Time Sense'+close));
  if(rendered.includes('cloud-saves.js')&&!rendered.includes('codebreak-model.js')){const prefix=rendered.match(/src="([^"]*)cloud-saves\.js/)[1];rendered=rendered.replace(/<script\b(?=[^>]*src="[^"]*cloud-saves\.js)[^>]*><\/script>/,'<script src="'+prefix+'codebreak-model.js?v=zero-pool-20261106"></script>$&');}
  rendered=rendered.replace(/(src="[^"]*codebreak-model\.js)(?:\?[^\"]*)?"/g,'$1?v=zero-pool-20261106"');
  rendered=rendered.replace(/(src="[^"]*seating-chart-model\.js)(?:\?[^\"]*)?"/g,'$1?v=first-try-20261105"');
  rendered=rendered.replace(/(src="[^"]*time-drop-model\.js)(?:\?[^\"]*)?"/g,'$1?v=familiar-20261105"');
  rendered=rendered.replace(/(src="[^"]*profile\.js)(?:\?[^"]*)?"/g,'$1?v=stats-pages-20261106"');
  rendered=rendered.replace(/(src="[^"]*arcade-score\.js)(?:\?[^"]*)?"/g,'$1?v=first-try-20261105"');
  // Add feedback to every public game except Lowball's wrapper (its iframe owns sound).
  if(/^games\/[^/]+\/index\.html$/.test(relative)&&activeGames.has(relative.split('/')[1])&&relative!=='games/lowball/index.html'&&!rendered.includes('game-feel.js')){
   const base=path.posix.relative(path.posix.dirname(relative),'.')+'/';
   rendered=rendered.replace('</head>','<link rel="stylesheet" href="'+base+'game-feel.css?v=settings-20261106"><script src="'+base+'game-feel.js?v=settings-20261106"></script></head>');
  }
  rendered=rendered.replace(/((?:src|href)="[^"]*game-feel\.(?:js|css))(?:\?[^"]*)?"/g,'$1?v=settings-20261106"');
  rendered=rendered.replace(/((?:src|href)="[^"]*(?:pack-model|laser-model|seating-chart-model|shift-work-model|games\/(?:pack\/puzzles|laser\/boards|seating-chart\/(?:puzzles|seating-chart)|shift-work\/boards))\.js)(?:\?[^"]*)?"/g,'$1?v=mirrors-20261109"');
  // Load device preferences before controllers read sound or motion. Account UI is
  // shared across every authenticated header, including dynamically mounted games.
  const uiPrefix=path.posix.relative(path.posix.dirname(relative),'.');const uiBase=uiPrefix?uiPrefix+'/':'';
  rendered=rendered.replace(/<head([^>]*)>/,'<head$1><script src="'+uiBase+'clean-urls.js?v=clean-20261109"></script><script src="'+uiBase+'preferences.js?v=theme-20261106"></script><link rel="stylesheet" href="'+uiBase+'preferences.css?v=settings-20261106">');
  if((/^games\/[^/]+\/index\.html$/.test(relative)&&activeGames.has(relative.split('/')[1]))||relative==='games/lowball/engine/index.html'){
   rendered=rendered.replace(/<head([^>]*)>/,'<head$1><script src="'+uiBase+'membership-policy.js?v=lock-art-auth-20261112"></script><script src="'+uiBase+'membership.js?v=lock-art-auth-20261112"></script><link rel="stylesheet" href="'+uiBase+'membership.css?v=lock-art-auth-20261112">');
  }
  rendered=rendered.replace('</head>','<link rel="stylesheet" href="'+uiBase+'theme.css?v=theme-pairs-20261108"><script defer src="'+uiBase+'theme-toggle.js?v=theme-20261106"></script></head>');
  if(rendered.includes('accounts.js'))rendered=rendered.replace('</head>','<link rel="stylesheet" href="'+uiBase+'account-menu.css?v=leaderboards-20261106"><script defer src="'+uiBase+'account-menu.js?v=clean-urls-20261109"></script></head>');
  if(/^games\/[^/]+\/index\.html$/.test(relative)&&activeGames.has(relative.split('/')[1]))rendered=rendered.replace('<!-- shared-legal-footer:start -->','<p class="game-leaderboard-link"><a href="../../leaderboards.html?game='+relative.split('/')[1]+'">Daily leaderboard →</a></p><!-- shared-legal-footer:start -->');
  rendered=rendered.replace(/(src="[^"\n]*(?:shell|stack-up)\.js)(?:\?[^"\n]*)?"/g,'$1?v=billing-20261111"');
  // Shared achievement UI reads the same native results as Profile; no engine writes change.
  const achievementPage=(/^games\/[^/]+\/index\.html$/.test(relative)&&activeGames.has(relative.split('/')[1]));
  if(achievementPage){
   const prefix=path.posix.relative(path.posix.dirname(relative),'.');const base=prefix?prefix+'/':'';
   const models=['codebreak','pack','laser','inner-clock','time-drop','clue-ladder','seating-chart','shift-work'];
   let additions=rendered.includes('arcade-score.js')?'':'<script src="'+base+'arcade-score.js?v=first-try-20261105"></script>';
   additions+=models.filter(id=>!rendered.includes(id+'-model.js')).map(id=>'<script src="'+base+id+'-model.js"></script>').join('');
   if(!rendered.includes('profile-records.js'))additions+='<script defer src="'+base+'profile-records.js?v=achievements-20261105"></script>';
   additions+='<link rel="stylesheet" href="'+base+'achievements.css?v=immersion-20261105"><script defer src="'+base+'achievements.js?v=immersion-20261105"></script>';
   rendered=rendered.replace('</head>',additions+'</head>');
  }
  rendered=rendered.replace(/(src="[^"]*profile-records\.js)(?:\?[^"]*)?"/g,'$1?v=achievements-20261105"');
  fs.writeFileSync(target,applyBrand(rendered.replace(/(src="[^"]*cloud-saves\.js)(?:\?[^"]*)?"/g,'$1?v=stack-variety-20261105"').replace(/(src="[^"]*hidden-gem-model\.js)(?:\?[^"]*)?"/g,'$1?v=coverage-20261101"').replace(/(src="[^"]*(?:friends|leagues|leagues-model)\.js)(?:\?[^"]*)?"/g,'$1?v=first-try-20261105"').replace(/(src="[^"]*accounts\.js)(?:\?[^"]*)?"/g,'$1?v=account-billing-20261111"'),relative));
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
const engine=path.join(output,'games/lowball/engine/index.html');
let html=fs.readFileSync(engine,'utf8');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;');
for(const [property,relative]of [['og:url','games/lowball/index.html'],['og:image','games/lowball/engine/og-image.png'],['twitter:image','games/lowball/engine/og-image.png']]){
 const pattern=new RegExp('(<meta (?:property|name)="'+property+'" content=")[^"]*(">)');
 html=html.replace(pattern,(_,before,after)=>before+escape(new URL(relative,site).href)+after);
}
fs.writeFileSync(engine,html);
// Metadata is generated from the actual launch roster and configured host.
const cleanPublicURLs=text=>text.replace(/https:\/\/breakroomdaily\.com\/[^\s"<>]*/g,value=>value.replace(/\/index\.html(?=[?#]|$)/,'/').replace(/\.html(?=[?#]|$)/,''));
function decorate(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())decorate(file);else if(e.name.endsWith('.html'))fs.writeFileSync(file,cleanPublicURLs(metadata(fs.readFileSync(file,'utf8'),path.relative(output,file).replaceAll('\\','/'),site,publicMetadata)));}}
decorate(output);
fs.writeFileSync(path.join(output,'sitemap.xml'),cleanPublicURLs(sitemap(site,publicMetadata)));
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(`Built ${count} web files (${(total/1024/1024).toFixed(1)} MiB) in dist/; development docs, tests, templates and source atlases excluded.`);
