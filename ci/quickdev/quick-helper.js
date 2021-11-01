/** File write out options */
const FILE_OUTPUT_OPTS = {
  encoding: 'utf8',
}

module.exports = {
  SEMI: '',
  FILE_OUTPUT_OPTS,
  CMD_HELP_KEYS: ['--help', '-h'],
  CMD_MOD_PATH_KEYS: ['--mod-path', '-m', 'MOD_PATH'],
  CMD_MOD_NAME_KEYS: ['--mod-name', '-n', 'MOD_NAME'],
  CMD_VIEW_BASE_KEYS: ['--view-base', '-v', 'VIEW_BASE'],
  CDM_VIEW_FORCE_FULLPATH: ['--force-fullpath', '-f'],
  CDM_VIEW_OVERRIDE_KEYS: ['--override', '-o'],
  CDM_VIEW_OUTPUT_KEYS: ['--output', '-o'],
  CDM_VIEW_NOSASS_KEYS: ['--no-sass'],
  CDM_VIEW_NO_CONTAINER_KEYS: ['--no-container'],
  RESERVED_KEYWORDS_4FILE: ['index'],
  RESERVED_KEYWORDS_4NAME: ['index', 'page'],
  RESERVED_KEYWORDS_4MODPREFIX: ['comp', 'page', 'container'],
  RESET_COLOR_SIGN: '\x1B[0m',
  ERROR_TEXT_SIGN: '\x1B[31m',
  BRIGHT_TEXT_SIGN: '\x1B[1m',
  SUCCESS_TEXT_SIGN: '\x1B[32m',
  MAGENTA_TEXT_SIGN: '\x1B[35m',
}
