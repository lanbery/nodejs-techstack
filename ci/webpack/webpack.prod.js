const Dotenv = require('dotenv-webpack')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const NODE_ENV_VALT = 'production'
process.env.BABEL_ENV = NODE_ENV_VALT
process.env.NODE_ENV = NODE_ENV_VALT

const commonConfig = require('./webpack.common.js')
const { dist, join } = require('../paths')

module.exports = merge(commonConfig, {
  mode: NODE_ENV_VALT,
  devtool: false,
  output: {
    path: dist,
    publicPath: '/',
    filename: 'js/[name].[contenthash].min.js',
  },

  plugins: [
    new Dotenv({
      path: join('./config', '.env.production'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
})
