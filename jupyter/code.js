/**
 * Simple script that takes an `input.json` that captures the parameters, options, token, ...
 * for a GitHub rendering request, does the (mermaid) rendering and drops the output in `output.json`
 */

const fs = require('fs').promises
const childProcess = require('child_process')
const { get } = require('lodash')
const path = require('path').posix

const dataDir = '/tmp/extendo-compute'
const inputNotebookFile = `${dataDir}/input.ipynb`
const outputHTMLFile = `${dataDir}/input.html`

module.exports = async ({ inputs, context, helpers, render }) => {
  return {
    html: `
<p>
  Jupyter Notebook rendering temporarly unavailable due to machine configuration issues likely
  <a href="https://unix.stackexchange.com/questions/253903/creating-threads-fails-with-resource-temporarily-unavailable-with-4-3-kernel">related to thread creation</a>
  when running the container using <pre>runc</pre>. Need someone with more Linux/kernel/container understanding to debug. See 
  <a href="https://github.com/github/extendo-compute-image/blob/main/tools/config.template.json"> the default container runtime configuration</a>. 
  Could also be that we're just running out of memory or some other resource.
</p>
`
  }
  const content = await render.getContent()
  const notebook = JSON.parse(content)
  await fs.writeFile(inputNotebookFile, content)
  inputs = { ...(get(notebook, 'metadata.github.render') || {}), ...(inputs || {}) }
  if (inputs.files) await fetchFiles(helpers.github, context.target, inputs.files)

  const execute = inputs.execute ? '--execute' : ''
  const commandLine = `jupyter nbconvert --to HTML --log-level WARN ${execute} ${inputNotebookFile}`
  const child = childProcess.exec(commandLine)
  await new Promise((resolve, reject) => {
    child.stdout.on('data', data => process.stdout.write(`child-out: ${data}`))
    child.stderr.on('data', data => process.stderr.write(`child-err: ${data}`))
    child.on('error', reject)
    child.on('exit', code => {
      // purposefully reject with a non-Error here so the catch knows to look for an error file
      if (code !== 0) return reject('Exec exited with non-zero code: ' + code)
      resolve()
    })
  })
  const result = await fs.readFile(outputHTMLFile)
  return { html: result.toString() }
}

async function fetchFiles(github, target, files) {
  for (const file of files) {
    const destination = path.join(dataDir, file)
    const source = { ...target, path: path.join(path.dirname(target.path), file) }
    await fetchFile(github, source, destination)
  }
}

async function fetchFile(github, source, destination) {
  const { data } = await github.repos.getContent(source)
  const content = Buffer.from(data.content, data.encoding).toString('utf8')
  await fs.writeFile(destination, content)
  return content
}
