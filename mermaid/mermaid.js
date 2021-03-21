#!/usr/local/bin/node

const { local } = require('d3-selection')

try {
  console.log('about to run ...')
  require('./render')()
    .then(
      () => console.log('done...'),
      error => console.log(error)
    )
} catch (error) {
  console.log('outer error')
  console.log(error.stack)
}
