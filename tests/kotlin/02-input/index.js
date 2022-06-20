const fs = require('fs')
const path = require('path')
module.exports = {
  code: fs.readFileSync(path.join(__dirname, './input.kt'), 'utf8'),
  input: `10`,
  output: `You entered: 10`
}
