// Relatively generic wrapper that's invoked as the CMD or ENTRY_POINT of the image. 

// It 
// * loads input.json
// * fetches content if needed 
// * Invokes the user's code
// * writes the result either as output.json or error.json

const fs = require('fs').promises
const { Octokit } = require('@octokit/rest')
const code = require('./code')

const dataDir = '/tmp/extendo-compute'
const inputFile = `${dataDir}/input.json`
const outputFile = `${dataDir}/output.json`
const errorFile = `${dataDir}/error.json`

const loadAndRun = async () => {
  try {
    // Load and shape the request data and content
    const rawData = await fs.readFile(inputFile)
    const data = JSON.parse(rawData.toString())
    data.env = data.env || {}
    data.inputs = data.inputs || {}
    data.inputs.content = await fetchContent(data.inputs.content, process.env.GITHUB_TOKEN)

    // Invoke the renderer and write the result
    const result = await code(data)
    await fs.writeFile(outputFile, JSON.stringify(result))
    process.exit(0)
  } catch (error) {
    console.log(error)
    await fs.writeFile(errorFile, JSON.stringify(error, null, 2))
    process.exit(1)
  }
}

loadAndRun()

async function fetchContent(spec, token) {
  if (typeof spec === 'string') return spec

  const github = new Octokit({ auth: token })
  const { data } = await github.repos.getContent(spec)
  return Buffer.from(data.content, data.encoding).toString('utf8')
}