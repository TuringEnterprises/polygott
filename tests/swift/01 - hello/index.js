const fs = require('fs')
const path = require('path')
module.exports = {
  code: fs.readFileSync(path.join(__dirname, './code.swift'), 'utf8'),
  input: 'Hello',
  output: `Hello World!`
}