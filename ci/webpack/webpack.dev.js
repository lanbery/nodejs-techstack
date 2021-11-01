const Dotenv = require('dotenv-webpack')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const NODE_ENV_VALT = 'development'
process.env.BABEL_ENV = NODE_ENV_VALT
process.env.NODE_ENV = NODE_ENV_VALT

const commonWebpack = require('./webpack.common')
const { join, dist, baseResovle } = require('../paths')

const port = process.env.port || 25971

const devSeverOption = {
  historyApiFallback: true,
  contentBase: dist,
  open: openPage(port),
  compress: true,
  hot: true,
  port: port,
  useLocalIp: false,
}

function openPage(port) {
  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv

  let opened = false
  if (originalArgvs.find((t) => t === '--open')) {
    opened = `http://localhost:${port}`
  }

  return opened
}

module.exports = merge(commonWebpack, {
  mode: NODE_ENV_VALT,
  devtool: 'inline-source-map',
  devServer: {
    ...devSeverOption,
  },
  module: {
    rules: [
      {
        test: /\.[js]x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: join('./config', '.env.development'),
      safe: false,
      allowEmptyValues: true,
      systemvars: true,
      expand: true,
    }),
    new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
})
