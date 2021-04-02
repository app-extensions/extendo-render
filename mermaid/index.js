// Generic wrapper that 
// * loads input.json, 
// * fetches target content if needed, 
// * sets up a lightweight context with octokit
// * calls the renderer
// * writes the result either as output.json or error.json

const fs = require('fs').promises
const { Octokit } = require('@octokit/rest')
const render = require('./render')

const dataDir = '/tmp/extendo-compute'
const inputFile = `${dataDir}/input.json`
const outputFile = `${dataDir}/output.json`
const errorFile = `${dataDir}/error.json`

const loadAndRun = async () => {
  try {
    const inputData = await fs.readFile(inputFile)
    const { inputs, context, content } = JSON.parse(inputData.toString())
    context.github = new Octokit({ auth: process.env.GITHUB_TOKEN })
    const source = content || await fetchContent(context.github, context.target)
    const result = await render({ content: source, context, inputs })
    await fs.writeFile(outputFile, JSON.stringify(result))
    process.exit(0)
  } catch (error) {
    console.log(error)
    await fs.writeFile(errorFile, JSON.stringify(error, null, 2))
    process.exit(1)
  }
}

loadAndRun()

async function fetchContent(octokit, target) {
  const { data } = await octokit.repos.getContent(target)
  return Buffer.from(data.content, data.encoding).toString('utf8')
}