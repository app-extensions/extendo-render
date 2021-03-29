try {
  console.log('about to run jupyter ...')
  require('./render')()
    .then(
      () => console.log('done with jupyter ...'),
      error => console.log(error)
    )
} catch (error) {
  console.log('outer error in jupyter')
  console.log(error.stack)
}
