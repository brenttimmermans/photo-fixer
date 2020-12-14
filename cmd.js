#!/usr/bin/env node
const yargs = require('yargs/yargs')
const fixPhotos = require('./index')

const { argv } = yargs(process.argv)
  .options({
    i: {
      alias: 'input',
      demandOption: true,
      describe: 'folder containing the film scans',
      type: 'string'
    },
    r: {
      alias: 'roll',
      demandOption: true,
      describe: 'film roll number',
      type: 'number'
    },
    d: {
      alias: 'date',
      demandOption: true,
      describe: 'film roll date',
      type: 'string'
    }
  })
  .help('h')
  .alias('h', 'help')
  .usage('$0 path')
  .example('$0 -i /Users/user/Pictures/some-film-scans-folder -r 72 -d 01/01/2020')

const { input, roll, date } = argv
fixPhotos(input, roll, date)
