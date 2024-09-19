import QUnit from 'qunit'
import run from './run.js'

const stats: QUnit.DoneDetails = await new Promise((resolve) => {
  run(QUnit, resolve)
})

if (stats?.failed !== 0) {
  // @ts-ignore
  process.exit(1)
}
