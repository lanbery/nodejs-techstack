#!/usr/bin/env node

/**
 * node >= 12
 */
const chalk = require('chalk')
const fs = require('fs-extra')
const dayjs = require('dayjs')
const { capitalize } = require('lodash')

const openTrace = false

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
  pickCssPreffixName,
  getCmdBooleanArgv,
  pickSassFileName,
  pickModFilePrefix,
} = require('./utils')

const {
  SEMI,
  CMD_HELP_KEYS,
  CMD_VIEW_BASE_KEYS,
  CDM_VIEW_FORCE_FULLPATH,
  CDM_VIEW_OVERRIDE_KEYS,
  CMD_MOD_NAME_KEYS,
  CMD_MOD_PATH_KEYS,
  CDM_VIEW_NOSASS_KEYS,
  CDM_VIEW_NO_CONTAINER_KEYS,
  FILE_OUTPUT_OPTS,
} = require('./quick-helper')

const { R, join, src } = require('../paths')

main()
  .then((resp) => {
    console.log(
      '\x1B[32m%s\x1B[0m',
      chalk.hex(SUCCESS_TEXT_COLORHEX)(
        '\x1B[33m✨✨✨ congratulate! ✨✨✨\x1B[0m\n'
      ) +
        resp +
        '\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n'
    )
  })
  .catch((err) => {
    // console.log(err)
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
    openTrace && console.log(err)
  })

async function main() {
  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv

  showHelp(originalArgvs, comboDoc())

  return new Promise((resolve, reject) => {
    try {
      let params = parseParamsFromArgvs(originalArgvs)

      params = checkFileExist(params)

      console.log('\x1B[35m%s\x1B[0m', params)

      let successMsgs = []

      const indexResp = writeModuleIndex(params)
      successMsgs.push(indexResp)

      const funcResp = writeReactFile(params)
      successMsgs.push(funcResp)

      const ctxResp = writeReactContainer(params)
      successMsgs.push(ctxResp)

      const scssResp = writeSassFile(params)
      successMsgs.push(scssResp)

      let _msg = 'generate module success.\n'
      for (let i = 0; i < successMsgs.length; i++) {
        _msg += `\t${successMsgs[i]}\n`
      }

      return resolve(chalk.hex(SUCCESS_TEXT_COLORHEX)(_msg))
    } catch (err) {
      if (err instanceof Error) return reject(err)

      return reject(new Error(err.toString()))
    }
  })
}

function writeSassFile(params) {
  const {
    C_CURR_TS,
    modBaseDir,
    oriModPath,
    sassFileName,
    noSass,
    cssPreffix,
    C_AUTHOR = '',
  } = params

  if (noSass) {
    return `Skip generate ${oriModPath}/${sassFileName}.scss`
  }

  const TPL_COMMENTS =
    '/**\n' +
    ` * ${C_CURR_TS} ${C_AUTHOR}\n` +
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

  fs.outputFileSync(
    R(src, modBaseDir, `${sassFileName}.scss`),
    TPL_COMMENTS + TOL_IMPORT + TPL,
    FILE_OUTPUT_OPTS
  )

  return `${oriModPath}/${sassFileName}.scss`
}

