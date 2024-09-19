import type QUnit from 'qunit'

export default async (
  QUnit: QUnit,
  done: (details: QUnit.DoneDetails) => void,
) => {
  // @ts-ignore
  QUnit.reporters.tap.init(QUnit)
  QUnit.config.autostart = false
  QUnit.config.testTimeout = 60_000

  const modules = await Promise.all([
    import('./end2end-client-credentials.js'),
    import('./end2end-device-code.js'),
    import('./end2end.js'),
  ])
  for (const { default: module } of modules) {
    await module(QUnit)
  }
  QUnit.start()
  QUnit.done(done)
}
