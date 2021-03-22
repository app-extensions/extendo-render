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
  console.log('1 ...')
  try {
    const page = await browser.newPage();
    console.log('3 ...')
    page.setViewport({ ...defaultViewPort, ...inputs.viewPort });
    await page.goto(`file://${path.join(__dirname, './node_modules/@mermaid-js/mermaid-cli', 'index.html')}`);
    page.on('console', consoleObj => console.log(consoleObj.text()))
    console.log('4 ...')
    await page.evaluate(`document.body.style.background = '${inputs.backgroundColor || defaultBackground}'`);
    console.log('5 ...')

    const setup = (container, definition, config) => {
      container.textContent = definition;
      console.log('before Mermaid initialize')
      window.mermaid.initialize(config);
      try {
        console.log('before Mermaid init')
        window.mermaid.init(undefined, container);
        console.log('after Mermaid init')
        return { status: 'success' };
      } catch (error) {
        return { status: 'error', error, message: error.message };
      }
    }
    const config = { ...defaultConfig, ...inputs.config }
    console.log('before $eval 1 ...')
    const result = await page.$eval('#container', setup, definition, config);
    console.log('after $eval 1 ...')
    if (result.status === 'error') throw new Error(result.message);

    // await before returning to be sure we're good before the finally
    console.log('before $eval 2 ...')
    const svg = await page.$eval('#container', container => container.innerHTML)
    return svg
  } finally {
    console.log('closing ...')
    await browser.close();
  }
}

module.exports = async () => {
  try {
    const inputData = await fs.readFile(inputFile)
    console.log(inputData.toString())
    const { content, inputs } = JSON.parse(inputData.toString())
    const svg = await render(content, inputs)
    console.log('back from render ...')
    const response = { html: svg }
    await fs.writeFile(outputFile, JSON.stringify(response))
  } catch (error) {
    console.log(error.message)
    await fs.writeFile(errorFile, JSON.stringify({ error, log }, null, 2))
    process.exit(1)
  }
}
