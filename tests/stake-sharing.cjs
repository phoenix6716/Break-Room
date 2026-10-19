const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.ARCADE_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ARCADE_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:1000},permissions:['clipboard-read','clipboard-write']});
   await context.route('https://fonts.googleapis.com/**',r=>r.abort());
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`${base}/games/stake/`,{waitUntil:'domcontentloaded'});
   for(let i=0;i<5;i++){
    await page.locator('.chip').first().click();
    const question=page.locator('#app .stake-question');
    const font=await question.evaluate(el=>{const s=getComputedStyle(el);return {family:s.fontFamily,size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight)}});
    assert.ok(!font.family.includes('Pixelify')&&!font.family.includes('Courier'),font.family);
    assert.ok(font.size>=20&&font.line>=font.size*1.4);
    if(i===0)await page.screenshot({path:`/tmp/stake-question-readable-${width}.png`});
    await page.locator('button.opt').first().click();
    assert.ok((await page.locator('#app .stake-question').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Arial'));
    await page.getByRole('button',{name:i===4?'See results':'Next question',exact:true}).click();
   }
   assert.equal(await page.locator('textarea').count(),0);
   assert.ok(!(await page.locator('#app').innerText()).includes('Spoiler-free share text:'));
   const button=page.getByRole('button',{name:'Copy result',exact:true});
   const status=page.locator('#app [role=status]');
   await button.click();await status.filter({hasText:'Copied.'}).waitFor();
   const copied=await page.evaluate(()=>navigator.clipboard.readText());
   assert.match(copied,/^Stake \d{4}-\d{2}-\d{2} /);
   assert.ok(copied.endsWith(`${base}/games/stake/`),copied);
   assert.ok(!copied.includes('example.com'));
   await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:()=>Promise.reject(new Error('Test clipboard fallback'))}));
   await status.evaluate(el=>el.textContent='');await button.click();await status.filter({hasText:'Copied.'}).waitFor();
   assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),copied);
   assert.equal(await page.locator('textarea').count(),0);
   assert.ok(await button.evaluate(el=>el===document.activeElement));
   await page.evaluate(()=>document.execCommand=()=>false);
   await button.click();await status.filter({hasText:"Couldn't copy"}).waitFor();
   assert.equal(await page.locator('textarea').count(),0);
   assert.ok(await button.evaluate(el=>el===document.activeElement));
   await page.screenshot({path:`/tmp/stake-results-clean-${width}.png`});
   assert.deepEqual(errors,[]);
   console.log(`PASS ${width}px: five questions, readable question/review font, no share box, real clipboard contents, clipboard fallback, failure feedback, focus restored.`);
   await context.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
