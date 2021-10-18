// Relatively generic wrapper that's invoked as the CMD or ENTRY_POINT of the image. 

// * load input.json
// * fetch content if needed 
// * Invoke the user's code
// * write the result either as output.json or error.json

const fs = require('fs').promises
const { Octokit } = require('@octokit/rest')
const code = require('./code')

const dataDir = '/tmp/extendo-compute'
const inputFile = `${dataDir}/input.json`
const outputFile = `${dataDir}/output.json`
const errorFile = `${dataDir}/error.json`

const loadAndRun = async () => {
  try {
    // Load and shape the request params and content
    const rawParams = await fs.readFile(inputFile)
    const params = JSON.parse(rawParams.toString())
    params.api = { github: new Octokit({ auth: process.env.GITHUB_TOKEN }) }
    params.env = params.env || {}
    params.inputs = params.inputs || {}
    params.inputs.content = await fetchContent(params.inputs.content, params.api.github)

    // Invoke the code and write the result
    const result = await code(params)
    await fs.writeFile(outputFile, JSON.stringify(result))
    process.exit(0)
  } catch (error) {
    console.log(error)
    await fs.writeFile(errorFile, JSON.stringify(error, null, 2))
    process.exit(1)
  }
}

loadAndRun()

async function fetchContent(spec, github) {
  if (typeof spec === 'string') return spec

  const { data } = await github.repos.getContent(spec)
  return Buffer.from(data.content, data.encoding).toString('utf8')
}