const path = require('path')
const prepareCode = require('../prepareCode')
const input = `1
2
3  
`

const code = prepareCode(path.join(__dirname, './code.js'), input)

module.exports = {
  code,
  input,
  output: `1
2
3  
`
}
