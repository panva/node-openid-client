const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
const { version } = require('./package.json')

const updates = [
  ['./src/index.ts', /const VERSION = 'v\d+\.\d+\.\d+'/gm, `const VERSION = 'v${version}'`],
  ['./build/index.js', /const VERSION = 'v\d+\.\d+\.\d+'/gm, `const VERSION = 'v${version}'`, false],
]

for (const [path, regex, replace, gitAdd = true] of updates) {
  writeFileSync(path, readFileSync(path, { encoding: 'utf-8' }).replace(regex, replace))
  if (gitAdd) execSync(`git add ${path}`, { stdio: 'inherit' })
}

execSync('git add build/* -f', { stdio: 'inherit' })
