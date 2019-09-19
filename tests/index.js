const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const assert = require('assert')
const { inspect } = require('util')
const toml = require('toml')

const parseTimeOutput = require('./parseTimeOutput')

const btoa = b => Buffer.from(b).toString('base64')
const atob = a => Buffer.from(a, 'base64').toString('utf8')

const langs = fs
  .readdirSync(__dirname)
  .filter(item => fs.statSync(item).isDirectory() && !/node_modules/.test(item))

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

const parse = result => {
  result = toml.parse(result)

  return {
    compile: result.compile && {
      exitcode: result.compile.exitcode,
      out: atob(result.compile.out),
      error: atob(result.compile.error),
      timing: parseTimeOutput(atob(result.compile.timing))
    },
    run: result.run && {
      exitcode: result.run.exitcode,
      out: atob(result.run.out),
      error: atob(result.run.error),
      timing: parseTimeOutput(atob(result.run.timing))
    }
  }
}

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

      try {
        const { stdout, stderr } = await execute(cmd, {
          // just in case do not leak env
          env: Object.create(null),
          timeout: TEST_TIMEOUT
        })

        assert(!stderr.toString(), 'Should be no stderror')

        const result = parse(stdout.toString())

        console.group(`Result:`)
        console.log(inspect(result, { colors: true }))
        console.assert(
          result.run.out.trim() === test.output.trim(),
          'Trimmed results missmatched'
        )
        console.groupEnd()
      } catch (e) {
        console.error(e)
      }

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
