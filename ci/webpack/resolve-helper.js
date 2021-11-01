const { R, join, src } = require('../paths')

const jsExtensions = ['js', 'jsx', 'ts', 'tsx']
const imgExtensions = ['png', 'jpg', 'jepg', 'gif']

const BaseResolve = {
  alias: {
    '~': src,
    '~Assets': R(src, 'assets'),
    '~Lib': R(src, 'lib'),
    '~Layouts': R(src, 'layouts'),
    '~Router': R(src, 'router'),
    '~Store': R(src, 'store'),
    '~UI': R(src, 'ui'),
    '~Views': R(src, 'views'),
    '~Widgets': R(src, 'ui/widgets'),
    process: 'process/browser',
    stream: 'stream-browserify',
    zlib: 'browserify-zlib',
  },
  extensions: jsExtensions.map((t) => `.${t}`),
}

module.exports = {
  BaseResolve,
  jsExtensions,
  imgExtensions,
}
