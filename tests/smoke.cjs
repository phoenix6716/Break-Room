/* Run against the local static server. Requires Playwright and Chromium. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.ARCADE_TEST_URL || 'http://127.0.0.1:8000';
const placeholderIds = ['pixel-pairs', 'word-forge', 'gridlock', 'number-drop', 'memory-lane', 'mystery-cabinet'];
const routes = ['lowball','stack-up','pack','laser','time-drop','clue-ladder','seating-chart','hidden-gem','shift-work','inner-clock'].map(id=>`games/${id}/`);
async function lowballFrame(page) {
  const handle = await page.locator('#lowball-game-frame').elementHandle();
  const frame = await handle.contentFrame();
  await frame.waitForURL(url => url.pathname.endsWith('/engine/index.html'));
  await frame.locator('#cselectBtn').waitFor();
  return frame;
}
let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks++; }
(async () => {
  const browser = await chromium.launch({executablePath: process.env.ARCADE_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox']});
  const errors = [];
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({viewport: {width, height: 900}});
      // This suite checks navigation; dedicated mobile tests cover first-visit help.
      await context.addInitScript(() => localStorage.setItem('pc_help_seen', '1'));
      // Avoid depending on Google Fonts availability for functional checks.
      await context.route('https://fonts.googleapis.com/**', route => route.abort());
      const page = await context.newPage();
      page.setDefaultTimeout(6000);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base, {waitUntil: 'domcontentloaded'});
      check((await page.title()).includes('Break Room'), 'Homepage branding');
      const cards = page.locator('.game-grid .game-card');
      check(await cards.count() === 10, 'Ten active homepage cards');
      check((await page.locator('.section-head p').innerText()).includes('10 DAILY GAMES'), 'Shelf label matches current lineup');
      check((await cards.nth(0).locator('a').getAttribute('href')).includes('laser'), 'Laser first');
      check((await cards.nth(1).locator('a').getAttribute('href')).includes('time-drop'), 'Time Drop second');
      check(await page.locator('.coming-stamp').count() === 0, 'No placeholder cards on the homepage');
      check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Homepage has no horizontal overflow');
      check(await cards.locator('a[href*="/alibi/"],a[href*="/bouncer/"],a[href*="/prior/"],a[href*="/stake/"]').count() === 0, 'Shelved games absent from shelf');
      const leagueLink=page.locator('a[href="leagues.html"]').first();check(await leagueLink.isVisible(),'Homepage exposes weekly leagues');await leagueLink.click();await page.locator('#league-guest').waitFor();check(await page.locator('.league-entry').count()===0,'Guest league page has no fake standings');check(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'League navigation fits the viewport');await page.goto(base);
      for (const route of routes) {
        await page.goto(`${base}/${route}`, {waitUntil: 'domcontentloaded'});
        const wordmark = await page.locator('header .brand').boundingBox();
        check(wordmark.width > 0 && wordmark.x >= 0, `Visible branding: ${route} at ${width}`);
        check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `No overflow: ${route} at ${width}`);
        check(await page.locator('#game-menu a[href*="/alibi/"],#game-menu a[href*="/bouncer/"],#game-menu a[href*="/prior/"],#game-menu a[href*="/stake/"]').count() === 0, 'Shelved games absent from drawer');
        await page.locator('#game-menu-toggle').click();
        await page.locator('#game-menu-close').click();
        check(await page.locator('#game-menu').isHidden(), `Drawer close button: ${route}`);
        check(await page.locator('#game-menu-toggle').evaluate(el => el === document.activeElement), 'Menu restores focus');
        await page.locator('#game-menu-toggle').click();
        await page.keyboard.press('Shift+Tab');
        check(await page.locator('#game-menu a').last().evaluate(el => el === document.activeElement), 'Drawer traps keyboard focus');
        await page.keyboard.press('Escape');
        check(await page.locator('#game-menu').isHidden(), 'Escape dismisses drawer');
        await page.locator('#game-menu-toggle').click();
        await page.locator('.game-menu-backdrop').click({position: {x: width - 2, y: 850}});
        check(await page.locator('#game-menu').isHidden(), 'Outside click dismisses drawer');
        await page.locator('#game-menu-toggle').click();
        await page.locator('#game-menu a').filter({hasText: 'All games'}).click();
        await page.waitForURL('**/index.html#daily-games');
        check(await page.locator('#daily-games').isVisible(), 'Drawer navigation reaches homepage');
        await page.goto(`${base}/${route}`, {waitUntil: 'domcontentloaded'});
        if (route === 'games/lowball/') {
          const frame = page.frameLocator('#lowball-game-frame');
          await frame.locator('#itemName').waitFor();
          check((await frame.locator('#itemName').innerText()) !== 'Loading...', 'Lowball engine loaded');
        }
      }
      console.log(`PASS: homepage, active-game navigation and header branding at ${width}px`);
      await context.close();
    }
    // Gameplay uses isolated browser storage, never the developer's saved runs.
    const context = await browser.newContext({viewport: {width: 390, height: 900}});
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(8000);
    await page.goto(`${base}/games/lowball/`, {waitUntil: 'domcontentloaded'});
    let frame = await lowballFrame(page);
    await frame.locator('#helpModal.show').waitFor();
    await frame.locator('#helpClose').click();
    check(!await frame.locator('#helpModal').evaluate(el => el.classList.contains('show')), 'Lowball first-visit help closes');
    await frame.locator('#cselectBtn').click();
    await frame.locator('#cselectList li').filter({hasText: 'United States'}).click();
    check((await frame.locator('#currencySymbol').innerText()).includes('$'), 'Lowball region currency');
    await frame.locator('#guessInput').fill('0');
    await frame.locator('#submitBtn').click();
    check(!await frame.locator('#resultArea').evaluate(el => el.classList.contains('show')), 'Lowball rejects zero guess');
    for (let round = 0; round < 4; round++) {
      await frame.locator('#guessInput').fill('10');
      await frame.locator('#submitBtn').click();
      check(await frame.locator('#resultArea').evaluate(el => el.classList.contains('show')), 'Lowball round result');
      if (round === 0) {
        await page.reload({waitUntil: 'domcontentloaded'});
        frame = await lowballFrame(page);
        await frame.locator('#resultArea.show').waitFor();
        check(await frame.locator('#resultFacts').innerText().then(t => t.includes('10.00')), 'Lowball resumes submitted guess');
      }
      await frame.locator('#nextBtn').click();
    }
    await frame.locator('#finalScreen.show').waitFor();
    check(Number(await frame.locator('#finalTotal').innerText()) >= 0, 'Lowball final score');
    await page.reload({waitUntil: 'domcontentloaded'});
    frame = await lowballFrame(page);
    await frame.locator('#finalScreen.show').waitFor();
    check(await frame.locator('#playedVal').innerText() === '1', 'Lowball completion persists once');
    await frame.locator('#statsBtn').click();
    await frame.locator('#statsModal').waitFor({state:'visible'});
    await frame.locator('#statsClose').click();
    await frame.locator('#unlimitedModeBtn').click();
    await frame.locator('#guessInput').waitFor({state:'visible'});
    check(!await frame.locator('#lockScreen').evaluate(el=>el.classList.contains('show')), 'Lowball unlimited is free and unlocked');
    console.log('PASS: Lowball region, invalid input, four rounds, resume, saved completion, stats, unlimited state');
    // Retired entries are checked as redirects in retired-games.cjs, never as playable cabinets.
    check(errors.length === 0, `No browser JS errors: ${errors.join('; ')}`);
    await context.close();
    console.log(`PASS: ${checks} assertions; no browser JavaScript errors.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
