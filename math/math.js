const { mathjax } = require('mathjax-full/js/mathjax.js')
const { TeX } = require('mathjax-full/js/input/tex.js')
const { CHTML } = require('mathjax-full/js/output/chtml.js')
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js')
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js')
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js')

module.exports = async ({ render }) => {
  const content = await render.getContent({}, 'utf8')
  const adaptor = liteAdaptor()
  RegisterHTMLHandler(adaptor)
  const tex = new TeX({});
  const chtml = new CHTML({ fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2' })
  const htmlConverter = mathjax.document('', { InputJax: tex, OutputJax: chtml })

  const display = content.startsWith('$$') || content.startsWith('\\[')
  const trimmed = trimContent(content)

  const output = htmlConverter.convert(trimmed, { display })
  const html = adaptor.outerHTML(output)
  const styles = adaptor.textContent(chtml.styleSheet(htmlConverter))
  return { html, styles }
}

function trimContent(content) {
  if (content.startsWith('$$') || content.startsWith('\\(') || content.startsWith('\\[')) return content.slice(2, -2)
  if (content.startsWith('$')) return content.slice(1, -1)
  return content
}
