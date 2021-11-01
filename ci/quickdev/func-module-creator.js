#!/usr/bin/env node

/**
 * node >= 12
 */
const chalk = require('chalk')
const fs = require('fs-extra')
const dayjs = require('dayjs')

const {
  ERROR_TEXT_COLORHEX,
  SUCCESS_TEXT_COLORHEX,
  HELP_TEXT_COLORHEX,
  PREFIX_COLORHEX,
} = require('../colors-cnsts')

const {
  getViewBasePath,
  getModPathVal,
  getModNameVal,
  showHelp,
  validModPath,
  pickFileName,
  pickFuncName,
  pickCssPreffixName,
  getCmdBooleanArgv,
  pickSassFileName,
} = require('./utils')

const {
  CMD_HELP_KEYS,
  CMD_VIEW_BASE_KEYS,
  CDM_VIEW_FORCE_FULLPATH,
  CDM_VIEW_OVERRIDE_KEYS,
  CMD_MOD_NAME_KEYS,
  CMD_MOD_PATH_KEYS,
  CDM_VIEW_NOSASS_KEYS,
  FILE_OUTPUT_OPTS,
} = require('./quick-helper')

const { R, join, src } = require('../paths')

main()
  .then((resp) => {
    console.log(
      '\x1B[32m%s\x1B[0m',
      chalk.hex(SUCCESS_TEXT_COLORHEX)('✨✨✨ congratulate! ✨✨✨\n') +
        resp +
        '\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n'
    )
  })
  .catch((err) => {
    console.log(err)
    if (typeof err === 'object' && err instanceof Error) {
      console.log(
        '\x1B[31m%s\x1B[0m',
        chalk.hex(ERROR_TEXT_COLORHEX).bold('❌ Error: \n') +
          chalk.hex(ERROR_TEXT_COLORHEX)(err.message)
      )
    } else {
      console.log(
        '\x1B[31m%s\x1B[0m',
        'Error: ' + err ? err.toString() : 'generate function module fail.'
      )
    }
  })

async function main() {
  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv

  showHelp(originalArgvs, comboDoc())

  return new Promise((resolve, reject) => {
    try {
      const params = parseParamsFromArgvs(originalArgvs)

      checkFileExist(params)

      let successMsgs = []

      const indexResp = writeModuleIndex(params)
      successMsgs.push(indexResp)

      const funcResp = writeModuleFunc(params)
      successMsgs.push(funcResp)

      const sassResp = writeModuleSass(params)
      successMsgs.push(sassResp)

      successMsgs = successMsgs.filter(Boolean)

      console.log('\x1B[35m%s\x1B[0m', params)

      let _msg = 'generate module success.\n'
      for (let i = 0; i < successMsgs.length; i++) {
        _msg += `\t${successMsgs[i]}\n`
      }

      return resolve(chalk.hex(SUCCESS_TEXT_COLORHEX)(_msg))
    } catch (err) {
      if (err instanceof Error) reject(err)

      throw new Error(err.toString())
    }
  })
}

function checkFileExist(params) {
  const {
    modBaseDir,
    indexFileName,
    oriModPath,
    funcFileName,
    sassFileName,
    override,
    noSass,
  } = params

  let msg = ''

  if (!override && fs.existsSync(modBaseDir, `${indexFileName}.js`)) {
    msg = `${indexFileName}.js has been exist in ${oriModPath}.`
    throw new Error(msg)
  }

  if (!override && fs.existsSync(modBaseDir, `${funcFileName}.jsx`)) {
    msg = `${funcFileName}.jsx has been exist in ${oriModPath}.`
    throw new Error(msg)
  }

  if (!noSass && !override && fs.existsSync(modBaseDir, `${sassFileName}.js`)) {
    msg = `${sassFileName}.js has been exist in ${oriModPath}.`
    throw new Error(msg)
  }
  const rootDir = R(src, modBaseDir)
  if (!fs.existsSync(rootDir)) {
    fs.ensureDirSync(rootDir)
  }

  return rootDir
}

