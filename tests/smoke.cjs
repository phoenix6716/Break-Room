/* Run against the local static server. Requires Playwright and Chromium. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.ARCADE_TEST_URL || 'http://127.0.0.1:8000';
const placeholderIds = ['pixel-pairs', 'word-forge', 'gridlock', 'number-drop', 'memory-lane', 'mystery-cabinet'];
const routes = ['game.html', ...['lowball', 'stake', 'stack-up', ...placeholderIds].map(id => `games/${id}/`)];
async function lowballFrame(page) {
  const handle = await page.locator('#lowball-game-frame').elementHandle();
  const frame = await handle.contentFrame();
  await frame.waitForURL('**/engine/index.html');
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
      // Avoid depending on Google Fonts availability for functional checks.
      await context.route('https://fonts.googleapis.com/**', route => route.abort());
      const page = await context.newPage();
      page.setDefaultTimeout(6000);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base, {waitUntil: 'domcontentloaded'});
      check((await page.title()).includes('Break Room'), 'Homepage branding');
      const cards = page.locator('.game-grid .game-card');
      check(await cards.count() === 9, 'Nine homepage cards including Stack Up');
      check((await cards.nth(0).locator('a').getAttribute('href')).includes('lowball'), 'Lowball first');
      check((await cards.nth(1).locator('a').getAttribute('href')).includes('stake'), 'Stake second');
      check(await page.locator('.coming-stamp').count() === 6, 'Six coming soon artworks');
      check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Homepage has no horizontal overflow');
      for (const route of routes) {
        await page.goto(`${base}/${route}`, {waitUntil: 'domcontentloaded'});
        const wordmark = await page.locator('header .brand').boundingBox();
        check(wordmark.width > 0 && wordmark.x >= 0, `Visible branding: ${route} at ${width}`);
        check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `No overflow: ${route} at ${width}`);
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
        if (placeholderIds.some(id => route.includes(id)) || route === 'game.html') {
          check(await page.locator('#start-game').isDisabled(), 'Placeholder start disabled');
          check(await page.locator('#attempt-status').innerText() === 'COMING SOON', 'Placeholder says coming soon');
          check(await page.locator('#game-ready').isVisible(), 'Template ready layout retained');
          check(await page.locator('#game-playing').isHidden(), 'Placeholder does not play');
          if (route !== 'game.html') {
            await page.locator('#help-popup-open').click();
            check(await page.locator('#help-popup').isVisible(), 'Template help opens');
            await page.keyboard.press('Escape');
            await page.locator('#stats-popup-open').click();
            check(await page.locator('#stats-popup').isVisible(), 'Template stats opens');
            await page.keyboard.press('Escape');
          }
        }
        if (route === 'games/lowball/') {
          const frame = page.frameLocator('#lowball-game-frame');
          await frame.locator('#itemName').waitFor();
          check((await frame.locator('#itemName').innerText()) !== 'Loading...', 'Lowball engine loaded');
        }
      }
      console.log(`PASS: homepage, navigation, templates, and header branding at ${width}px`);
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
    await page.goto(`${base}/games/stake/`, {waitUntil: 'domcontentloaded'});
    for (let question = 0; question < 5; question++) {
      await page.locator('.chip').first().click();
      if (question === 0) {
        await page.reload({waitUntil: 'domcontentloaded'});
        check(await page.locator('button.opt').count() === 3, 'Stake resumes bet');
      }
      await page.locator('button.opt').first().click();
      check(await page.locator('.banner').isVisible(), 'Stake answer feedback');
      await page.getByRole('button', {name: question === 4 ? 'See results' : 'Next question', exact: true}).click();
    }
    check((await page.locator('#app').innerText()).includes('Today’s set is done'), 'Stake five-question completion');
    await page.reload({waitUntil: 'domcontentloaded'});
    check((await page.locator('#app').innerText()).includes('Today’s set is done'), 'Stake completion persists');
    check(await page.locator('#stake-played').innerText() === '1', 'Stake counts one run');
    await page.locator('#stats-popup-open').click();
    check(await page.locator('#stat-played').innerText() === '1', 'Stake stats reflect saved result');
    await page.keyboard.press('Escape');
    await page.getByRole('tab', {name:'Unlimited', exact:true}).click();
    await page.locator('.chip').first().click();
    await page.locator('button.opt').first().click();
    check(await page.locator('.banner').isVisible(), 'Stake unlimited answer');
    check(await page.locator('#stake-played').innerText() === '1', 'Unlimited does not add a daily run');
    console.log('PASS: Stake betting, resume, five questions, saved completion, stats, unlimited');
    check(errors.length === 0, `No browser JS errors: ${errors.join('; ')}`);
    await context.close();
    console.log(`PASS: ${checks} assertions; no browser JavaScript errors.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
