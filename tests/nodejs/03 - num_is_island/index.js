const path = require('path')
const prepareCode = require('../prepareCode')

const input = `4
5
11110
11010
11000
00000
`

const code = prepareCode(path.join(__dirname, './code.js'), input)

module.exports = {
  code,
  input,
  output: `1
`
}
