import * as events from 'node:events'
import * as fs from 'node:fs'
import * as readline from 'node:readline'
import { parseArgs } from 'node:util'

import archiver from 'archiver'

const {
  values: { submission },
  positionals: [input],
} = parseArgs({
  options: {
    submission: {
      type: 'boolean',
      default: false,
    },
  },
  allowPositionals: true,
})

const rl = readline.createInterface({
  input: fs.createReadStream(input),
  crlfDelay: Infinity,
})

let planName
let planId
let currentFile
let testName
let testId

const files = []

rl.on('line', (line) => {
  if (line.includes('- ID')) {
    planId = line.slice(6)
    return
  }
  if (line.includes('- Name')) {
    planName = line.slice(8)
    return
  }

  line = line.substring(4)

  if (currentFile && line.includes('Test ID')) {
    throw new Error()
  }

  if (line.includes('Test ID')) {
    testId = line.split(' ').reverse()[0]
    currentFile = `${testId}.txt`
    if (fs.existsSync(currentFile)) {
      fs.unlinkSync(currentFile)
    }
  }

  if (line.includes('Test Name')) {
    testName = line.split(' ').reverse()[0]
  }

  if (!currentFile) {
    return
  }

  fs.writeFileSync(currentFile, `${line}\n`, { flag: 'a' })

  if (line.includes('Test Finished')) {
    const fullname = `${testName}-${testId}.txt`
    files.push(fullname)
    fs.renameSync(currentFile, fullname)
    currentFile = testName = testId = null
  }
})

await events.once(rl, 'close')

if (submission) {
  const archive = archiver('zip')
  const zip = fs.createWriteStream(`${planId}-client-data.zip`)
  archive.pipe(zip)
  for (const file of files) {
    archive.file(file, { name: file })
  }
  await archive.finalize()
  for (const file of files) {
    fs.unlinkSync(file)
  }
  await events.once(zip, 'close')
}

fs.unlinkSync(input)
