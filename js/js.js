const beautify = require('js-beautify').js

module.exports = async ({ content, context }) => {
  const code = context.resource ? await context.resource() : content
  const output = beautify(code, { indent_size: 2 })
  const html = `<pre><code>${output}</code></pre>`
  return { html }
}
