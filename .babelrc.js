/**
 * Babel config
 */
const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      targets: {
        browsers: ['last 1 version', '> 5%', 'not dead'],
      },
      debug: false, //方便调试
    },
  ],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
  '@babel/preset-typescript',
  // 'react-app',
]

const plugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: {
        version: 3,
        proposals: true,
      },
      useESModules: true,
    },
  ],
  [
    'babel-plugin-import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    },
  ],
]

module.exports = function (api) {
  api.cache(true)
  return { presets, plugins }
}
