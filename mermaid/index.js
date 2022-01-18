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
    if (!params.render.content) throw new Error(`params.render.content not set. Nothing to do`)
    const octoArgs = process.env.GITHUB_TOKEN ? { auth: process.env.GITHUB_TOKEN } : {}
    params.helpers = { octokit: new Octokit(octoArgs) }
    // Grab a proper reference to the getContent spec as we're about to overwrite it but want the original value later.
    const getContentSpec = params.render.getContent
    params.render.getContent = () => { return fetchContent(getContentSpec, params.helpers.octokit) }

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

// Interpret the supplied spce to get and return the content to render
async function fetchContent(spec, octokit) {
  if (spec.type === 'function') return spec.value
  if (spec.type === 'github') {
    const { data } = await octokit.repos.getContent(spec.defaults)
    return Buffer.from(data.content, data.encoding).toString('utf8')
  }
}