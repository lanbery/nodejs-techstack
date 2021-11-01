module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  bracketSpacing: true,
  arrowParens: 'always',
  overrides: [
    {
      files: '*.sol',
      options: {
        // compiler:'0.6.12',
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: false,
        // explicitTypes: 'always',
      },
    },
  ],
}
