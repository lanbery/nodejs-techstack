const chalk = require('chalk')

const { R, dist } = require('./paths')

const PROT = 18694

const { createProxyMiddleware } = require('http-proxy-middleware')

const apiProxy = createProxyMiddleware('/api', {
  target: 'xxx',
  changeOrigin: true, // for vhosted sites
})

module.exports = {
  port: PROT,
  browser: ['chrome'],
  files: ['./src/**/*.{html,scss,js,jsx}'],
  server: {
    baseDir: dist,
    // middleware: {
    //   10: apiProxy,
    // },
  },
  open: true,
}
