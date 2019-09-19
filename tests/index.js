const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const assert = require('assert')

const btoa = b => Buffer.from(b).toString('base64')

const langs = fs
  .readdirSync(__dirname)
  .filter(item => fs.statSync(item).isDirectory())

const tests = langs.map(lang => {
  const tests = fs
    .readdirSync(path.join(__dirname, lang))
    .map(name => path.join(__dirname, lang, name))
    .filter(dir => fs.statSync(dir).isDirectory())
    .map(name => ({
      name: path.basename(name),
      ...require(name)
    }))

  return {
    lang,
    tests
  }
})

const IMAGE = 'polygott-turing'
const TEST_TIMEOUT = 20 * 1000

const command = (
  lang,
  { input = '', code }
) => `docker run --rm -i ${IMAGE} run-task -l ${lang} -c "${btoa(
  code
)}" -i "${btoa(input)}"
`

const execute = (...args) =>
  new Promise((resolve, reject) => {
    exec(...args, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })

async function run(tests) {
  for (const { lang, tests: toRun } of tests) {
    console.group(lang)

    for (const test of toRun) {
      console.group(`${'-'.repeat(process.stdout.columns - 2)}\n${test.name}`)
      const cmd = command(lang, test)

      console.group(`Executing code: \n`)
      console.log(test.code, '\n')
      console.groupEnd()
      if (test.input) {
        console.group(`Running over:`)
        console.log(test.input)
        console.groupEnd()
      }
      console.group(`Expecting:`)
      console.log(test.output)
      console.groupEnd()

      const { stdout, stderr } = await execute(cmd, {
        // just in case do not leak env
        env: Object.create(null),
        timeout: TEST_TIMEOUT
      })

      console.group(`Result:`)
      // we need to restructure output so we can parse it and make assertions
      console.log(stdout)
      console.error(stderr)
      console.groupEnd()
      console.groupEnd()
    }

    console.groupEnd()
    console.log('='.repeat(process.stdout.columns))
  }
}

run(tests).then(
  () => console.log('Tests completed'),
  e => console.error(`Unable to complete tests`, e)
)
