// node
const mathjax = require('mathjax')

module.exports = async ({ content, options = {} }) => {
  const MathJax = await mathjax.init({
    loader: { load: ['input/tex', 'output/chtml'] },
    // tex: {
    //   inlineMath: [['$', '$'], ['\\(', '\\)']],
    //   displayMath: [['$$', '$$'], ['\\[', '\\]']]
    // },
    chtml: { fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2' }
  })
  const display = content.startsWith('$$') || content.startsWith('\\[')
  const trimmed = trimContent(content)
  const output = MathJax.tex2chtml(trimmed, { display })
  const adaptor = MathJax.startup.adaptor
  const html = adaptor.outerHTML(output)
  const styles = adaptor.textContent(MathJax.chtmlStylesheet())
  return { html, styles }
}

function trimContent(content) {
  if (content.startsWith('$$') || content.startsWith('\\(') || content.startsWith('\\[')) return content.slice(2, -2)
  if (content.startsWith('$')) return content.slice(1, -1)
  return content
}