function writeReactContainer(params) {
  const {
    C_CURR_TS,
    modBaseDir,
    oriModPath,
    noContainer,
    modReactFileName,
    modContainerFileName,
    modNamePrefix,
    C_AUTHOR = '',
  } = params

  if (noContainer) {
    return `Skip generate ${oriModPath}/${modNamePrefix}-container.js`
  }
  const reactCompName = `${modNamePrefix}Page`

  const TPL_IMPORT =
    `import { compose } from 'redux'${SEMI}\n` +
    `import { connect } from 'react-redux'${SEMI}\n` +
    `import { withRouter } from 'react-router-dom'${SEMI}\n` +
    '\n' +
    `import ${reactCompName} from './${modReactFileName}'${SEMI}\n`

  let COMMENTS_TPL = '\n'

  COMMENTS_TPL +=
    '/**\n' +
    ' *\n' +
    ` * @module: ${oriModPath} \n` +
    ` * @Created: ${C_AUTHOR} ${C_CURR_TS}\n` +
    ' * make state inject into react dom props\n' +
    ' *\n' +
    ' */\n'

  // mapState
  const TPL_MAP_STATE =
    'const mapStateToProps = (state) => {\n' +
    '  // global state contains skinState ... ed.\n' +
    '  const {\n ' +
    '   skinState: { header },\n' +
    `  } = state${SEMI}\n` +
    '\n' +
    '  return {\n' +
    '    header,\n' +
    '  }\n' +
    '}\n'

  const TPL_MAP_DISPATCH =
    '\n' +
    'const mapDispatchToProps = (dispatch) => {\n' +
    '  return {\n' +
    '    // doSomeThing:(arg1,arg2) => (dispatch) => {\n' +
    '    //   ...\n' +
    '    //   dispatch(action);\n' +
    '    // },\n' +
    '  }\n' +
    '}\n'

  const EXP_TPL =
    '\n' +
    'export default compose(\n' +
    '  withRouter,\n' +
    `  connect(mapStateToProps, mapDispatchToProps)\n` +
    `)(${reactCompName})${SEMI}\n`

  const OUTPUT_TPL =
    TPL_IMPORT + COMMENTS_TPL + TPL_MAP_STATE + TPL_MAP_DISPATCH + EXP_TPL

  fs.outputFileSync(
    R(src, modBaseDir, `${modContainerFileName}.js`),
    OUTPUT_TPL,
    FILE_OUTPUT_OPTS
  )

  return `${oriModPath}/${modContainerFileName}.js`
}

function checkFileExist(params) {
  const {
    modBaseDir,
    indexFileName,
    oriModPath,
    modFilePrefix,
    sassFileName,
    override,
    noSass,
    noContainer,
  } = params

  const modReactFileName = noContainer
    ? `${modFilePrefix}-page`
    : `${modFilePrefix}-comp`

  let _params = {
    ...params,
    modReactFileName: modReactFileName,
  }

  if (!noContainer) {
    _params.modContainerFileName = `${modFilePrefix}-container`
  }

  let msg = ''

  if (!override && fs.existsSync(R(src, modBaseDir, `${indexFileName}.js`))) {
    msg = `\t${indexFileName}.js has been exist in ${oriModPath}.`
    msg += `\n\tyour used ${CDM_VIEW_OVERRIDE_KEYS.join(
      ' or '
    )} force override.`
    throw new Error(msg)
  }

  if (
    !override &&
    fs.existsSync(R(src, modBaseDir, `${modReactFileName}.jsx`))
  ) {
    msg = `\t${modReactFileName}.jsx has been exist in ${oriModPath}.`
    msg += `\n\tyour used ${CDM_VIEW_OVERRIDE_KEYS.join(
      ' or '
    )} force override.`
    throw new Error(msg)
  }

  if (
    !noSass &&
    !override &&
    fs.existsSync(R(src, modBaseDir, `${sassFileName}.js`))
  ) {
    msg = `\t${sassFileName}.js has been exist in ${oriModPath}.`
    msg += `\n\tyour used ${CDM_VIEW_OVERRIDE_KEYS.join(
      ' or '
    )} force override.`
    throw new Error(msg)
  }

  if (
    _params.modContainerFileName &&
    !override &&
    fs.existsSync(R(src, modBaseDir, `${_params.modContainerFileName}.js`))
  ) {
    msg = `\t${_params.modContainerFileName}.js has been exist in ${oriModPath}.`
    msg += `\n\tyour used ${CDM_VIEW_OVERRIDE_KEYS.join(
      ' or '
    )} force override.`
    throw new Error(msg)
  }

  const rootDir = R(src, modBaseDir)
  if (!fs.existsSync(rootDir)) {
    fs.ensureDirSync(rootDir)
  }

  return _params
}

