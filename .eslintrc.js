//Eslint检测配置文件步骤：
//1.在要检测的文件同一目录里寻找.eslintrc.*和package.json
//2.紧接着在父级目录里寻找，一直到文件系统的根目录
//3.如果在前两步发现有root：true的配置，停止在父级目录中寻找.eslintrc
//4.如果以上步骤都没有找到，则回退到用户主目录~/.eslintrc中自定义的默认配置

const parseOptions = {
  ecmaVersion: '2017', // 指定要使用的ECMAScript版本，默认值5
  ecmaFeatures: {
    //启用对实验性的objectRest/spreadProperties的支持
    experimentalObjectRestSpread: false,
    jsx: true,
  },
  sourceType: 'module',
}

/**
 *
 */
const extendsConf = [
  'eslint:recommended',
  'plugin:react/recommended',
  'prettier',
  'prettier/react',
]

/**
 * ESLint支持使用第三方插件,
 * plugin与extend的区别：extend提供的是eslint现有规则的一系列预设,
 * plugin 可省略 'eslint-plugin-' 前缀
 */
const plugins = ['@babel', 'react', 'import', 'prettier', 'react-hooks']

module.exports = {
  root: true,
  //指定环境，每个环境都有自己预定义的全局变量，可以同时指定多个环境，不矛盾
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@babel/eslint-parser',
  parseOptions,
  extends: extendsConf,
  plugins,
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
  },
  settings: {
    react: {
      pragma: 'React',
      fragment: 'fragment',
      version: 'detect',
      flowVersion: '0.63.1',
    },
  },
}
