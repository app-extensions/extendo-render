const fs = require('fs')
const render = require('./js')

const run = async () => {
  const content = fs.readFileSync('./dist/index.js').toString()
  const result = await render({ content })
  
  console.log(result)
}
run()