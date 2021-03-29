/**
 * Simple script that takes an `input.json` that captures the parameters, options, token, ...
 * for a GitHub rendering request, does the (mermaid) rendering and drops the output in `output.json`
 */

const fs = require('fs').promises
const childProcess = require('child_process')
const got = require('got')
const { get } = require('lodash')
const path = require('path').posix

const dataDir = '/tmp/extendo-compute'
const inputFile = `${dataDir}/input.json`
const inputNotebookFile = `${dataDir}/input.ipynb`
const outputHTMLFile = `${dataDir}/input.html`
const outputFile = `${dataDir}/output.json`
const errorFile = `${dataDir}/error.json`

async function render(url, inputs) {
  const source = await fetchFile(url, inputNotebookFile)
  const notebook = JSON.parse(source)
  inputs = { ...(get(notebook, 'metadata.github.render') || {}), ...(inputs || {}) }
  if (inputs.files) await fetchFiles(url, inputs.files)

  const execute = inputs.execute ? '--execute' : ''
  const commandLine = `jupyter nbconvert --to HTML --log-level WARN ${execute} ${inputNotebookFile}`
  const child = childProcess.exec(commandLine)
  await new Promise((resolve, reject) => {
    child.stdout.on('data', data => process.stdout.write(`child-out: ${data}`))
    child.stderr.on('data', data => process.stderr.write(`child-err: ${data}`))
    child.on('error', error => reject(error))
    child.on('exit', code => {
      // purposefully reject with a non-Error here so the catch knows to look for an error file
      if (code !== 0) return reject('Exec exited with non-zero code: ' + code)
      resolve()
    })
  })
  const result = await fs.readFile(outputHTMLFile)
  return result.toString()
}

async function fetchFiles(base, files) {
  for (const file of files) {
    const url = new URL(file, base).toString()
    const destination = path.join(dataDir, file)
    await(fetchFile(url, destination))
  }
}

async function fetchFile(url, name) {
  const token = process.env.GITHUB_TOKEN
  const options = token ? { headers: { token } } : {}
  const response = await got(url, options)
  const content = response.body
  await fs.writeFile(name, content)
  return content
}

module.exports = async () => {
  try {
    console.log('reading input')
    const inputData = await fs.readFile(inputFile)
    console.log('got input')
    const { content, inputs } = JSON.parse(inputData.toString())
    const html = await render(content, inputs)
    const response = { html }
    await fs.writeFile(outputFile, JSON.stringify(response))
  } catch (error) {
    console.log(error)
    await fs.writeFile(errorFile, JSON.stringify(error, null, 2))
    process.exit(1)
  }
}
