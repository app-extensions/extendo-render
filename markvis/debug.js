const fs = require('fs')
// const render = require('./dist/index')
const render = require('./index')

const content = `
layout: line
data: [
  { key: 0, value: 5 },
  { key: 1, value: 4 },
  { key: 2, value: 7 },
  { key: 3, value: 2 },
  { key: 4, value: 4 },
  { key: 5, value: 8 },
  { key: 6, value: 3 },
  { key: 7, value: 6 }
]`

const run = async () => {
  const result = await render({ content, context: {} })

  console.log(result)
}
run()