function writeModuleIndex(params) {
  const {
    C_CURR_TS,
    modBaseDir,
    indexFileName,
    funcName,
    oriModPath,
    funcFileName,
  } = params
  let TPL =
    '/**\n' +
    ` * ${C_CURR_TS} \n` +
    ` * This file is the module ${oriModPath} entry.\n` +
    ` */\n\n`

  TPL += `export { default as ${funcName} } from './${funcFileName}';\n`
  fs.outputFileSync(
    R(src, modBaseDir, `${indexFileName}.js`),
    TPL,
    FILE_OUTPUT_OPTS
  )

  return `${oriModPath}/${indexFileName}.js`
}

function writeModuleFunc(params) {
  const {
    C_CURR_TS,
    modBaseDir,
    funcName,
    oriModPath,
    noSass,
    cssPreffix,
    funcFileName,
  } = params

  const TPL_COMMENTS =
    '/**\n' +
    ` * ${C_CURR_TS}\n` +
    ` * This file used define the module ${oriModPath} functions.\n` +
    ` */\n\n`

  let TOL_IMPORT =
    `import React from 'react';\n` +
    '\n' +
    `import { useHistory } from 'react-router-dom';\n` +
    '\n'

  let TPL = noSass
    ? `export default function ${funcName}(props) {\n` +
      `  let history = useHistory();\n` +
      '\n' +
      `  return (\n` +
      `    <div className="${cssPreffix}">\n` +
      `      <h1 className="${cssPreffix}-h1">Test</h1>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n` +
      '\n'
    : `export default function ${funcName}(props) {\n` +
      `  let history = useHistory();\n` +
      '\n' +
      `  return (\n` +
      `    <div >\n` +
      `      <h1>Test</h1>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n` +
      '\n'

  fs.outputFileSync(
    R(src, modBaseDir, `${funcFileName}.jsx`),
    TPL_COMMENTS + TOL_IMPORT + TPL,
    FILE_OUTPUT_OPTS
  )

  return `${oriModPath}/${funcFileName}.jsx`
}

function writeModuleSass(params) {
  const {
    C_CURR_TS,
    modBaseDir,
    oriModPath,
    noSass,
    cssPreffix,
    sassFileName,
  } = params

  const TPL_COMMENTS =
    '/**\n' +
    ` * ${C_CURR_TS}\n` +
    ` * This file used define the module ${oriModPath} styles.\n` +
    ` * This file must be imported into parent scss file, to take it effect.\n` +
    ` * like : @import './${oriModPath}/${sassFileName}.scss';\n` +
    ` */\n\n`

  let TOL_IMPORT = `/* there can define module variables or function */` + '\n'

  let TPL =
    `.${cssPreffix} {\n` +
    `  &-container {\n` +
    `    color: #fff;\n` +
    `  }\n` +
    `}\n` +
    '\n'
  if (!noSass) {
    fs.outputFileSync(
      R(src, modBaseDir, `${sassFileName}.scss`),
      TPL_COMMENTS + TOL_IMPORT + TPL,
      FILE_OUTPUT_OPTS
    )

    return `${oriModPath}/${sassFileName}.scss`
  } else {
    return `Skip generate ${oriModPath}/${sassFileName}.scss`
  }
}

function parseParamsFromArgvs(originalArgvs) {
  let _params = {
    C_CURR_TS: dayjs().format('YY-MM-DD HH:mm dddd'),
    indexFileName: 'index',
    noSass: getCmdBooleanArgv(originalArgvs, CDM_VIEW_NOSASS_KEYS[0]),
    override: getCmdBooleanArgv(
      originalArgvs,
      CDM_VIEW_OVERRIDE_KEYS[0],
      CDM_VIEW_OVERRIDE_KEYS[1]
    ),
    forceFullpath: getCmdBooleanArgv(
      originalArgvs,
      CDM_VIEW_FORCE_FULLPATH[0],
      CDM_VIEW_FORCE_FULLPATH[1]
    ),
    baseView: getViewBasePath(originalArgvs),
  }

  _params.oriModPath = getModPathVal(originalArgvs)
  if (!validModPath(_params.oriModPath)) {
    throw new Error(
      `\tModule path required, you can used ${CMD_MOD_PATH_KEYS[0]} <module path> or ${CMD_MOD_PATH_KEYS[1]} <module path> set it.\n` +
        '\t And also can used cross-env ${CMD_MOD_PATH_KEYS[2]} = <module path> \n'
    )
  }

  _params.oriModName = getModNameVal(originalArgvs)

  _params.funcFileName = pickFileName(_params.oriModName, _params.oriModPath)

  _params.funcName = pickFuncName(_params.oriModName, _params.oriModPath)

  _params.cssPreffix = pickCssPreffixName(
    _params.oriModName,
    _params.oriModPath
  )

  _params.sassFileName = pickSassFileName(
    _params.oriModName,
    _params.oriModPath
  )

  _params.modBaseDir = join(_params.baseView, _params.oriModPath)

  return _params
}

