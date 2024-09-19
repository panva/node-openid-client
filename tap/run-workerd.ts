import QUnit from 'qunit'
import run from './run.js'

export default {
  async test() {
    await new Promise((resolve, reject) => {
      run(QUnit, (results) => {
        if (results?.failed !== 0) {
          reject()
        } else {
          // @ts-ignore
          resolve()
        }
      })
    })
  },
}