function writeReactFile(params) {
  const {
    modBaseDir,
    oriModPath,
    cssPreffix,
    noContainer,
    modReactFileName,
    modNamePrefix,
  } = params

  const extendClz = !noContainer ? 'Component' : 'PureComponent'
  const reactCompName = `${modNamePrefix}${!noContainer ? 'Comp' : 'Page'}`

  const IMP_TPL = `import React, { ${extendClz} } from 'react'\n` + '\n'

  const COMP_TPL_OPEN = `export default class ${reactCompName} extends ${extendClz} {\n`
  const COMP_TPL_CLOSE = '}\n'

  let COMP_TPL_CONTENT = '\n'

  /* ------------- constructor -----------------  */
  COMP_TPL_CONTENT += '  constructor(props) {\n'
  COMP_TPL_CONTENT += `    super(props)${SEMI}\n`
  COMP_TPL_CONTENT += `    this.state = {\n`
  COMP_TPL_CONTENT += `      // a: 1,\n`
  COMP_TPL_CONTENT += `    }${SEMI}\n`
  COMP_TPL_CONTENT += `  }\n\n`
  /* ------------- constructor end -----------------  */

  COMP_TPL_CONTENT += `  componentDidMount() {\n`
  COMP_TPL_CONTENT += `    // there regist something handle. \n`
  COMP_TPL_CONTENT += `  }\n\n`

  COMP_TPL_CONTENT += `  componentWillUnmount() {\n`
  COMP_TPL_CONTENT += `    // there unregist something handle. \n`
  COMP_TPL_CONTENT += `  }\n\n`

  COMP_TPL_CONTENT +=
    '\n' +
    '  renderHeader() {\n' +
    `    return <div className='${cssPreffix}__header'> ${modNamePrefix} Header</div>\n` +
    '  }\n'

  // content
  COMP_TPL_CONTENT +=
    '\n' +
    '  renderContent() {\n' +
    `    return <div className='${cssPreffix}__content'>${modNamePrefix} Content</div>\n` +
    '  }\n'

  //
  COMP_TPL_CONTENT +=
    '\n' +
    '  renderFooter() {\n' +
    `    return <div className='${cssPreffix}__footer'>${modNamePrefix} Footer</div>\n` +
    '  }\n'

  // render
  COMP_TPL_CONTENT +=
    '\n' +
    '  render() {\n' +
    '    // const { xxx } = this.props\n\n' +
    '    return (\n' +
    `      <div className='${cssPreffix}'>\n` +
    `        {this.renderHeader()}\n` +
    `        {this.renderContent()}\n` +
    '        {this.renderFooter()}\n' +
    '      </div>\n' +
    '    )\n' +
    '  }\n'

  const OUT_TPL = IMP_TPL + COMP_TPL_OPEN + COMP_TPL_CONTENT + COMP_TPL_CLOSE

  fs.outputFileSync(
    R(src, modBaseDir, `${modReactFileName}.jsx`),
    OUT_TPL,
    FILE_OUTPUT_OPTS
  )

  return `${oriModPath}/${modReactFileName}.jsx`
}

function writeModuleIndex(params) {
  const {
    C_CURR_TS,
    indexFileName,
    modBaseDir,
    oriModPath,
    sassFileName,
    noSass,
    noContainer,
    modReactFileName,
    modContainerFileName,
    C_AUTHOR = '',
  } = params

  let COMMENTS_TPL = ''

  let modFiles = [`${modReactFileName}.js`]
  if (!noContainer && modContainerFileName)
    modFiles.push(`${modContainerFileName}.js`)
  if (!noSass) modFiles.push(`${sassFileName}.scss`)

  COMMENTS_TPL +=
    '/**\n' +
    ' *\n' +
    ` * @Created : ${C_AUTHOR} ${C_CURR_TS}\n` +
    ` * @module : ${oriModPath}\n` +
    ` *   Main file: index.js\n` +
    ` *   DOM files: ${modFiles.join(',')}\n` +
    ' */\n'

  const relativeFile = noContainer
    ? `${modReactFileName}.jsx`
    : `${modContainerFileName}.js`

  const INDEX_TPL = `export { default } from './${relativeFile}'\n`

  fs.outputFileSync(
    R(src, modBaseDir, `${indexFileName}.js`),
    COMMENTS_TPL + INDEX_TPL,
    FILE_OUTPUT_OPTS
  )

  return `${oriModPath}/${indexFileName}.js`
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
    noContainer: getCmdBooleanArgv(
      originalArgvs,
      CDM_VIEW_NO_CONTAINER_KEYS[0]
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

  _params.oriModName = getModNameVal(originalArgvs, _params.oriModPath)

  _params.modFilePrefix = pickModFilePrefix(
    _params.oriModName,
    _params.oriModPath
  )

  _params.modNamePrefix = _params.modFilePrefix
    .split(/-/)
    .map((t) => capitalize(t))
    .join('')

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
