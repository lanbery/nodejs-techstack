#!/usr/bin/env node

const { dist, R, join, baseResovle } = require('../paths')

const fs = require('fs-extra')
const pkgJson = require('../../package.json')

const TARGET_PROJECT = 'sbcproxyer.github.io'

main()

async function main() {
  try {
    const deployPaths = checkBaseDir()

    const resp = await cpAndpush(deployPaths)

    console.log('Deploy Git Pages:\n', resp)
  } catch (err) {
    console.log(err)
    process.exitCode = 1
  }
}

function checkBaseDir() {
  if (!fs.existsSync(dist)) throw new Error(`srource dir ${dist} not exists.`)

  const distResult = fs.readdirSync(dist)
  if (!distResult.length) {
    throw new Error(`need build first,not files in ${dist} or build failed.`)
  }

  const targetBaseDir = baseResovle('..', TARGET_PROJECT)

  if (!fs.existsSync(targetBaseDir)) {
    throw new Error(`target dir ${targetBaseDir} not exists.`)
  }

  if (!fs.existsSync(join(targetBaseDir, '/.git'))) {
    throw new Error(`target dir ${targetBaseDir} not github project.`)
  }

  let commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()

  commitHash = commitHash.endsWith('\n')
    ? commitHash.substring(0, commitHash.length - 2)
    : commitHash

  const targetRelease = join(targetBaseDir, 'RELEASE.md')

  fs.ensureFileSync(targetRelease)
  return {
    baseDir: baseResovle(),
    commitHash,
    srcDist: dist,
    targetBaseDir,
    targetDir: join(targetBaseDir, 'docs'),
    targetRelease,
  }
}

async function forceOverridelocal() {
  const command =
    'git fetch --all && git reset --hard origin/gh-pages && git pull'
}

async function cpAndpush({
  commitHash,
  baseDir,
  srcDist,
  targetBaseDir,
  targetDir,
  targetRelease,
}) {
  // Force fetch
  let gitFetch = require('child_process')
    .execSync(
      `cd ${targetBaseDir} && git fetch --all && git reset --hard origin/gh-pages && git pull && cd ${baseDir}`
    )
    .toString()

  console.log('\x1B[32m%s\x1B[0m', `Force override local \n${gitFetch}`)

  // empty
  fs.emptyDirSync(targetDir)

  fs.copySync(srcDist, targetDir, { overwrite: true })
  const pushComment = `v${pkgJson.version}-${commitHash}`

  let gitstat = require('child_process')
    .execSync(`cd ${targetBaseDir} && git status && cd ${baseDir}`)
    .toString()

  console.log('Git add . >>>>>>>', gitstat)

  fs.appendFileSync(
    targetRelease,
    `\n# Version ${
      pkgJson.version
    } \n > version ${pushComment} ${new Date().toLocaleString()}`,
    { encoding: 'utf8' }
  )

  let gitResult = require('child_process')
    .execSync(
      `cd ${targetBaseDir} && git add . && git commit -am ${pushComment} && git push && cd ${baseDir}`
    )
    .toString()

  return gitResult
}
