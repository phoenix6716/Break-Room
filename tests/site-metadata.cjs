/* Search/share URLs follow the configured host without exposing account callbacks. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {siteURL,publicPages,metadata,sitemap}=require('../scripts/site-metadata.cjs');
const registry={window:{}};vm.runInNewContext(fs.readFileSync('game-config.js','utf8'),registry);
const pages=publicPages(registry.window.MIDNIGHT_ARCADE_GAMES);
assert.equal(pages.size,15);assert(![...pages.keys()].some(p=>/hidden-gem|stake|alibi|bouncer|prior/.test(p)));
for(const host of ['https://phoenix6716.github.io/Break-Room/','https://games.example.test/','https://games.example.test/play']){
 const site=siteURL(host),xml=sitemap(site,pages),urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,15);assert.equal(new Set(urls).size,15);
 assert(!xml.includes('account.html'));assert(!xml.includes('engine/'));assert(!xml.includes('2026-'));
 for(const path of pages.keys()){
  const input='<html><head><title>Keep this title</title><meta name="description" content="Old"><meta property="og:url" content="https://old.invalid/"><link rel="canonical" href="https://old.invalid/"></head><body><script>const keep=1;</script></body></html>';
  const output=metadata(input,path,site,pages);
  assert(output.includes('<title>Keep this title</title>'));assert(output.includes('const keep=1;'));assert(!output.includes('old.invalid'));assert(output.includes('content="index,follow"'));
  for(const tag of ['canonical','description','og:title','og:description','og:url','og:image','twitter:card'])assert.equal([...output.matchAll(new RegExp('(?:name|property|rel)="'+tag+'"','g'))].length,1,path+' has one '+tag);
  assert.equal(metadata(output,path,site,pages),output,'Repeatable metadata');assert(output.includes(new URL(path==='index.html'?'./':path,site).href));
 }
 for(const path of ['account.html','login.html','signup.html','auth-callback.html','reset-password.html','forgot-password.html','profile.html','friends.html','leagues.html','game.html','games/hidden-gem/index.html','404.html']){
  const out=metadata('<html><head></head><body></body></html>',path,site,pages);
  assert(out.includes('noindex,follow'));assert(!out.includes('og:url'));assert(!out.includes('rel="canonical"'));if(path==='404.html')assert(out.includes('<base href="'+site.href+'">'));
 }
 const engine=metadata('<html><head></head></html>','games/lowball/engine/index.html',site,pages);
 assert(engine.includes('noindex,follow'));assert(engine.includes(new URL('games/lowball/index.html',site).href));
}
for(const value of ['http://example.test','https://user:secret@example.test','https://example.test/?token=secret','https://example.test/#token','not a URL'])assert.throws(()=>siteURL(value));
const hosting=JSON.parse(fs.readFileSync('wrangler.json','utf8'));
assert.equal(hosting.assets.directory,'./dist');assert.equal(hosting.assets.html_handling,'none');assert.equal(hosting.assets.not_found_handling,'404-page');
assert(!hosting.main&&!hosting.routes&&!hosting.vars&&!hosting.account_id,'Static-only proposal never claims an unverified domain or embeds credentials');
console.log('PASS launch metadata: ten active games, 15 public sitemap URLs, project/custom-domain paths, repeatable canonical/share tags, private/retired noindex, deep 404 base and rejected credential/callback URLs.');
