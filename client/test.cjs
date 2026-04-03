const { chromium } = require('playwright-core');
const os = require('os');
const path = require('path');

const executablePath = os.platform() === 'darwin' 
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : '/usr/bin/google-chrome'; // change if on linux

(async () => {
  try {
    const browser = await chromium.launch({ executablePath });
    const page = await browser.newPage();
    
    page.on('pageerror', err => {
      console.log('PAGE ERROR:', err.message);
      console.log(err.stack);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('CONSOLE ERROR:', msg.text());
      }
    });

    await page.goto('http://localhost:5174/');
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
  } catch (err) {
    console.log('Playwright error:', err);
  }
})();
