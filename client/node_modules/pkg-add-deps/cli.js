#!/usr/bin/env node
'use strict'
const yargs = require('yargs')
const addDeps = require('.')

const extractKey = argv => {
  if (argv.saveOptional) {
    return 'optionalDependencies'
  }
  if (argv.saveDev) {
    return 'devDependencies'
  }
  return 'dependencies'
}

async function main() {
  const { argv } = yargs
    .option('save-prod', {
      type: 'boolean',
      default: false,
      alias: ['S', 'save'],
    })
    .option('save-dev', {
      type: 'boolean',
      default: false,
      alias: 'D',
    })
    .option('save-optional', {
      type: 'boolean',
      default: false,
      alias: 'O',
    })
    .help()

  const depSpecs = argv._
  await addDeps({ depSpecs, key: extractKey(argv) })
}

main()
