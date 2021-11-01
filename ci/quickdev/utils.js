const chalk = require('chalk')
const { capitalize } = require('lodash')

const { ERROR_TEXT_COLORHEX } = require('../colors-cnsts')
const {
  CMD_HELP_KEYS,
  CMD_MOD_PATH_KEYS,
  CMD_MOD_NAME_KEYS,
  CMD_VIEW_BASE_KEYS,
  RESERVED_KEYWORDS_4FILE,
  RESERVED_KEYWORDS_4NAME,
  RESERVED_KEYWORDS_4MODPREFIX,
  CDM_VIEW_FORCE_FULLPATH,
} = require('./quick-helper')

const MOD_PATH_REGEX = /^[a-z]+([a-z0-9]*([\-\/]?)(?!\2))*[a-z0-9]+$/
const MOD_NAME_REGEX = /^[a-z]+([a-z0-9]*([\-]?)(?!\2))*[a-z0-9]+$/

/**
 *
 * @param {Array} originalArgvs array[string]
 */
function getModPathVal(originalArgvs) {
  if (typeof originalArgvs !== 'object' && !originalArgvs.length) {
    exitProgress(`Parse argument originalArgvs illegal.`)
  }

  const fullKey = CMD_MOD_PATH_KEYS[0]
  const shortKey = CMD_MOD_PATH_KEYS[1]
  const crossKey = CMD_MOD_PATH_KEYS.length > 2 ? CMD_MOD_PATH_KEYS[2] : ''

  let _argv = crossKey && process.env ? process.env[crossKey] : ''

  const _len = originalArgvs.length
  let _idx = -1
  _idx = originalArgvs.findIndex((argv) => argv === shortKey)
  if (_idx + 1 < _len && _idx > 0) {
    _argv = originalArgvs[_idx + 1]
  }

  _idx = originalArgvs.findIndex((argv) => argv === fullKey)
  if (_idx + 1 < _len && _idx > 0) {
    _argv = originalArgvs[_idx + 1]
  }

  if (!validModPath(_argv)) {
    let msg =
      'module path required. modPath ${_argv} illegal.\n' +
      `Please used command ${CMD_MOD_PATH_KEYS[0]} <module path> or ${CMD_MOD_PATH_KEYS[1]} <module path>.\n`
    throw Error(msg)
  }

  return _argv
}

function getModNameVal(originalArgvs) {
  if (typeof originalArgvs !== 'object' && !originalArgvs.length) {
    exitProgress(`Parse argument originalArgvs illegal.`)
  }

  const fullKey = CMD_MOD_NAME_KEYS[0]
  const shortKey = CMD_MOD_NAME_KEYS[1]
  const crossKey = CMD_MOD_NAME_KEYS.length > 2 ? CMD_MOD_NAME_KEYS[2] : ''

  let _argv = crossKey && process.env ? process.env[crossKey] : ''

  const _len = originalArgvs.length
  let _idx = -1
  _idx = originalArgvs.findIndex((argv) => argv === shortKey)
  if (_idx + 1 < _len && _idx > 0) {
    _argv = originalArgvs[_idx + 1]
  }

  _idx = originalArgvs.findIndex((argv) => argv === fullKey)
  if (_idx + 1 < _len && _idx > 0) {
    _argv = originalArgvs[_idx + 1]
  }

  // if (!_argv && modPath) {
  //   // make modPath last part set modName
  //   const _parts = modPath.split(/\//).filter(Boolean)
  //   _parts.length && (_argv = _parts[_parts.length - 1])
  // }

  return _argv
}

function getViewBasePath(originalArgvs) {
  if (typeof originalArgvs !== 'object' && !originalArgvs.length) {
    exitProgress(`Parse argument originalArgvs illegal.`)
  }

  if (
    originalArgvs.includes(CDM_VIEW_FORCE_FULLPATH[0]) ||
    originalArgvs.includes(CDM_VIEW_FORCE_FULLPATH[1])
  ) {
    // force fullpath
    return ''
  }

  const fullKey = CMD_VIEW_BASE_KEYS[0]
  const shortKey = CMD_VIEW_BASE_KEYS[1]
  const crossKey = CMD_VIEW_BASE_KEYS.length > 2 ? CMD_VIEW_BASE_KEYS[2] : ''

  let _argv = crossKey && process.env ? process.env[crossKey] : ''

  const _len = originalArgvs.length
  let _idx = -1
  _idx = originalArgvs.findIndex((argv) => argv === shortKey)
  if (_idx + 1 < _len && _idx > 0) {
    _argv = originalArgvs[_idx + 1]
  }

  _idx = originalArgvs.findIndex((argv) => argv === fullKey)
  if (_idx + 1 < _len && _idx > 0) {
    _argv = originalArgvs[_idx + 1]
  }

  return _argv || ''
}

/**
 *
 * @param {string} oriModName
 * @returns string
 */
function pickFileName(oriModName, oriModPath) {
  if (oriModName) return oriModName
  return pickLastPath(oriModPath)
}

