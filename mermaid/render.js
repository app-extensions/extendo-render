/**
 * Simple script that takes an `input.json` that captures the parameters, options, token, ...
 * for a GitHub rendering request, does the (mermaid) rendering and drops the output in `output.json`
 */

const fs = require('fs').promises;
const path = require('path');

const dataDir = '/tmp/extendo-compute'
const inputFile = `${dataDir}/input.json`
const outputFile = `${dataDir}/output.json`
const errorFile = `${dataDir}/error.json`

const defaultConfig = { theme: 'default' }
const defaultBackground = 'white'
const defaultViewPort = { width: 800, height: 600, deviceScaleFactor: 1 }

const log = []

async function createBrowser(mode) {
  if (mode === 'lambda') {
    const chromium = require('chrome-aws-lambda');
    const params = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true, // chromium.headless,
      ignoreHTTPSErrors: true,
    }
    return chromium.puppeteer.launch(params)
  } else if (mode === 'local') {
    const puppeteer = require('puppeteer')
    return puppeteer.launch({ args: ['--no-sandbox'] })
  }
}

async function render(definition, inputs) {
  const browser = await createBrowser(process.env.MODE || 'local')
  log.push('1 ...')
  try {
    const page = await browser.newPage();
    log.push('3 ...')
    page.setViewport({ ...defaultViewPort, ...inputs.viewPort });
    await page.goto(`file://${path.join(__dirname, './node_modules/@mermaid-js/mermaid-cli', 'index.html')}`);
    log.push('4 ...')
    await page.evaluate(`document.body.style.background = '${inputs.backgroundColor || defaultBackground}'`);
    log.push('5 ...')

    const setup = (container, definition, config) => {
      log.push('in setup ...')
      container.textContent = definition;
      window.mermaid.initialize(config);
      log.push('after initialize ...')
      try {
        window.mermaid.init(undefined, container);
        log.push('after init ...')
        return { status: 'success' };
      } catch (error) {
        log.push('error in setup ...' + error.message)
        return { status: 'error', error, message: error.message };
      }
    }
    const config = { ...defaultConfig, ...inputs.config }
    log.push('before $eval 1 ...')
    const result = await page.$eval('#container', setup, definition, config);
    if (result.status === 'error') throw new Error(result.message);

    // await before returning to be sure we're good before the finally
    log.push('before $eval 2 ...')
    const svg = await page.$eval('#container', container => container.innerHTML)
    return svg
  } finally {
    log.push('closing ...')
    await browser.close();
  }
}

module.exports = async () => {
  try {
    const inputData = await fs.readFile(inputFile)
    log.push(inputData)
    const { content, inputs } = JSON.parse(inputData)
    const svg = await render(content, inputs)
    log.push('back from render ...')
    console.log(svg)
    const response = { html: svg }
    await fs.writeFile(outputFile, JSON.stringify(response))
  } catch (error) {
    log.push(error.message)
    await fs.writeFile(errorFile, JSON.stringify({ error, log }, null, 2))
    process.exit(1)
  }
}
