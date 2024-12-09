const fs = require('fs')
const path = require('path')
module.exports = {
  code: fs.readFileSync(path.join(__dirname, './code.go'), 'utf8'),
  input: '',
  output: `Hello World!`
}