function pickLastPath(modPath) {
  const _parts = modPath.split(/\//)
  let _last = _parts[_parts.length - 1]
  return _last
}

/**
 *
 * @param {string} oriModName -n argv
 * @param {string} oriModPath
 * @returns
 */
function pickFuncName(oriModName, oriModPath) {
  if (oriModName) {
    return oriModName
      .split(/-/)
      .map((t) => capitalize(t))
      .join('')
  }

  const lastModPath = pickLastPath(oriModPath)

  const _parts = lastModPath.split(/-/).filter(Boolean)
  let _parts2 = _parts.filter((t) => !RESERVED_KEYWORDS_4NAME.includes(t))

  if (_parts2.length) return _parts2.map((t) => capitalize(t)).join('')

  return _parts.map((t) => capitalize(t)).join('')
}

/**
 *
 * @param {string} oriModName
 * @param {string} oriModPath
 * @returns
 */
function pickCssPreffixName(oriModName, oriModPath) {
  if (oriModName) {
    let orinParts = oriModName
      .split(/-/)
      .filter(Boolean)
      .filter((t) => !RESERVED_KEYWORDS_4NAME.includes(t.toString()))

    if (orinParts.length) {
      return orinParts.join('-')
    } else {
      const _rootNameParts = pickRootCssNamesFromModPath(oriModPath)

      return _rootNameParts.length ? _rootNameParts.join('-') : oriModName
    }
  }

  const lastModPath = pickLastPath(oriModPath)

  const _parts = lastModPath
    .split(/-/)
    .filter(Boolean)
    .filter((t) => !RESERVED_KEYWORDS_4NAME.includes(t))

  const len = _parts.length
  if (len === 0) return lastModPath

  return len > 2 ? _parts.slice(0, 2).join('-') : _parts.slice(0, 1)[0]
}

function pickSassFileName(oriModName, oriModPath) {
  if (oriModName) return oriModName
  const lastModPath = pickLastPath(oriModPath)

  const _parts = lastModPath
    .split(/-/)
    .filter(Boolean)
    .filter((t) => !RESERVED_KEYWORDS_4FILE.includes(t))

  return _parts.length ? _parts.join('-') : lastModPath
}

function validModPath(modPath) {
  if (!modPath || !modPath.trim().length) return false
  return new RegExp(MOD_PATH_REGEX).test(modPath)
}

function validModName(modName) {
  return new RegExp(MOD_NAME_REGEX).test(modName)
}

function exitProgress(text) {
  console.error(chalk.hex(ERROR_TEXT_COLORHEX)(`⛔⛔⛔\t${text}\t`))
  process.exit(0)
}

function getCmdBooleanArgv(originalArgvs, longKey, shortKey) {
  if (typeof originalArgvs !== 'object' && !originalArgvs.length) {
    exitProgress(`Parse argument originalArgvs illegal.`)
  }
  let _b = false

  if (shortKey && originalArgvs.includes(shortKey)) {
    _b = true
  }

  if (longKey && originalArgvs.includes(longKey)) {
    _b = true
  }

  return _b
}

/**
 *
 * @param {string} oriModName
 * @param {string} oriModPath
 * @returns
 */
function pickModFilePrefix(oriModName, oriModPath) {
  if (oriModName) {
    const _tmpParts = oriModName
      .split(/-/)
      .filter((t) => !RESERVED_KEYWORDS_4MODPREFIX.includes(t))

    if (_tmpParts.length) return _tmpParts.join('-')
  }

  const _last = pickLastPath(oriModPath)

  let _lastParts = _last
    .split(/-/)
    .filter((t) => !RESERVED_KEYWORDS_4MODPREFIX.includes(t))

  if (_lastParts.length > 1) {
    _lastParts = _lastParts.slice(_lastParts.length - 1)
  }

  if (_lastParts.length) {
    return _lastParts.join('-')
  }

  return _last
}

function showHelp(originalArgvs, helpDoc) {
  let idx = originalArgvs.findIndex((argv) => argv === CMD_HELP_KEYS[0])
  let cidx = originalArgvs.findIndex((argv) => argv === CMD_HELP_KEYS[1])
  if (idx > 0 || cidx > 0) {
    console.log('\x1B[36m%s\x1B[0m', helpDoc)
    process.exit(0)
  }
}

function splitModPath(modPath) {
  if (!modPath) return []
  return modPath.split(/\/|\\/).filter(Boolean)
}
/**
 *
 * @param {string} oriModPath
 * @returns []
 */
function pickRootCssNamesFromModPath(oriModPath) {
  const _modPathParts = splitModPath(oriModPath)

  if (!_modPathParts.length) return []
  const _rootDir = _modPathParts[0]
  let _rootParts = _rootDir.split(/-/).filter(Boolean)

  const _rootPartsFilter = _rootParts.filter(
    (t) => !RESERVED_KEYWORDS_4NAME.includes(t.toString())
  )

  let result = []
  if (_rootPartsFilter.length === 0) {
    return _rootParts.slice(0, 1)
  } else if (_rootPartsFilter.length === 1) {
    _rootPartsFilter.push('page')
    return _rootPartsFilter
  } else {
    return _rootPartsFilter.slice(0, 2)
  }
}

module.exports = {
  MOD_PATH_REGEX,
  MOD_NAME_REGEX,
  showHelp,
  getModPathVal,
  validModPath,
  getModNameVal,
  validModName,
  pickFileName,
  pickCssPreffixName,
  pickFuncName,
  getViewBasePath,
  getCmdBooleanArgv,
  pickSassFileName,
  pickModFilePrefix,
}
