const fs = require('fs')
const path = require('path')

module.exports = {
  code: fs.readFileSync(path.join(__dirname, './count.java'), 'utf8'),
  input: `1
2
3`,
  output: `1
2
3`
}
