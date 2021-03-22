/**
 * Simple script that takes an `input.json` that captures the parameters, options, token, ...
 * for a GitHub rendering request, does the (mermaid) rendering and drops the output in `output.json`
 */

const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer')

const dataDir = '/tmp/extendo-compute'
const inputFile = `${dataDir}/input.json`
const outputFile = `${dataDir}/output.json`
const errorFile = `${dataDir}/error.json`

const defaultConfig = { theme: 'default' }
const defaultBackground = 'white'
const defaultViewPort = {
  deviceScaleFactor: 1,
  hasTouch: false,
  height: 600,
  isLandscape: true,
  isMobile: false,
  width: 800,
};

const defaultArgs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--disable-web-security',
  '--disk-cache-size=33554432',
  '--hide-scrollbars',
  '--ignore-gpu-blocklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
  '--window-size=1920,1080',
  '--single-process'
];

const log = []

async function render(definition, inputs) {
  const browser = await puppeteer.launch({ args: defaultArgs })
  try {
    const page = await browser.newPage();
    page.setViewport({ ...defaultViewPort, ...inputs.viewPort });
    await page.goto(`file://${path.join(__dirname, './node_modules/@mermaid-js/mermaid-cli', 'index.html')}`);
    page.on('console', consoleObj => console.log(consoleObj.text()))
    await page.evaluate(`document.body.style.background = '${inputs.backgroundColor || defaultBackground}'`);

    const setup = (container, definition, config) => {
      container.textContent = definition;
      window.mermaid.initialize(config);
      try {
        window.mermaid.init(undefined, container);
        return { status: 'success' };
      } catch (error) {
        return { status: 'error', error, message: error.message };
      }
    }
    const config = { ...defaultConfig, ...inputs.config }
    const result = await page.$eval('#container', setup, definition, config);
    if (result.status === 'error') throw new Error(result.message);

    // await before returning to be sure we're good before the finally
    const svg = await page.$eval('#container', container => container.innerHTML)
    return svg
  } finally {
    await browser.close();
  }
}

module.exports = async () => {
  try {
    const inputData = await fs.readFile(inputFile)
    const { content, inputs } = JSON.parse(inputData.toString())
    const svg = await render(content, inputs)
    const response = { html: svg }
    await fs.writeFile(outputFile, JSON.stringify(response))
  } catch (error) {
    await fs.writeFile(errorFile, JSON.stringify({ error, log }, null, 2))
    process.exit(1)
  }
}
