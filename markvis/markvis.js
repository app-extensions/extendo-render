const vis = require('./node_modules/markvis/dist/render')
const d3node = require('d3-node')

module.exports = async ({ content, context }) => {
  const code = context.resource ? await context.resource() : content
  const html = vis()([{content: code}], 0, null, { d3node })
  return { html }
}
