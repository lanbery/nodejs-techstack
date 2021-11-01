#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const { capitalize } = require('lodash')

const { R } = require('../paths')
const npmArgv = process.env.npm_config_argv

const originalArgvs = npmArgv
  ? JSON.parse(process.env.npm_config_argv).original
  : process.argv
const CMD_COLOR_HEX = '#9400D3'
const PATH_REGEX = /^.*\.(?:js|jsx|ts|tsx)$/

main()

function main() {
  try {
    const config = parseArgvFromCmd()

    const readArr = readAndParseText(config.filePath)
    if (readArr && readArr.length > 0) {
      writeOutFile(readArr, config)

      console.log(successMsg(config))
    }
  } catch (err) {
    console.log(err.message)
  }
}

function successMsg(config) {
  const { fileName, outFile } = config

  let msgTitle = `✨✨✨  pickup ids from  [${fileName}] success!  ✨✨✨\n`
  let msg = chalk.greenBright(msgTitle) + chalk.blue(`    Into ${outFile}.\n`)

  return msg
}

function writeOutFile(contentObj, config) {
  const { oriFile, outFile, outVariablesName, outFuncName } = config
  fs.ensureFileSync(outFile)
  let TPL =
    `/* eslint-disable */\n/* Pickup from ${oriFile} */\n` +
    `export const ${outVariablesName} = ` +
    JSON.stringify(contentObj) +
    ';\n'
  let FUNC_TPL =
    `export const check${outFuncName}Id = (id) => {\n` +
    "  let _key = id.startsWith('brave-') ? id : `brave-${id.toLowerCase()}`;" +
    `  return ${outVariablesName}.find((i) => i === _key);\n` +
    '};\n'

  fs.outputFileSync(outFile, TPL + FUNC_TPL, { encoding: 'utf-8' })

  return outFile
}

function parseArgvFromCmd() {
  const ARGV_FILE_KEY = '-f'
  const ARGV_OUT_FILE_KEY = '-o'

  let config = {
    oriFile: '',
    filePath: '',
    fileName: '',
    outVariablesName: '',
    outFuncName: '',
    outFile: '',
  }

  let errMsg = ''
  let idx = originalArgvs.findIndex((argv) => argv === ARGV_FILE_KEY)
  if (idx < 0) {
    errMsg =
      '❌ ' + chalk.redBright('file argument required.\n') + helpComment()
    throw new Error(errMsg)
  }

  let _file = ''
  if (
    idx < originalArgvs.length - 1 &&
    new RegExp(PATH_REGEX, 'i').test(originalArgvs[idx + 1])
  ) {
    validInFile(R(originalArgvs[idx + 1]))
    _file = originalArgvs[idx + 1]
  }

  if (!_file) {
    errMsg =
      '❌ ' + chalk.redBright('file argument required.\n') + helpComment()
    throw new Error(errMsg)
  }

  const { dir, name } = path.parse(_file)

  config.fileName = name
  config.oriFile = _file
  config.filePath = R(_file)
  config.outVariablesName = transVaribleName(name)
  config.outFuncName = transFuncName(name)
  config.outFile = R(dir, `${name}-consts.js`)

  let oidx = originalArgvs.findIndex((argv) => argv === ARGV_OUT_FILE_KEY)
  if (oidx > 0 && oidx < originalArgvs.length - 1) {
    if (!/^.+\.js$/.test(originalArgvs[oidx + 1])) {
      let msg =
        '❌ ' +
        chalk.redBright(`Out File [${originalArgvs[oidx + 1]}] incorrect. `)
      throw new Error(msg)
    }

    let _outFile = path.isAbsolute(originalArgvs[oidx + 1])
      ? originalArgvs[oidx + 1]
      : R(originalArgvs[oidx + 1])
    config.outFile = _outFile
  }

  let force = originalArgvs.find((argv) => argv === '--force')

  if (!force) validOutFile(config.outFile)

  return config
}

function transVaribleName(name) {
  let ns = name
    .split(/(\-|\_|\.)/)
    .filter(
      (it) =>
        it !== '-' && it !== '_' && it !== '.' && it.toLowerCase() !== 'min'
    )
  return ns
    .map((n) => n.toUpperCase())
    .concat(['IDS'])
    .join('_')
}
function transFuncName(name) {
  let ns = name
    .split(/(\-|\_|\.)/)
    .filter(
      (it) =>
        it !== '-' && it !== '_' && it !== '.' && it.toLowerCase() !== 'min'
    )
  return ns.map((n) => capitalize(n)).join('')
}
function validInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    let msg = '❌ ' + chalk.redBright(`File [${filePath}] unfound. `)
    throw new Error(msg)
  }
}

function validOutFile(filePath) {
  if (fs.existsSync(filePath)) {
    let msg = '❌ ' + chalk.redBright(`File [${filePath}] has exists. `)
    throw new Error(msg)
  }
}

function readAndParseText(filePath) {
  const inFilePath = R(filePath)

  validInFile(filePath)

  const text = fs.readFileSync(inFilePath, { encoding: 'utf8' })

  let matches = text.match(/<symbol [^>]+?>([^$]+?)<\/symbol>/g)

  matches = matches
    .map((it) => it.match(/(?<=id=\")[^\"]*/g))
    .map((it) => (typeof it === 'object' ? it[0] : it))

  return matches
}

function helpComment() {
  let comments = '\n'
  comments += chalk.bold.hex(CMD_COLOR_HEX)(
    '\t- The entry file path is required.\n\tlike : [src/xxx/xxx.js]\n'
  )

  comments +=
    chalk.greenBright('\t☞☞') +
    chalk.greenBright(`\t✔ `) +
    chalk.hex(CMD_COLOR_HEX)(`Use command like: -f \'<your file path>\'\n`)

  comments +=
    chalk.bold.hex(CMD_COLOR_HEX)(
      '\t- The out file is optional.\n\tlike : [xxx.js]\n'
    ) +
    chalk.greenBright('\t☞☞') +
    chalk.greenBright(`\t✔ `) +
    chalk.hex(CMD_COLOR_HEX)(`Use command like: -o \'<your out filename>\'\n`)

  comments +=
    chalk.bold.hex(CMD_COLOR_HEX)('\t- Force override output file.\n') +
    chalk.greenBright('\t☞☞') +
    chalk.greenBright(`\t✔ `) +
    chalk.hex(CMD_COLOR_HEX)(`Use command like: --force\n`)

  return comments
}
