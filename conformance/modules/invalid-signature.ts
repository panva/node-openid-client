import { rejects, skippable } from './run.js'
import { plan, nonRepudiation } from '../runner.js'

if (nonRepudiation(plan)) {
  rejects(
    import.meta.url,
    { code: 'OAUTH_INVALID_RESPONSE' },
    {
      name: 'OperationProcessingError',
      message: /signature/,
    },
  )
} else {
  skippable(import.meta.url)
}
