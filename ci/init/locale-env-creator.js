const chalk = require('chalk')

const pkgJson = require('../../package.json')

const { ENV_VARS, FILE_OUTPUT_OPTS, PRINT_SKIPED } = require('../constants')

const { join, baseResovle } = require('../paths')
const { HELP_TEXT_COLORHEX } = require('../colors-cnsts')
const fs = require('fs-extra')

function printText(text) {
  if (PRINT_SKIPED) console.log('\x1B[34m%s\x1B[0m', text)
}

module.exports = async function main() {
  return new Promise((resolve) => {
    const envFilenames = ENV_VARS.map((n) => `.env.${n.toLowerCase()}`)

    let successFiles = []
    const _basedir = baseResovle('config')
    for (let j in envFilenames) {
      const filepath = join(_basedir, envFilenames[j])
      if (fs.existsSync(filepath)) {
        printText(
          `\n Skiped create ${envFilenames[j]} , ` +
            chalk.hex(HELP_TEXT_COLORHEX)(
              `the file had been exist at ${_basedir}.\n`
            )
        )
      } else {
        const TPL =
          `# ${envFilenames[j]} variables defined here.\n` +
          `APP_NAME=${pkgJson.name || 'DEMO'}\n` +
          `APP_TITLE="${pkgJson.description || ''}"\n`

        fs.outputFileSync(filepath, TPL, FILE_OUTPUT_OPTS)
        successFiles.push(`create ${envFilenames[j]} at ${_basedir}`)
      }
    }

    return resolve(successFiles)
  })
}
