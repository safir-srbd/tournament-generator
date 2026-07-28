const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  await page.goto('http://localhost:8080');
  
  // Select Knockout tournament
  await page.click('[data-type="knockout"]');
  
  // Enter tournament name
  await page.fill('#tournamentName', 'Test Knockout Tournament');
  
  // Add some players
  const players = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6', 'Player 7', 'Player 8'];
  for (const player of players) {
    await page.fill('#playerName', player);
    await page.click('#addPlayerBtn');
    await page.waitForTimeout(100);
  }
  
  // Start tournament
  await page.click('#startBtn');
  await page.waitForTimeout(500);
  
  // Take screenshot of bracket
  await page.screenshot({ path: 'bracket-screenshot.png' });
  console.log('Screenshot saved to bracket-screenshot.png');
  
  await browser.close();
})();
