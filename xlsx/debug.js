const fs = require('fs')
const xlsx = require('xlsx')

const run = async () => {
  const workbook = xlsx.readFile('./test.xlsx')
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const result = xlsx.utils.sheet_to_json(sheet, { header: 1 })
  console.log(result)
}
run()