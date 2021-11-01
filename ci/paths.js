const path = require('path')

module.exports = {
  R: (...p) => path.resolve(...p),
  join: (...p) => path.join(...p),
  baseResovle: (...p) => path.resolve(__dirname, '..', ...p),
  favicon: path.resolve(__dirname, '../logo.png'),
  src: path.resolve(__dirname, '../src'),
  pubdir: path.resolve(__dirname, '../public'),
  dist: path.resolve(__dirname, '../dist'),
}
