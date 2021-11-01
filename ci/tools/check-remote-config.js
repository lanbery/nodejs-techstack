#!/usr/bin/env node

const axios = require('axios').default
const fs = require('fs-extra')

const { R, pubdir } = require('../paths')

const minizer = true

main().catch((err) => {
  console.log('Error:', err.message)
})

async function main() {
  const url = 'https://sbcproxyer.github.io/dl/js/app.config.js'
  const parseData = await getAndPaseConfig(url)

  const targetPath = R(pubdir, 'js/app.config.js')

  if (parseData) {
    console.log(
      '\x1B[34m%s\x1B[0m',
      `Data writing...🏃‍♀️🏃‍♂️🏃‍♀️🏃‍♂️🏃‍♀️🏃‍♂️🏃‍♀️🏃‍♂️🚶‍♂️🚶‍♀️🚶‍♂️🚶‍♀️🚶‍♂️🚶‍♀️\n${parseData} => ${targetPath}\n`
    )

    const text = await writeConfig(targetPath, parseData)
    console.log('\x1B[32m%s\x1B[0m', text)
  }
}

async function writeConfig(file, data) {
  try {
    let _text = minizer ? data.replace(/[\r\n\ +]/g, '') : data
    fs.writeFileSync(file, _text, { encoding: 'utf8' })
    return `write ${file} complete.`
  } catch (e) {
    throw e
  }
}

async function getAndPaseConfig(url) {
  try {
    const resp = await axios.get(url + '?ts=' + new Date().getTime())
    const { status, statusText, path, data } = resp

    let parseData = null
    if (status !== 200) {
      console.warn(
        `get config fail: ${statusText} [${status}] .\n from path: ${path}`
      )
      throw new Error(`get config fail: ${statusText} [${status}]`)
    } else if (typeof data === 'string' && data.length) {
      parseData = data
    } else {
      throw new Error(`remote data invalid. ${data}`)
    }
    return parseData
  } catch (err) {
    console.log(err)
    throw err
  }
}
