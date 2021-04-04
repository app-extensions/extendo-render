() => {
  const script = `
  async function _load() {
    const url = location.href + '?raw=true'
    const response = await fetch(url, { mode:"cors"})
    if (!response.ok) return
    const content = await response.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(content), { type: "array" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const result = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    return result
  }

  const run = async () => {
    const json = await _load()
    const mountPoint = document.getElementById('xlsx-render')
    const cdg = canvasDatagrid({
      parentNode: mountPoint
    })
    cdg.style.height = '100%'
    cdg.style.width = '100%'

    mountPoint.style.display = "block"

    // pad headers
    var L = 0
    json.forEach(function (r) { if (L < r.length) L = r.length })
    for (var i = json[0].length; i < L; ++i) {
      json[0][i] = ""
    }

    cdg.data = json
  }
  run()
`
const html = '<div id="xlsx-render"></div>'
const scripts = [
    { url: 'https://unpkg.com/xlsx/dist/xlsx.full.min.js' },
    { url: 'https://unpkg.com/canvas-datagrid/dist/canvas-datagrid.js' },
    script
  ]

  return { html, scripts }
}
