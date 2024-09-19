import test from 'ava'

import { downloadArtifact } from './api.js'
import { plan } from './runner.js'

test('downloading artifact', async (t) => {
  await downloadArtifact(plan)
  t.pass()
})
