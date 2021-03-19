#!/usr/bin/node

/**
 * Simple script that takes an `input.json` that captures the parameters, options, token, ...
 * for a GitHub rendering request, does the (mermaid) rendering and drops the output in `output.json`
 */

const fs = require('fs').promises
const child_process = require('child_process')

const inputFile = '/tmp/input.json'
const contentMmd = '/tmp/content.mmd'
const contentSvg = '/tmp/content.svg'
const outputFile = '/tmp/output.json'

try {
  const inputData = await fs.readFile(inputFile)
  const { content } = JSON.parse(inputData)
  await fs.writeFile(contentMmd, content)
  const child = child_process.exec(`./node_modules/.bin/mmdc -i ${contentMmd} -o ${contentSvg}`)
  const result = new Promise((resolve, reject) => {
    child.on('error', err => reject(err))
    child.on('exit', async code => {
      if (code !== 0) reject(new Error('exit code ' + code))
      const output = await fs.readFile(outputFile)
      resolve(output)
    })
  })
  const svg = await fs.readFile(contentSvg)
  const result = { html: svg }
  await fs.writeFile(outputFile, JSON.stringify(result))
} catch (error) {
  await fs.writeFile(outputFile, JSON.stringify({ error }, null, 2))
  process.exit(1)
}
