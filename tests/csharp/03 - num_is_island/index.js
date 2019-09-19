const fs = require('fs')
const path = require('path')
module.exports = {
  code: fs.readFileSync(path.join(__dirname, './code.cs'), 'utf8'),
  input: `4
5
11110
11010
11000
00000`,
  output: `1
`
}
