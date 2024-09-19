// @ts-ignore
import { app } from 'electron'
import QUnit from 'qunit'
import run from './run.js'

app.on('ready', () => {
  run(QUnit, (stats) => {
    if (stats?.failed !== 0) {
      // @ts-ignore
      app.exit(1)
    } else {
      app.exit(0)
    }
  })
})
