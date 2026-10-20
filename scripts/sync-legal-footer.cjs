/* One shared footer, emitted as static HTML so every link works without JavaScript. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function footer(prefix=''){
 return `<!-- shared-legal-footer:start -->\n<footer class="br-site-footer"><div class="br-footer-inner"><p class="br-footer-note">BREAK ROOM · A LITTLE BREAK. A FEW GOOD GAMES.</p><nav class="br-footer-nav" aria-label="Footer"><a href="${prefix}index.html">All games</a><a href="${prefix}privacy.html">Privacy</a><a href="${prefix}terms.html">Terms</a><a href="${prefix}contact.html">Contact &amp; data help</a></nav></div></footer>\n<!-- shared-legal-footer:end -->`;
}
function pages(){return [...fs.readdirSync(root).filter(f=>f.endsWith('.html')),...fs.readdirSync(path.join(root,'games'),{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(root,'games',e.name,'index.html'))).map(e=>'games/'+e.name+'/index.html')];}
function expected(file){const prefix=file.startsWith('games/')?'../../':'',source=fs.readFileSync(path.join(root,file),'utf8');let s=source.replace(/<!-- shared-legal-footer:start -->[\s\S]*?<!-- shared-legal-footer:end -->\s*/g,'').replace(/<footer\b[^>]*>[\s\S]*?<\/footer>\s*/g,'');
 if(!s.includes(`href="${prefix}legal.css"`))s=s.replace('</head>',`<link rel="stylesheet" href="${prefix}legal.css"></head>`);
 // Preserve the homepage footer inside its existing frame; other pages end after all game controls.
 if(file==='index.html')s=s.replace(/<\/div>\s*<\/body>/,footer(prefix)+'</div></body>');else s=s.replace('</body>',footer(prefix)+'\n</body>');
 return s;
}
if(require.main===module){let changed=0;for(const file of pages()){const source=fs.readFileSync(path.join(root,file),'utf8'),next=expected(file);if(source===next)continue;changed++;if(!process.argv.includes('--check'))fs.writeFileSync(path.join(root,file),next);}if(changed&&process.argv.includes('--check')){console.error(changed+' pages differ from the shared footer. Run npm run legal:sync.');process.exitCode=1;}else console.log(changed+' footer pages '+(process.argv.includes('--check')?'out of date.':'updated.'));}
module.exports={footer,pages,expected};