function comboDoc() {
  const wikiColorHex = HELP_TEXT_COLORHEX
  let c =
    '✨✨✨\n' +
    chalk.hex(wikiColorHex)(`Terminal arguments:\n`) +
    chalk.hex(PREFIX_COLORHEX)('✔ ⇨ \t') +
    chalk.hex(wikiColorHex)(
      `${CMD_HELP_KEYS.join(' or ')}: show commands help.\n`
    ) +
    '\n' +
    // view base
    chalk.hex(PREFIX_COLORHEX)('✔ ⇨ \t') +
    chalk.hex(wikiColorHex)(
      `${CMD_VIEW_BASE_KEYS.join(
        ' or '
      )}: set view base dir. this dir in src .\n\t` +
        `Like cross-env ${CMD_VIEW_BASE_KEYS[2]} = <view base dir> \n\t` +
        `👀 if ${CDM_VIEW_FORCE_FULLPATH.join(
          ' or '
        )} set true, view base dir will ignored. 👀\n`
    ) +
    '\n' +
    // mod path
    chalk.hex(PREFIX_COLORHEX)('✔ ⇨ \t') +
    chalk.hex(wikiColorHex)(
      `${CMD_MOD_PATH_KEYS.join(
        ' or '
      )}: set module dir path, this command is required. \n\tmodulePath can only be a file path composed of lowercase letters, numbers or - .\n\t` +
        `Like ${CMD_MOD_PATH_KEYS[0]} <module path> \n\t` +
        `or ${CMD_MOD_PATH_KEYS[1]} "home/top-header" \n`
    ) +
    '\n' +
    // mod name
    chalk.hex(PREFIX_COLORHEX)('✔ ⇨ \t') +
    chalk.hex(wikiColorHex)(
      `${CMD_MOD_NAME_KEYS.join(
        ' or '
      )}: set module name, can only be a string composed of lowercase letters, numbers or - .\n\t` +
        `Like: ${CMD_MOD_NAME_KEYS[0]} <module name> \n\t` +
        `or ${CMD_MOD_NAME_KEYS[1]} "top-header" \n`
    ) +
    '\n' +
    // no sass
    chalk.hex(PREFIX_COLORHEX)('✔ ⇨ \t') +
    chalk.hex(wikiColorHex)(
      `${CDM_VIEW_NOSASS_KEYS.join(' or ')}: set skip generate sass file.\n`
    ) +
    '\n' +
    // force-fuulpath
    chalk.hex(PREFIX_COLORHEX)('✔ ⇨ \t') +
    chalk.hex(wikiColorHex)(
      `${CDM_VIEW_FORCE_FULLPATH.join(' or ')}: set ignored view base dir.\n`
    ) +
    '\n' +
    // force override
    chalk.hex(PREFIX_COLORHEX)('✔ ⇨ \t') +
    chalk.hex(wikiColorHex)(
      `${CDM_VIEW_OVERRIDE_KEYS.join(' or ')}: set force override files.\n`
    ) +
    chalk
      .hex(ERROR_TEXT_COLORHEX)
      .bold(
        '\t👀 Attention: ' +
          'This command will generate file override exist files.' +
          ' 👀👀'
      ) +
    '\n'
  return c
}
