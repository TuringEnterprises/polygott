const fs = require('fs')
const path = require('path')
module.exports = {
  code: fs.readFileSync(path.join(__dirname, './hello.php'), 'utf8'),
  input: ``,
  output: `hello
`
}
