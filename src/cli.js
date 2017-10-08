import yargs from 'yargs'
import termSize from 'term-size'
import generate from './cli-commands/generate'
import { readFile, writeFile, generateWriteSpecs } from './api'

yargs
  .command(generate({ readFile, writeFile, generateWriteSpecs }))
  .demandCommand()
  .help()
  .wrap(termSize().columns)
  .parse()