const fs = require('fs')
const path = require('path')
const prelude = fs.readFileSync(path.join(__dirname, './prelude.js'), 'utf8')

module.exports = (file, input) => {
  const code = `
global[Symbol.for('user_input')] = ${JSON.stringify(input.split(/\r?\n/))};
${prelude};
${fs.readFileSync(file, 'utf8')}
`

  return code
}
